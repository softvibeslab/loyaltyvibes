'use client';

import {
  db,
  getPendingTransactions,
  markTransactionSynced,
  incrementSyncAttempt,
  OfflineTransaction,
} from '@/shared/lib/db/dexie';
import { transactionService } from './transactionService';
import { TierLevel } from '@/features/auth/types';

const MAX_SYNC_ATTEMPTS = 5;
const SYNC_BATCH_SIZE = 10;

export interface SyncResult {
  synced: number;
  failed: number;
  pending: number;
}

class SyncService {
  private isSyncing = false;
  private syncInterval: NodeJS.Timeout | null = null;

  /**
   * Start background sync with interval
   */
  startBackgroundSync(intervalMs: number = 60000): void {
    if (this.syncInterval) {
      return;
    }

    // Initial sync
    this.syncPendingTransactions();

    // Set up interval
    this.syncInterval = setInterval(() => {
      this.syncPendingTransactions();
    }, intervalMs);

    // Listen for online event
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.syncPendingTransactions();
      });
    }
  }

  /**
   * Stop background sync
   */
  stopBackgroundSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Sync all pending transactions
   */
  async syncPendingTransactions(): Promise<SyncResult> {
    if (this.isSyncing) {
      const pending = await getPendingTransactions();
      return { synced: 0, failed: 0, pending: pending.length };
    }

    if (!navigator.onLine) {
      const pending = await getPendingTransactions();
      return { synced: 0, failed: 0, pending: pending.length };
    }

    this.isSyncing = true;
    let synced = 0;
    let failed = 0;

    try {
      const pendingTxs = await getPendingTransactions();

      // Process in batches
      for (let i = 0; i < pendingTxs.length; i += SYNC_BATCH_SIZE) {
        const batch = pendingTxs.slice(i, i + SYNC_BATCH_SIZE);

        const results = await Promise.allSettled(
          batch.map(tx => this.syncTransaction(tx))
        );

        results.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            synced++;
          } else {
            failed++;
          }
        });
      }

      const remaining = await getPendingTransactions();
      return { synced, failed, pending: remaining.length };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sync a single transaction
   */
  private async syncTransaction(offlineTx: OfflineTransaction): Promise<boolean> {
    if (!offlineTx.id) {
      return false;
    }

    // Check max attempts
    if (offlineTx.sync_attempts >= MAX_SYNC_ATTEMPTS) {
      console.warn(`Transaction ${offlineTx.sync_id} exceeded max sync attempts`);
      return false;
    }

    try {
      if (offlineTx.type === 'earn') {
        const result = await transactionService.createEarnTransaction(
          offlineTx.user_id,
          offlineTx.amount,
          offlineTx.tier as TierLevel,
          `${offlineTx.description} (sincronizado offline)`
        );

        if (result) {
          await markTransactionSynced(offlineTx.id);
          return true;
        }
      }

      throw new Error('Unknown transaction type');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      await incrementSyncAttempt(offlineTx.id, message);
      return false;
    }
  }

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<{
    pending: number;
    failed: number;
    isSyncing: boolean;
  }> {
    const pendingTxs = await getPendingTransactions();
    const failedTxs = pendingTxs.filter(tx => tx.sync_attempts >= MAX_SYNC_ATTEMPTS);

    return {
      pending: pendingTxs.length - failedTxs.length,
      failed: failedTxs.length,
      isSyncing: this.isSyncing,
    };
  }

  /**
   * Retry failed transactions
   */
  async retryFailed(): Promise<number> {
    const pendingTxs = await getPendingTransactions();
    const failedTxs = pendingTxs.filter(tx => tx.sync_attempts >= MAX_SYNC_ATTEMPTS);

    let retried = 0;

    for (const tx of failedTxs) {
      if (tx.id) {
        await db.offlineTransactions.update(tx.id, {
          sync_attempts: 0,
          error: undefined,
        });
        retried++;
      }
    }

    // Trigger sync
    if (retried > 0) {
      this.syncPendingTransactions();
    }

    return retried;
  }

  /**
   * Clear all synced transactions
   */
  async clearSynced(): Promise<number> {
    const count = await db.offlineTransactions
      .where('synced')
      .equals(1)
      .count();

    await db.offlineTransactions
      .where('synced')
      .equals(1)
      .delete();

    return count;
  }
}

export const syncService = new SyncService();
