'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { TIER_CONFIG } from '@/features/auth/types';

export default function WalletPage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const tierConfig = TIER_CONFIG[user.tier];

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      {/* Points Card */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-purple-200 text-sm">Tus Puntos</span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
            {tierConfig.label} ({tierConfig.multiplier}x)
          </span>
        </div>
        <div className="text-4xl font-bold mb-2">
          {user.points_balance.toLocaleString()}
        </div>
        <p className="text-purple-200 text-sm">puntos disponibles</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Visitas</p>
          <p className="text-2xl font-bold text-gray-900">{user.visit_count}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Total Gastado</p>
          <p className="text-2xl font-bold text-gray-900">
            ${user.total_spent.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tier Progress */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Progreso de Nivel</h3>
        {user.tier === 'explorador' && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Hacia Conocedor</span>
              <span className="text-gray-900 font-medium">
                {Math.min(100, (user.visit_count / 5) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all"
                style={{ width: `${Math.min(100, (user.visit_count / 5) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {5 - user.visit_count > 0
                ? `${5 - user.visit_count} visitas mas o $${(5000 - user.total_spent).toLocaleString()} para subir`
                : 'Listo para subir de nivel!'}
            </p>
          </div>
        )}
        {user.tier === 'conocedor' && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Hacia Embajador</span>
              <span className="text-gray-900 font-medium">
                {Math.min(100, (user.visit_count / 15) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (user.visit_count / 15) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {15 - user.visit_count > 0
                ? `${15 - user.visit_count} visitas mas o $${(15000 - user.total_spent).toLocaleString()} para subir`
                : 'Listo para subir de nivel!'}
            </p>
          </div>
        )}
        {user.tier === 'embajador' && (
          <p className="text-sm text-gray-600">
            Eres Embajador - el nivel mas alto! Disfrutas de todos los beneficios exclusivos.
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Acciones Rapidas</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-4 bg-purple-50 rounded-lg text-purple-700 font-medium text-sm hover:bg-purple-100 transition-colors">
            Ver Recompensas
          </button>
          <button className="p-4 bg-purple-50 rounded-lg text-purple-700 font-medium text-sm hover:bg-purple-100 transition-colors">
            Historial
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
      >
        Cerrar Sesion
      </button>
    </div>
  );
}
