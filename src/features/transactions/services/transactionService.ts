'use client';

import { createClient } from '@/shared/lib/supabase/client';
import { TierLevel } from '@/features/auth/types';
import {
  Transaction,
  TransactionSummary,
  CreateTransactionInput,
  TransactionType,
} from '../types';
import { pointsService } from './pointsService';

class TransactionService {
  private supabase = createClient();

  /**
   * Create an earning transaction (customer purchase)
   */
  async createEarnTransaction(
    userId: string,
    amount: number,
    tier: TierLevel,
    description: string = 'Compra en establecimiento',
    staffId?: string
  ): Promise<Transaction | null> {
    // Calculate points
    const calculation = pointsService.calculatePoints({ amount, tier });

    // Get current balance
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('points_balance')
      .eq('id', userId)
      .single();

    if (!profile) {
      throw new Error('Usuario no encontrado');
    }

    const pointsBefore = profile.points_balance;
    const pointsAfter = pointsBefore + calculation.totalPoints;

    // Create transaction
    const { data: transaction, error } = await this.supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'earn' as TransactionType,
        amount,
        points: calculation.totalPoints,
        points_before: pointsBefore,
        points_after: pointsAfter,
        multiplier_applied: calculation.tierMultiplier,
        tier_at_transaction: tier,
        description,
        staff_id: staffId || null,
        status: 'completed',
        processed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating earn transaction:', error);
      throw new Error('Error al crear la transacción');
    }

    // Update user's points balance and stats
    await this.supabase
      .from('profiles')
      .update({
        points_balance: pointsAfter,
        total_spent: profile.points_balance + amount,
        visit_count: profile.points_balance + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return transaction as Transaction;
  }

  /**
   * Create a redemption transaction
   */
  async createRedeemTransaction(
    userId: string,
    points: number,
    description: string,
    rewardId?: string
  ): Promise<Transaction | null> {
    // Get current balance
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('points_balance, tier')
      .eq('id', userId)
      .single();

    if (!profile) {
      throw new Error('Usuario no encontrado');
    }

    if (profile.points_balance < points) {
      throw new Error('Puntos insuficientes');
    }

    const pointsBefore = profile.points_balance;
    const pointsAfter = pointsBefore - points;

    // Create transaction
    const { data: transaction, error } = await this.supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'redeem' as TransactionType,
        amount: pointsService.calculatePointsValue(points),
        points: -points,
        points_before: pointsBefore,
        points_after: pointsAfter,
        multiplier_applied: 1,
        tier_at_transaction: profile.tier,
        description,
        reference_id: rewardId || null,
        status: 'completed',
        processed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating redeem transaction:', error);
      throw new Error('Error al crear la transacción');
    }

    // Update user's points balance
    await this.supabase
      .from('profiles')
      .update({
        points_balance: pointsAfter,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return transaction as Transaction;
  }

  /**
   * Get transaction history for a user
   */
  async getTransactionHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    return data as Transaction[];
  }

  /**
   * Get transaction summary for dashboard
   */
  async getTransactionSummary(userId: string): Promise<TransactionSummary> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Get all-time stats
    const { data: allTime } = await this.supabase
      .from('transactions')
      .select('type, points')
      .eq('user_id', userId)
      .eq('status', 'completed');

    // Get this month's stats
    const { data: thisMonth } = await this.supabase
      .from('transactions')
      .select('type, points')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('created_at', startOfMonth);

    // Get last transaction
    const { data: lastTx } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const totalEarned = allTime?.filter(t => t.type === 'earn').reduce((sum, t) => sum + t.points, 0) || 0;
    const totalRedeemed = Math.abs(allTime?.filter(t => t.type === 'redeem').reduce((sum, t) => sum + t.points, 0) || 0);
    const thisMonthEarned = thisMonth?.filter(t => t.type === 'earn').reduce((sum, t) => sum + t.points, 0) || 0;
    const thisMonthRedeemed = Math.abs(thisMonth?.filter(t => t.type === 'redeem').reduce((sum, t) => sum + t.points, 0) || 0);

    return {
      totalEarned,
      totalRedeemed,
      totalTransactions: allTime?.length || 0,
      lastTransaction: lastTx as Transaction | null,
      thisMonthEarned,
      thisMonthRedeemed,
    };
  }

  /**
   * Get single transaction by ID
   */
  async getTransaction(transactionId: string): Promise<Transaction | null> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }

    return data as Transaction;
  }
}

export const transactionService = new TransactionService();
