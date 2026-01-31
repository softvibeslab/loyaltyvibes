'use client';

import { useMemo } from 'react';
import { TierLevel } from '@/features/auth/types';
import {
  calculateTier,
  getTierProgress,
  getMultiplier,
  TIER_BENEFITS,
} from '../constants/tiers';

interface UseTierCalculationProps {
  totalSpent: number;
  visitCount: number;
  currentTier: TierLevel;
}

interface UseTierCalculationReturn {
  calculatedTier: TierLevel;
  shouldPromote: boolean;
  progress: {
    nextTier: TierLevel | null;
    spentProgress: number;
    visitsProgress: number;
    overallProgress: number;
  };
  multiplier: number;
  benefits: readonly string[];
}

export function useTierCalculation({
  totalSpent,
  visitCount,
  currentTier,
}: UseTierCalculationProps): UseTierCalculationReturn {
  return useMemo(() => {
    const calculatedTier = calculateTier(totalSpent, visitCount);
    const shouldPromote = calculatedTier !== currentTier &&
      ['conocedor', 'embajador'].indexOf(calculatedTier) > ['conocedor', 'embajador'].indexOf(currentTier);

    const progress = getTierProgress(currentTier, totalSpent, visitCount);
    const multiplier = getMultiplier(currentTier);
    const benefits = TIER_BENEFITS[currentTier];

    return {
      calculatedTier,
      shouldPromote,
      progress,
      multiplier,
      benefits,
    };
  }, [totalSpent, visitCount, currentTier]);
}

// Hook to calculate points earned with tier multiplier
export function usePointsCalculation() {
  const calculatePoints = useMemo(() => {
    return (amount: number, tier: TierLevel): number => {
      const multiplier = getMultiplier(tier);
      const basePoints = amount * 0.1; // 1 punto por $10 MXN
      return Math.floor(basePoints * multiplier);
    };
  }, []);

  return { calculatePoints };
}
