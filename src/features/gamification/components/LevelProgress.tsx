'use client';

import { TierLevel } from '@/features/auth/types';
import { TierBadge } from '@/shared/components/ui/TierBadge';
import { useTierCalculation } from '../hooks/useTierCalculation';
import { TIER_BENEFITS, TIER_THRESHOLDS } from '../constants/tiers';

interface LevelProgressProps {
  currentTier: TierLevel;
  totalSpent: number;
  visitCount: number;
  showBenefits?: boolean;
}

export function LevelProgress({
  currentTier,
  totalSpent,
  visitCount,
  showBenefits = true,
}: LevelProgressProps) {
  const { progress, multiplier, benefits, shouldPromote } = useTierCalculation({
    totalSpent,
    visitCount,
    currentTier,
  });

  return (
    <div className="space-y-4">
      {/* Promotion Alert */}
      {shouldPromote && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-semibold text-amber-800">¡Felicidades!</p>
              <p className="text-sm text-amber-700">
                Has cumplido los requisitos para subir de nivel.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current Level Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Tu nivel actual</p>
            <TierBadge tier={currentTier} size="lg" />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Multiplicador</p>
            <p className="text-2xl font-bold text-emerald-600">{multiplier}x</p>
          </div>
        </div>

        {/* Progress to Next Level */}
        {progress.nextTier && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Progreso hacia {' '}
                <span className="capitalize">{progress.nextTier}</span>
              </span>
              <span className="text-sm font-bold text-gray-900">
                {Math.round(progress.overallProgress)}%
              </span>
            </div>

            {/* Combined Progress Bar */}
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700 ease-out rounded-full"
                style={{ width: `${progress.overallProgress}%` }}
              />
            </div>

            {/* Individual Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Gasto</span>
                  <span className="text-xs font-medium text-blue-600">
                    {Math.round(progress.spentProgress)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${progress.spentProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  ${totalSpent.toLocaleString()} / $
                  {TIER_THRESHOLDS[progress.nextTier].spent.toLocaleString()}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Visitas</span>
                  <span className="text-xs font-medium text-green-600">
                    {Math.round(progress.visitsProgress)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${progress.visitsProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  {visitCount} / {TIER_THRESHOLDS[progress.nextTier].visits} visitas
                </p>
              </div>
            </div>
          </div>
        )}

        {!progress.nextTier && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <span className="text-2xl">👑</span>
            <p className="text-sm text-purple-600 font-medium mt-1">
              ¡Has alcanzado el nivel máximo!
            </p>
          </div>
        )}
      </div>

      {/* Benefits List */}
      {showBenefits && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h4 className="font-semibold text-gray-900 mb-3">
            Beneficios de {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
          </h4>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-emerald-500 mt-0.5">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
