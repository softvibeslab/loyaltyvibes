import { TierLevel } from '@/features/auth/types';
import { TIER_THRESHOLDS, POINTS_PER_PESO } from '@/features/gamification/constants/tiers';
import {
  PointsCalculationInput,
  PointsCalculationResult,
} from '../types';

class PointsService {
  /**
   * Calculate points earned from a purchase amount
   * Formula: floor(amount * pointsPerPeso * tierMultiplier * bonusMultiplier)
   */
  calculatePoints(input: PointsCalculationInput): PointsCalculationResult {
    const { amount, tier, bonusMultiplier = 1.0 } = input;

    const tierMultiplier = TIER_THRESHOLDS[tier].multiplier;
    const basePoints = Math.floor(amount * POINTS_PER_PESO);
    const tierBonus = Math.floor(basePoints * (tierMultiplier - 1));
    const subtotal = basePoints + tierBonus;
    const bonus = Math.floor(subtotal * (bonusMultiplier - 1));
    const totalPoints = subtotal + bonus;

    return {
      basePoints,
      tierMultiplier,
      bonusMultiplier,
      totalPoints,
      breakdown: {
        base: basePoints,
        tierBonus,
        bonus,
      },
    };
  }

  /**
   * Calculate how much spending is needed to earn X points
   */
  calculateSpendingForPoints(targetPoints: number, tier: TierLevel): number {
    const tierMultiplier = TIER_THRESHOLDS[tier].multiplier;
    // Reverse of: points = floor(amount * pointsPerPeso * multiplier)
    // amount = points / (pointsPerPeso * multiplier)
    return Math.ceil(targetPoints / (POINTS_PER_PESO * tierMultiplier));
  }

  /**
   * Format points for display
   */
  formatPoints(points: number): string {
    if (points >= 1000000) {
      return `${(points / 1000000).toFixed(1)}M`;
    }
    if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K`;
    }
    return points.toLocaleString();
  }

  /**
   * Calculate points value in MXN (for redemption)
   * Default: 100 points = $10 MXN
   */
  calculatePointsValue(points: number, valuePerHundred: number = 10): number {
    return (points / 100) * valuePerHundred;
  }

  /**
   * Calculate points needed for a reward value
   */
  calculatePointsNeeded(rewardValueMXN: number, valuePerHundred: number = 10): number {
    return Math.ceil((rewardValueMXN / valuePerHundred) * 100);
  }

  /**
   * Validate if user has enough points for redemption
   */
  canRedeem(currentBalance: number, requiredPoints: number): boolean {
    return currentBalance >= requiredPoints;
  }

  /**
   * Calculate potential earnings preview
   */
  getEarningsPreview(amount: number, tier: TierLevel): {
    points: number;
    multiplier: number;
    value: number;
  } {
    const result = this.calculatePoints({ amount, tier });
    const value = this.calculatePointsValue(result.totalPoints);

    return {
      points: result.totalPoints,
      multiplier: result.tierMultiplier,
      value,
    };
  }
}

export const pointsService = new PointsService();
