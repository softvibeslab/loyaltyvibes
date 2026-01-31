import { z } from 'zod';
import { TierLevel } from '@/features/auth/types';

// Transaction types
export const TRANSACTION_TYPES = ['earn', 'redeem', 'adjustment', 'expiry'] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

// Transaction status
export const TRANSACTION_STATUS = ['pending', 'completed', 'cancelled', 'failed'] as const;
export type TransactionStatus = (typeof TRANSACTION_STATUS)[number];

// Transaction schema for validation
export const createTransactionSchema = z.object({
  user_id: z.string().uuid('ID de usuario inválido'),
  type: z.enum(TRANSACTION_TYPES),
  amount: z.number().positive('El monto debe ser positivo'),
  points: z.number().int('Los puntos deben ser enteros'),
  description: z.string().min(1, 'Descripción requerida').max(255),
  reference_id: z.string().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

// Transaction record from database
export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  points: number;
  points_before: number;
  points_after: number;
  multiplier_applied: number;
  tier_at_transaction: TierLevel;
  description: string;
  reference_id: string | null;
  status: TransactionStatus;
  created_at: string;
  processed_at: string | null;
  staff_id: string | null;
}

// Points calculation input
export interface PointsCalculationInput {
  amount: number;
  tier: TierLevel;
  bonusMultiplier?: number;
}

// Points calculation result
export interface PointsCalculationResult {
  basePoints: number;
  tierMultiplier: number;
  bonusMultiplier: number;
  totalPoints: number;
  breakdown: {
    base: number;
    tierBonus: number;
    bonus: number;
  };
}

// Transaction summary for dashboard
export interface TransactionSummary {
  totalEarned: number;
  totalRedeemed: number;
  totalTransactions: number;
  lastTransaction: Transaction | null;
  thisMonthEarned: number;
  thisMonthRedeemed: number;
}

// Redemption schema
export const redeemPointsSchema = z.object({
  user_id: z.string().uuid('ID de usuario inválido'),
  points: z.number().int().positive('Los puntos deben ser positivos'),
  description: z.string().min(1, 'Descripción requerida'),
  reward_id: z.string().optional(),
});

export type RedeemPointsInput = z.infer<typeof redeemPointsSchema>;

// Staff transaction schema (for scanning)
export const staffTransactionSchema = z.object({
  customer_email: z.string().email('Email inválido'),
  amount: z.number().positive('El monto debe ser positivo'),
  description: z.string().default('Compra en establecimiento'),
});

export type StaffTransactionInput = z.infer<typeof staffTransactionSchema>;
