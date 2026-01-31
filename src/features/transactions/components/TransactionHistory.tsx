'use client';

import { useEffect, useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { transactionService } from '../services/transactionService';
import { pointsService } from '../services/pointsService';

interface TransactionHistoryProps {
  userId: string;
  limit?: number;
}

const TYPE_CONFIG: Record<TransactionType, { icon: string; color: string; label: string }> = {
  earn: { icon: '💰', color: 'text-emerald-600', label: 'Ganado' },
  redeem: { icon: '🎁', color: 'text-orange-600', label: 'Canjeado' },
  adjustment: { icon: '⚙️', color: 'text-blue-600', label: 'Ajuste' },
  expiry: { icon: '⏰', color: 'text-red-600', label: 'Expirado' },
};

export function TransactionHistory({ userId, limit = 20 }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchTransactions = async (reset = false) => {
    const currentOffset = reset ? 0 : offset;
    setLoading(true);

    const data = await transactionService.getTransactionHistory(userId, limit, currentOffset);

    if (reset) {
      setTransactions(data);
      setOffset(limit);
    } else {
      setTransactions(prev => [...prev, ...data]);
      setOffset(currentOffset + limit);
    }

    setHasMore(data.length === limit);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions(true);
  }, [userId]);

  if (loading && transactions.length === 0) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-100 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="text-4xl">📋</span>
        <p className="text-gray-500 mt-2">No hay transacciones todavía</p>
        <p className="text-sm text-gray-400">
          Tus puntos aparecerán aquí cuando realices compras
        </p>
      </div>
    );
  }

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.created_at).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
        <div key={date}>
          <h4 className="text-sm font-medium text-gray-500 mb-2">{date}</h4>
          <div className="space-y-2">
            {dayTransactions.map(transaction => {
              const config = TYPE_CONFIG[transaction.type];
              const isPositive = transaction.points > 0;

              return (
                <div
                  key={transaction.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{config.label}</span>
                        {transaction.multiplier_applied > 1 && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-600">
                              {transaction.multiplier_applied}x aplicado
                            </span>
                          </>
                        )}
                        {transaction.amount > 0 && transaction.type === 'earn' && (
                          <>
                            <span>•</span>
                            <span>${transaction.amount.toLocaleString()} MXN</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-lg font-bold ${config.color}`}>
                      {isPositive ? '+' : ''}
                      {pointsService.formatPoints(transaction.points)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(transaction.created_at).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Load More */}
      {hasMore && (
        <button
          onClick={() => fetchTransactions(false)}
          disabled={loading}
          className="w-full py-3 text-sm text-emerald-600 font-medium hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Cargar más transacciones'}
        </button>
      )}
    </div>
  );
}
