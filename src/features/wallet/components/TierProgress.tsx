'use client';

import { TierLevel } from '@/features/auth/types';
import { TierBadge, TIER_CONFIG } from '@/shared/components/ui/TierBadge';

interface TierProgressProps {
  currentTier: TierLevel;
  totalSpent: number;
  visitCount: number;
}

const TIER_THRESHOLDS = {
  explorador: { visits: 0, spent: 0 },
  conocedor: { visits: 5, spent: 5000 },
  embajador: { visits: 15, spent: 15000 },
} as const;

const TIER_ORDER: TierLevel[] = ['explorador', 'conocedor', 'embajador'];

function getNextTier(current: TierLevel): TierLevel | null {
  const currentIndex = TIER_ORDER.indexOf(current);
  return currentIndex < TIER_ORDER.length - 1 ? TIER_ORDER[currentIndex + 1] : null;
}

function calculateProgress(current: number, target: number, base: number = 0): number {
  if (target <= base) return 100;
  const progress = ((current - base) / (target - base)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

export function TierProgress({ currentTier, totalSpent, visitCount }: TierProgressProps) {
  const nextTier = getNextTier(currentTier);

  if (!nextTier) {
    return (
      <div className="rounded-lg bg-purple-50 p-4 border border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <TierBadge tier={currentTier} size="lg" />
          <span className="text-purple-700 font-medium">¡Nivel máximo alcanzado!</span>
        </div>
        <p className="text-sm text-purple-600">
          Eres un Embajador de LoyaltyVibes. Disfruta del multiplicador 1.5x en todos tus puntos.
        </p>
      </div>
    );
  }

  const currentThreshold = TIER_THRESHOLDS[currentTier];
  const nextThreshold = TIER_THRESHOLDS[nextTier];

  const spentProgress = calculateProgress(totalSpent, nextThreshold.spent, currentThreshold.spent);
  const visitsProgress = calculateProgress(visitCount, nextThreshold.visits, currentThreshold.visits);

  const overallProgress = Math.min(spentProgress, visitsProgress);

  return (
    <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TierBadge tier={currentTier} />
          <span className="text-gray-400">→</span>
          <TierBadge tier={nextTier} />
        </div>
        <span className="text-sm font-medium text-gray-600">
          {Math.round(overallProgress)}% completado
        </span>
      </div>

      {/* Overall Progress Bar */}
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full transition-all duration-500 ${TIER_CONFIG[nextTier].color}`}
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      {/* Detailed Progress */}
      <div className="space-y-3">
        {/* Spending Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Gasto acumulado</span>
            <span className="font-medium">
              ${totalSpent.toLocaleString()} / ${nextThreshold.spent.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${spentProgress}%` }}
            />
          </div>
        </div>

        {/* Visits Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Visitas</span>
            <span className="font-medium">
              {visitCount} / {nextThreshold.visits}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${visitsProgress}%` }}
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Necesitas cumplir ambos requisitos para subir de nivel.
      </p>
    </div>
  );
}

export { TIER_THRESHOLDS };
