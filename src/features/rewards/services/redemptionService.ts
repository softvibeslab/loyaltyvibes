import { createClient } from '@/shared/lib/supabase/client';
import { TierLevel } from '@/features/auth/types';
import { transactionService } from '@/features/transactions/services/transactionService';
import { pointsService } from '@/features/transactions/services/pointsService';
import {
  Redemption,
  RedemptionWithReward,
  RedeemRewardInput,
  ClaimRedemptionInput,
  RedemptionResult,
  UserRedemptionSummary,
} from '../types';

class RedemptionService {
  private supabase = createClient();

  /**
   * Generar código de canje único
   * Format: LV-XXXX-XXXX-XXXX
   */
  async generateRedemptionCode(): Promise<string> {
    const { data, error } = await this.supabase
      .rpc('generate_redemption_code');

    if (error || !data) {
      console.error('[REDEMPTION] Error generating code:', error);
      throw new Error('Error al generar código de canje');
    }

    return data as string;
  }

  /**
   * Canjear recompensa por puntos
   */
  async redeemReward(input: RedeemRewardInput): Promise<RedemptionResult> {
    try {
      // Step 1: Get user profile
      const { data: profile, error: profileError } = await this.supabase
        .from('profiles')
        .select('id, tier, points_balance')
        .eq('id', input.user_id)
        .single();

      if (profileError || !profile) {
        return {
          success: false,
          error: 'Usuario no encontrado',
        };
      }

      // Step 2: Get reward details
      const { data: reward, error: rewardError } = await this.supabase
        .from('rewards')
        .select('*')
        .eq('id', input.reward_id)
        .single();

      if (rewardError || !reward) {
        return {
          success: false,
          error: 'Recompensa no encontrada',
        };
      }

      // Step 3: Validate reward is active
      if (!reward.is_active) {
        return {
          success: false,
          error: 'Recompensa no disponible',
        };
      }

      // Step 4: Validate tier requirement
      const tierOrder = { explorador: 1, conocedor: 2, embajador: 3 };
      const userTierLevel = tierOrder[profile.tier as TierLevel];
      const requiredTierLevel = tierOrder[reward.min_tier as TierLevel];

      if (userTierLevel < requiredTierLevel) {
        return {
          success: false,
          error: `Requiere tier ${reward.min_tier} o superior`,
        };
      }

      // Step 5: Validate user has enough points
      if (profile.points_balance < reward.points_cost) {
        return {
          success: false,
          error: `Puntos insuficientes. Requiere ${reward.points_cost} puntos`,
        };
      }

      // Step 6: Check stock for limited rewards
      if (reward.is_limited && (reward.stock === null || reward.stock <= 0)) {
        return {
          success: false,
          error: 'Recompensa agotada',
        };
      }

      // Step 7: Create redemption transaction
      const redemptionCode = await this.generateRedemptionCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // Expires in 30 days

      const { data: redemption, error: redemptionError } = await this.supabase
        .from('redemptions')
        .insert({
          user_id: input.user_id,
          reward_id: input.reward_id,
          points_used: reward.points_cost,
          redemption_code: redemptionCode,
          status: 'pending',
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (redemptionError || !redemption) {
        console.error('[REDEMPTION] Error creating redemption:', redemptionError);
        return {
          success: false,
          error: 'Error al crear canje',
        };
      }

      // Step 8: Create points transaction (will be handled by trigger)
      const description = `Canje: ${reward.name}`;
      const transaction = await transactionService.createRedeemTransaction(
        input.user_id,
        reward.points_cost,
        description,
        input.reward_id
      );

      if (!transaction) {
        // Rollback redemption if transaction fails
        await this.supabase
          .from('redemptions')
          .delete()
          .eq('id', redemption.id);

        return {
          success: false,
          error: 'Error al procesar transacción de puntos',
        };
      }

      // Step 9: Link transaction to redemption
      await this.supabase
        .from('redemptions')
        .update({ transaction_id: transaction.id })
        .eq('id', redemption.id);

      // Step 10: Fetch full redemption with reward details
      const redemptionWithReward = await this.getRedemptionById(redemption.id);

      console.log('[REDEMPTION] Reward redeemed:', {
        userId: input.user_id,
        rewardId: input.reward_id,
        code: redemptionCode,
      });

      return {
        success: true,
        redemption: redemptionWithReward,
        code: redemptionCode,
      };
    } catch (error) {
      console.error('[REDEMPTION] Unexpected error:', error);
      return {
        success: false,
        error: 'Error inesperado al canjear recompensa',
      };
    }
  }

  /**
   * Reclamar canje (marcar como reclamado)
   */
  async claimRedemption(input: ClaimRedemptionInput): Promise<RedemptionResult> {
    try {
      // Step 1: Find redemption by code
      const { data: redemption, error: redemptionError } = await this.supabase
        .from('redemptions')
        .select('*, rewards(*)')
        .eq('redemption_code', input.code)
        .single();

      if (redemptionError || !redemption) {
        return {
          success: false,
          error: 'Código de canje inválido',
        };
      }

      // Step 2: Check if already claimed
      if (redemption.status === 'claimed') {
        return {
          success: false,
          error: 'Este canje ya fue reclamado',
        };
      }

      // Step 3: Check if expired
      if (redemption.status === 'expired') {
        return {
          success: false,
          error: 'Este canje ha expirado',
        };
      }

      if (redemption.status === 'cancelled') {
        return {
          success: false,
          error: 'Este canje fue cancelado',
        };
      }

      // Step 4: Check expiration date
      const now = new Date();
      const expiresAt = new Date(redemption.expires_at);
      if (now > expiresAt) {
        // Auto-expire
        await this.supabase
          .from('redemptions')
          .update({ status: 'expired' })
          .eq('id', redemption.id);

        return {
          success: false,
          error: 'Este canje ha expirado',
        };
      }

      // Step 5: Mark as claimed
      const { data: updated, error: updateError } = await this.supabase
        .from('redemptions')
        .update({ status: 'claimed' })
        .eq('id', redemption.id)
        .select('*, rewards(*)')
        .single();

      if (updateError || !updated) {
        console.error('[REDEMPTION] Error claiming redemption:', updateError);
        return {
          success: false,
          error: 'Error al reclamar canje',
        };
      }

      console.log('[REDEMPTION] Redemption claimed:', {
        code: input.code,
        userId: redemption.user_id,
      });

      return {
        success: true,
        redemption: updated as RedemptionWithReward,
      };
    } catch (error) {
      console.error('[REDEMPTION] Error claiming:', error);
      return {
        success: false,
        error: 'Error inesperado al reclamar canje',
      };
    }
  }

  /**
   * Cancelar canje (devolver puntos al usuario)
   */
  async cancelRedemption(redemptionId: string, userId: string): Promise<boolean> {
    try {
      // Get redemption details
      const { data: redemption } = await this.supabase
        .from('redemptions')
        .select('*')
        .eq('id', redemptionId)
        .single();

      if (!redemption) {
        console.error('[REDEMPTION] Redemption not found');
        return false;
      }

      // Verify ownership
      if (redemption.user_id !== userId) {
        console.error('[REDEMPTION] User not authorized');
        return false;
      }

      // Can only cancel pending redemptions
      if (redemption.status !== 'pending') {
        console.error('[REDEMPTION] Cannot cancel non-pending redemption');
        return false;
      }

      // Update status to cancelled (trigger will restore stock)
      const { error } = await this.supabase
        .from('redemptions')
        .update({ status: 'cancelled' })
        .eq('id', redemptionId);

      if (error) {
        console.error('[REDEMPTION] Error cancelling redemption:', error);
        return false;
      }

      // Restore points to user (create adjustment transaction)
      const description = 'Cancelación de canje - Puntos devueltos';
      await transactionService.createRedeemTransaction(
        userId,
        -redemption.points_used, // Negative to add points back
        description
      );

      console.log('[REDEMPTION] Redemption cancelled:', redemptionId);
      return true;
    } catch (error) {
      console.error('[REDEMPTION] Error cancelling:', error);
      return false;
    }
  }

  /**
   * Obtener canjes de un usuario
   */
  async getUserRedemptions(
    userId: string,
    status?: string
  ): Promise<RedemptionWithReward[]> {
    let query = this.supabase
      .from('redemptions')
      .select('*, rewards(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[REDEMPTION] Error fetching user redemptions:', error);
      return [];
    }

    return data as RedemptionWithReward[];
  }

  /**
   * Obtener canje por ID
   */
  async getRedemptionById(id: string): Promise<RedemptionWithReward | null> {
    const { data, error } = await this.supabase
      .from('redemptions')
      .select('*, rewards(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[REDEMPTION] Error fetching redemption by ID:', error);
      return null;
    }

    return data as RedemptionWithReward | null;
  }

