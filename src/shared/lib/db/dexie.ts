import Dexie, { Table } from 'dexie';
import { Transaction } from '@/features/transactions/types';
import { Profile } from '@/features/auth/types';

// Offline transaction interface
export interface OfflineTransaction {
  id?: number;
  sync_id: string;
  user_id: string;
  type: 'earn' | 'redeem';
  amount: number;
  description: string;
  tier: string;
  created_at: string;
  synced: boolean;
  sync_attempts: number;
  last_sync_attempt?: string;
  error?: string;
}

// Cached profile for offline access
export interface CachedProfile {
  id: string;
  data: Profile;
  updated_at: string;
}

// Pending sync operation
export interface SyncOperation {
  id?: number;
  operation: 'create' | 'update' | 'delete';
  table: string;
  data: Record<string, unknown>;
  created_at: string;
  synced: boolean;
}

class LoyaltyVibesDB extends Dexie {
  offlineTransactions!: Table<OfflineTransaction, number>;
  cachedProfiles!: Table<CachedProfile, string>;
  syncOperations!: Table<SyncOperation, number>;

  constructor() {
    super('LoyaltyVibesDB');

    this.version(1).stores({
      offlineTransactions: '++id, sync_id, user_id, created_at, synced',
      cachedProfiles: 'id, updated_at',
      syncOperations: '++id, operation, table, created_at, synced',
    });
  }
}

// Singleton instance
export const db = new LoyaltyVibesDB();

// Helper functions
export async function addOfflineTransaction(
  transaction: Omit<OfflineTransaction, 'id' | 'synced' | 'sync_attempts'>
): Promise<number> {
  return db.offlineTransactions.add({
    ...transaction,
    synced: false,
    sync_attempts: 0,
  });
}

export async function getPendingTransactions(): Promise<OfflineTransaction[]> {
  return db.offlineTransactions
    .where('synced')
    .equals(0)
    .toArray();
}

export async function markTransactionSynced(id: number): Promise<void> {
  await db.offlineTransactions.update(id, { synced: true });
}

export async function incrementSyncAttempt(id: number, error?: string): Promise<void> {
  const tx = await db.offlineTransactions.get(id);
  if (tx) {
    await db.offlineTransactions.update(id, {
      sync_attempts: tx.sync_attempts + 1,
      last_sync_attempt: new Date().toISOString(),
      error,
    });
  }
}

export async function cacheProfile(profile: Profile): Promise<void> {
  await db.cachedProfiles.put({
    id: profile.id,
    data: profile,
    updated_at: new Date().toISOString(),
  });
}

export async function getCachedProfile(userId: string): Promise<Profile | null> {
  const cached = await db.cachedProfiles.get(userId);
  return cached?.data || null;
}

export async function clearOldCache(maxAgeHours: number = 24): Promise<void> {
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - maxAgeHours);

  await db.cachedProfiles
    .where('updated_at')
    .below(cutoff.toISOString())
    .delete();

  await db.offlineTransactions
    .where('synced')
    .equals(1)
    .and(tx => new Date(tx.created_at) < cutoff)
    .delete();
}

// Export database instance
export default db;
