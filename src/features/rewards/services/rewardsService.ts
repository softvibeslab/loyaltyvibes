import { createClient } from '@/shared/lib/supabase/client';
import { TierLevel } from '@/features/auth/types';
import {
  Reward,
  RewardWithAvailability,
  CreateRewardInput,
  UpdateRewardInput,
  RewardFilterOptions,
  AvailabilityCheck,
} from '../types';

class RewardsService {
  private supabase = createClient();

  /**
   * Obtener recompensas activas filtradas por tier del usuario
   */
  async getActiveRewards(
    userTier: TierLevel,
    options: RewardFilterOptions = {}
  ): Promise<RewardWithAvailability[]> {
    const { category, max_points, user_points } = options;

    // Tier hierarchy: explorador < conocedor < embajador
    const tierOrder = { explorador: 1, conocedor: 2, embajador: 3 };
    const userTierLevel = tierOrder[userTier];

    let query = this.supabase
      .from('rewards')
      .select('*')
      .eq('is_active', true)
      .order('points_cost', { ascending: true });

    // Filter by user's tier or lower
    // Users can see rewards for their tier and all lower tiers
    const eligibleTiers: TierLevel[] = [];
    if (userTierLevel >= 1) eligibleTiers.push('explorador');
    if (userTierLevel >= 2) eligibleTiers.push('conocedor');
    if (userTierLevel >= 3) eligibleTiers.push('embajador');

    query = query.in('min_tier', eligibleTiers);

    // Optional: filter by category
    if (category) {
      query = query.eq('category', category);
    }

    // Optional: filter by max points
    if (max_points !== undefined) {
      query = query.lte('points_cost', max_points);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[REWARDS] Error fetching active rewards:', error);
      throw new Error('Error al cargar recompensas disponibles');
    }

    // Enrich with availability information
    const rewards: RewardWithAvailability[] = (data as Reward[]).map(
      (reward) => {
        const can_afford =
          user_points !== undefined ? user_points >= reward.points_cost : false;
        const meets_tier_requirement =
          tierOrder[reward.min_tier as TierLevel] <= userTierLevel;

        const stock_remaining = reward.is_limited ? reward.stock : null;

        // Check availability
        let available = meets_tier_requirement;
        if (available && reward.is_limited) {
          available = reward.stock !== null && reward.stock > 0;
        }

        return {
          ...reward,
          available,
          can_afford,
          meets_tier_requirement,
          stock_remaining,
        };
      }
    );

    return rewards;
  }

  /**
   * Obtener recompensa por ID
   */
  async getRewardById(id: string): Promise<Reward | null> {
    const { data, error } = await this.supabase
      .from('rewards')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[REWARDS] Error fetching reward by ID:', error);
      return null;
    }

    return data as Reward | null;
  }

  /**
   * Verificar disponibilidad de una recompensa
   */
  async checkAvailability(rewardId: string): Promise<AvailabilityCheck> {
    // First try to use the database function for atomic check
    const { data, error } = await this.supabase
      .rpc('is_reward_available', { reward_id: rewardId });

    if (error) {
      console.error('[REWARDS] Error checking availability:', error);
      return {
        available: false,
        reason: 'Error al verificar disponibilidad',
        stock_remaining: null,
      };
    }

    if (!data) {
      return {
        available: false,
        reason: 'Recompensa no encontrada o inactiva',
        stock_remaining: null,
      };
    }

    // Fetch stock information
    const reward = await this.getRewardById(rewardId);

    if (!reward) {
      return {
        available: false,
        reason: 'Recompensa no encontrada',
        stock_remaining: null,
      };
    }

    // Check stock for limited rewards
    if (reward.is_limited) {
      if (reward.stock === null || reward.stock <= 0) {
        return {
          available: false,
          reason: 'Recompensa agotada',
          stock_remaining: 0,
        };
      }
      return {
        available: true,
        stock_remaining: reward.stock,
      };
    }

    return {
      available: true,
      stock_remaining: null,
    };
  }

  /**
   * Decrement stock for a limited reward
   * Note: This is also handled automatically by the database trigger
   */
  async decrementStock(rewardId: string): Promise<boolean> {
    const { data: reward } = await this.supabase
      .from('rewards')
      .select('is_limited, stock')
      .eq('id', rewardId)
      .single();

    if (!reward) {
      console.error('[REWARDS] Reward not found for stock decrement');
      return false;
    }

    if (!reward.is_limited) {
      // Unlimited reward, no need to decrement
      return true;
    }

    if (reward.stock === null || reward.stock <= 0) {
      console.error('[REWARDS] Cannot decrement: stock is empty');
      return false;
    }

    const { error } = await this.supabase
      .from('rewards')
      .update({ stock: reward.stock - 1 })
      .eq('id', rewardId)
      .gt('stock', 0);

    if (error) {
      console.error('[REWARDS] Error decrementing stock:', error);
      return false;
    }

    return true;
  }

  /**
   * Crear nueva recompensa (admin/staff only)
   */
  async createReward(input: CreateRewardInput): Promise<Reward | null> {
    const { data, error } = await this.supabase
      .from('rewards')
      .insert({
        name: input.name,
        description: input.description,
        points_cost: input.points_cost,
        stock: input.stock,
        image_url: input.image_url,
        min_tier: input.min_tier,
        category: input.category,
        is_active: input.is_active ?? true,
        is_limited: input.is_limited ?? false,
      })
      .select()
      .single();

    if (error) {
      console.error('[REWARDS] Error creating reward:', error);
      throw new Error('Error al crear recompensa');
    }

    console.log('[REWARDS] Reward created:', data.name);
    return data as Reward;
  }

  /**
   * Actualizar recompensa existente (admin/staff only)
   */
  async updateReward(id: string, input: UpdateRewardInput): Promise<Reward | null> {
    const { data, error } = await this.supabase
      .from('rewards')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[REWARDS] Error updating reward:', error);
      throw new Error('Error al actualizar recompensa');
    }

    console.log('[REWARDS] Reward updated:', data.name);
    return data as Reward;
  }

  /**
   * Desactivar recompensa (soft delete)
   */
  async deactivateReward(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('rewards')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('[REWARDS] Error deactivating reward:', error);
      return false;
    }

    console.log('[REWARDS] Reward deactivated:', id);
    return true;
  }

  /**
   * Obtener estadísticas de recompensas (admin/staff only)
   */
  async getRewardStatistics(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('redemption_summary')
      .select('*');

    if (error) {
      console.error('[REWARDS] Error fetching statistics:', error);
      return [];
    }

    return data;
  }

  /**
   * Obtener todas las recompensas (admin/staff only)
   */
  async getAllRewards(includeInactive = false): Promise<Reward[]> {
    let query = this.supabase
      .from('rewards')
      .select('*')
      .order('created_at', { ascending: false });

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[REWARDS] Error fetching all rewards:', error);
      return [];
    }

    return data as Reward[];
  }
}

export const rewardsService = new RewardsService();
