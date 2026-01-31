'use client';

import { useEffect, useState } from 'react';
import { TierBadge, TierMultiplier } from '@/shared/components/ui/TierBadge';
import { pointsService } from '@/features/transactions/services/pointsService';
import { transactionService } from '@/features/transactions/services/transactionService';
import { TransactionSummary } from '@/features/transactions/types';
import { Profile } from '@/features/auth/types';

interface PointsDashboardProps {
  profile: Profile;
}

export function PointsDashboard({ profile }: PointsDashboardProps) {
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      const data = await transactionService.getTransactionSummary(profile.id);
      setSummary(data);
      setLoading(false);
    };

    fetchSummary();
  }, [profile.id]);

  const pointsValue = pointsService.calculatePointsValue(profile.points_balance);

  return (
    <div className="space-y-4">
      {/* Main Points Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-emerald-100 text-sm">Tu balance</p>
            <p className="text-4xl font-bold">
              {pointsService.formatPoints(profile.points_balance)}
            </p>
            <p className="text-emerald-100 text-sm mt-1">
              puntos = ${pointsValue.toLocaleString()} MXN
            </p>
          </div>
          <div className="bg-white/20 rounded-full px-3 py-1">
            <TierBadge tier={profile.tier} size="sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-emerald-400/30">
          <div>
            <p className="text-emerald-100 text-xs">Multiplicador</p>
            <p className="text-xl font-semibold">
              <TierMultiplier tier={profile.tier} />
            </p>
          </div>
          <div>
            <p className="text-emerald-100 text-xs">Visitas</p>
            <p className="text-xl font-semibold">{profile.visit_count}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Total gastado</p>
          <p className="text-lg font-bold text-gray-900">
            ${profile.total_spent.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">MXN</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Este mes</p>
          {loading ? (
            <div className="h-6 bg-gray-100 rounded animate-pulse" />
          ) : (
            <p className="text-lg font-bold text-emerald-600">
              +{pointsService.formatPoints(summary?.thisMonthEarned || 0)}
            </p>
          )}
          <p className="text-xs text-gray-400">puntos</p>
        </div>
      </div>

      {/* Quick Stats */}
      {!loading && summary && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Resumen</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total acumulado</span>
              <span className="font-medium text-emerald-600">
                +{pointsService.formatPoints(summary.totalEarned)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total canjeado</span>
              <span className="font-medium text-orange-600">
                -{pointsService.formatPoints(summary.totalRedeemed)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Transacciones</span>
              <span className="font-medium">{summary.totalTransactions}</span>
            </div>
          </div>
        </div>
      )}

      {/* Last Transaction */}
      {!loading && summary?.lastTransaction && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-2">Última transacción</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {summary.lastTransaction.description}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(summary.lastTransaction.created_at).toLocaleDateString('es-MX', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <span
              className={`text-lg font-bold ${
                summary.lastTransaction.type === 'earn'
                  ? 'text-emerald-600'
                  : 'text-orange-600'
              }`}
            >
              {summary.lastTransaction.type === 'earn' ? '+' : ''}
              {summary.lastTransaction.points.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