  /**
   * Obtener resumen de canjes de usuario
   */
  async getUserRedemptionSummary(userId: string): Promise<UserRedemptionSummary> {
    const { data, error } = await this.supabase
      .from('redemptions')
      .select('*, rewards(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[REDEMPTION] Error fetching summary:', error);
      return {
        total_redemptions: 0,
        pending_redemptions: 0,
        claimed_redemptions: 0,
        expired_redemptions: 0,
        total_points_redeemed: 0,
        last_redemption: null,
      };
    }

    const redemptions = data as RedemptionWithReward[];

    const summary: UserRedemptionSummary = {
      total_redemptions: redemptions.length,
      pending_redemptions: redemptions.filter(r => r.status === 'pending').length,
      claimed_redemptions: redemptions.filter(r => r.status === 'claimed').length,
      expired_redemptions: redemptions.filter(r => r.status === 'expired').length,
      total_points_redeemed: redemptions.reduce((sum, r) => sum + r.points_used, 0),
      last_redemption: redemptions[0] || null,
    };

    return summary;
  }

  /**
   * Expirar canjes pendientes vencidos (admin/staff or cron job)
   */
  async expirePendingRedemptions(): Promise<number> {
    const { data, error } = await this.supabase
      .rpc('expire_pending_redemptions');

    if (error) {
      console.error('[REDEMPTION] Error expiring redemptions:', error);
      return 0;
    }

    console.log('[REDEMPTION] Expired pending redemptions');
    return data as number;
  }
}

export const redemptionService = new RedemptionService();
