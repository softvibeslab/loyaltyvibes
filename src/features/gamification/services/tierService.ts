'use client';

import { createClient } from '@/shared/lib/supabase/client';
import { TierLevel } from '@/features/auth/types';
import { calculateTier, TIER_ORDER } from '../constants/tiers';

export interface TierPromotionResult {
  promoted: boolean;
  previousTier: TierLevel;
  newTier: TierLevel;
}

class TierService {
  private supabase = createClient();

  async checkAndPromoteTier(userId: string): Promise<TierPromotionResult | null> {
    // Get current profile
    const { data: profile, error } = await this.supabase
      .from('profiles')
      .select('tier, total_spent, visit_count')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      console.error('Error fetching profile for tier check:', error);
      return null;
    }

    const currentTier = profile.tier as TierLevel;
    const calculatedTier = calculateTier(profile.total_spent, profile.visit_count);

    // Check if promotion is needed
    const currentIndex = TIER_ORDER.indexOf(currentTier);
    const calculatedIndex = TIER_ORDER.indexOf(calculatedTier);

    if (calculatedIndex > currentIndex) {
      // Promote user
      const { error: updateError } = await this.supabase
        .from('profiles')
        .update({
          tier: calculatedTier,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error promoting tier:', updateError);
        return null;
      }

      return {
        promoted: true,
        previousTier: currentTier,
        newTier: calculatedTier,
      };
    }

    return {
      promoted: false,
      previousTier: currentTier,
      newTier: currentTier,
    };
  }

  async getTierHistory(userId: string): Promise<Array<{
    tier: TierLevel;
    achieved_at: string;
  }>> {
    // This would require a separate tier_history table
    // For now, return empty array
    return [];
  }

  async getLeaderboard(limit: number = 10): Promise<Array<{
    id: string;
    name: string;
    tier: TierLevel;
    points_balance: number;
  }>> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('id, name, tier, points_balance')
      .eq('role', 'customer')
      .order('points_balance', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    return data as Array<{
      id: string;
      name: string;
      tier: TierLevel;
      points_balance: number;
    }>;
  }
}

export const tierService = new TierService();
