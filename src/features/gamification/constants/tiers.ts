import { TierLevel } from '@/features/auth/types';

export const TIER_THRESHOLDS = {
  explorador: { visits: 0, spent: 0, multiplier: 1.0 },
  conocedor: { visits: 5, spent: 5000, multiplier: 1.2 },
  embajador: { visits: 15, spent: 15000, multiplier: 1.5 },
} as const;

export const TIER_ORDER: TierLevel[] = ['explorador', 'conocedor', 'embajador'];

export const TIER_BENEFITS = {
  explorador: [
    'Acumula 1 punto por cada $10 MXN',
    'Acceso a promociones básicas',
    'Historial de transacciones',
  ],
  conocedor: [
    'Multiplicador 1.2x en puntos',
    'Promociones exclusivas',
    'Prioridad en reservaciones',
    'Regalo de cumpleaños',
  ],
  embajador: [
    'Multiplicador 1.5x en puntos',
    'Acceso VIP a eventos',
    'Descuentos especiales',
    'Atención personalizada',
    'Invitaciones exclusivas',
  ],
} as const;

export const POINTS_PER_PESO = 0.1; // 1 punto por cada $10 MXN

export function getMultiplier(tier: TierLevel): number {
  return TIER_THRESHOLDS[tier].multiplier;
}

export function getNextTier(current: TierLevel): TierLevel | null {
  const currentIndex = TIER_ORDER.indexOf(current);
  return currentIndex < TIER_ORDER.length - 1 ? TIER_ORDER[currentIndex + 1] : null;
}

export function getPreviousTier(current: TierLevel): TierLevel | null {
  const currentIndex = TIER_ORDER.indexOf(current);
  return currentIndex > 0 ? TIER_ORDER[currentIndex - 1] : null;
}

export function calculateTier(totalSpent: number, visitCount: number): TierLevel {
  // Check from highest tier to lowest
  for (let i = TIER_ORDER.length - 1; i >= 0; i--) {
    const tier = TIER_ORDER[i];
    const threshold = TIER_THRESHOLDS[tier];

    if (totalSpent >= threshold.spent && visitCount >= threshold.visits) {
      return tier;
    }
  }

  return 'explorador';
}

export function getTierProgress(
  currentTier: TierLevel,
  totalSpent: number,
  visitCount: number
): {
  nextTier: TierLevel | null;
  spentProgress: number;
  visitsProgress: number;
  overallProgress: number;
} {
  const nextTier = getNextTier(currentTier);

  if (!nextTier) {
    return {
      nextTier: null,
      spentProgress: 100,
      visitsProgress: 100,
      overallProgress: 100,
    };
  }

  const currentThreshold = TIER_THRESHOLDS[currentTier];
  const nextThreshold = TIER_THRESHOLDS[nextTier];

  const spentRange = nextThreshold.spent - currentThreshold.spent;
  const visitsRange = nextThreshold.visits - currentThreshold.visits;

  const spentProgress = spentRange > 0
    ? Math.min(((totalSpent - currentThreshold.spent) / spentRange) * 100, 100)
    : 100;

  const visitsProgress = visitsRange > 0
    ? Math.min(((visitCount - currentThreshold.visits) / visitsRange) * 100, 100)
    : 100;

  // Overall progress is the minimum of both (need both to level up)
  const overallProgress = Math.min(spentProgress, visitsProgress);

  return {
    nextTier,
    spentProgress: Math.max(0, spentProgress),
    visitsProgress: Math.max(0, visitsProgress),
    overallProgress: Math.max(0, overallProgress),
  };
}
