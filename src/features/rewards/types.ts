import { z } from 'zod';
import { TierLevel } from '@/features/auth/types';

// Reward categories
export const REWARD_CATEGORIES = [
  'food',
  'drink',
  'merchandise',
  'experience',
  'discount',
] as const;
export type RewardCategory = (typeof REWARD_CATEGORIES)[number];

// Redemption status
export const REDEMPTION_STATUS = [
  'pending',
  'claimed',
  'expired',
  'cancelled',
] as const;
export type RedemptionStatus = (typeof REDEMPTION_STATUS)[number];

// Reward schema for validation
export const createRewardSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(100, 'Nombre muy largo'),
  description: z.string().min(1, 'Descripción requerida').max(500, 'Descripción muy larga'),
  points_cost: z.number().int('Los puntos deben ser enteros').positive('El costo debe ser mayor a 0'),
  stock: z.number().int('El stock debe ser entero').nonnegative('El stock no puede ser negativo').optional().nullable(),
  image_url: z.string().url('URL inválida').optional().nullable(),
  min_tier: z.enum(['explorador', 'conocedor', 'embajador'], {
    errorMap: () => ({ message: 'Tier inválido' }),
  }),
  category: z.enum(REWARD_CATEGORIES, {
    errorMap: () => ({ message: 'Categoría inválida' }),
  }),
  is_active: z.boolean().default(true),
  is_limited: z.boolean().default(false),
});

export type CreateRewardInput = z.infer<typeof createRewardSchema>;

// Update reward schema (all fields optional)
export const updateRewardSchema = createRewardSchema.partial();

export type UpdateRewardInput = z.infer<typeof updateRewardSchema>;

// Reward record from database
export interface Reward {
  id: string;
  name: string;
  description: string;
  points_cost: number;
  stock: number | null;
  image_url: string | null;
  min_tier: TierLevel;
  category: RewardCategory;
  is_active: boolean;
  is_limited: boolean;
  created_at: string;
  updated_at: string;
}

// Reward with availability status
export interface RewardWithAvailability extends Reward {
  available: boolean;
  can_afford: boolean;
  meets_tier_requirement: boolean;
  stock_remaining: number | null;
}

// Redemption schema for validation
export const redeemRewardSchema = z.object({
  user_id: z.string().uuid('ID de usuario inválido'),
  reward_id: z.string().uuid('ID de recompensa inválido'),
});

export type RedeemRewardInput = z.infer<typeof redeemRewardSchema>;

// Claim redemption schema
export const claimRedemptionSchema = z.object({
  code: z.string().regex(/^LV-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/, {
    message: 'Código de canje inválido. Formato: LV-XXXX-XXXX-XXXX',
  }),
});

export type ClaimRedemptionInput = z.infer<typeof claimRedemptionSchema>;

// Redemption record from database
export interface Redemption {
  id: string;
  user_id: string;
  reward_id: string;
  transaction_id: string | null;
  points_used: number;
  redemption_code: string;
  status: RedemptionStatus;
  claimed_at: string | null;
  expires_at: string;
  created_at: string;
}

// Redemption with reward details
export interface RedemptionWithReward extends Redemption {
  reward: {
    name: string;
    description: string;
    category: RewardCategory;
    image_url: string | null;
  };
}

// Availability check result
export interface AvailabilityCheck {
  available: boolean;
  reason?: string;
  stock_remaining: number | null;
}

// Redemption result
export interface RedemptionResult {
  success: boolean;
  redemption?: RedemptionWithReward;
  error?: string;
  code?: string;
}

// Reward filter options
export interface RewardFilterOptions {
  category?: RewardCategory;
  min_tier?: TierLevel;
  max_points?: number;
  user_tier?: TierLevel;
  user_points?: number;
  show_inactive?: boolean;
}

// Redemption summary for user
export interface UserRedemptionSummary {
  total_redemptions: number;
  pending_redemptions: number;
  claimed_redemptions: number;
  expired_redemptions: number;
  total_points_redeemed: number;
  last_redemption: RedemptionWithReward | null;
}

// Reward statistics
export interface RewardStatistics {
  reward_id: string;
  reward_name: string;
  category: RewardCategory;
  total_redemptions: number;
  claimed_count: number;
  pending_count: number;
  expired_count: number;
  total_points_redeemed: number;
  stock_remaining: number | null;
}
