'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import {
  addOfflineTransaction,
  OfflineTransaction,
} from '@/shared/lib/db/dexie';
import { transactionService } from '../services/transactionService';
import { TierLevel } from '@/features/auth/types';

interface UseOfflineMutationReturn {
  createTransaction: (data: {
    userId: string;
    amount: number;
    tier: TierLevel;
    description: string;
    staffId?: string;
  }) => Promise<{ success: boolean; offline: boolean; syncId?: string }>;
  isPending: boolean;
  error: string | null;
}

export function useOfflineMutation(): UseOfflineMutationReturn {
  const { isOnline } = useOnlineStatus();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = useCallback(
    async (data: {
      userId: string;
      amount: number;
      tier: TierLevel;
      description: string;
      staffId?: string;
    }) => {
      setIsPending(true);
      setError(null);

      const syncId = uuidv4();

      try {
        if (isOnline) {
          // Online: Create transaction directly
          const result = await transactionService.createEarnTransaction(
            data.userId,
            data.amount,
            data.tier,
            data.description,
            data.staffId
          );

          if (result) {
            return { success: true, offline: false };
          }

          throw new Error('Error al crear transacción');
        } else {
          // Offline: Save to IndexedDB
          await addOfflineTransaction({
            sync_id: syncId,
            user_id: data.userId,
            type: 'earn',
            amount: data.amount,
            description: data.description,
            tier: data.tier,
            created_at: new Date().toISOString(),
          });

          return { success: true, offline: true, syncId };
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);

        // If online fails, try to save offline
        if (isOnline) {
          try {
            await addOfflineTransaction({
              sync_id: syncId,
              user_id: data.userId,
              type: 'earn',
              amount: data.amount,
              description: data.description,
              tier: data.tier,
              created_at: new Date().toISOString(),
            });

            return { success: true, offline: true, syncId };
          } catch {
            return { success: false, offline: false };
          }
        }

        return { success: false, offline: false };
      } finally {
        setIsPending(false);
      }
    },
    [isOnline]
  );

  return {
    createTransaction,
    isPending,
    error,
  };
}

// Hook for pending offline count
export function useOfflinePendingCount() {
  const [count, setCount] = useState(0);

  // This would be implemented with a Dexie live query
  // For now, return 0
  return count;
}
