import { z } from 'zod';

// User roles
export const USER_ROLES = ['admin', 'staff', 'customer'] as const;
export type UserRole = (typeof USER_ROLES)[number];

// Tier levels
export const TIER_LEVELS = ['explorador', 'conocedor', 'embajador'] as const;
export type TierLevel = (typeof TIER_LEVELS)[number];

// Tier configuration
export const TIER_CONFIG = {
  explorador: { multiplier: 1.0, label: 'Explorador', color: 'amber' },
  conocedor: { multiplier: 1.2, label: 'Conocedor', color: 'gray' },
  embajador: { multiplier: 1.5, label: 'Embajador', color: 'yellow' },
} as const;

// Registration schema
export const registerSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z
    .string()
    .min(8, 'Minimo 8 caracteres')
    .regex(/[A-Z]/, 'Requiere al menos una mayuscula')
    .regex(/[0-9]/, 'Requiere al menos un numero'),
  name: z.string().min(2, 'Nombre requerido').optional(),
  role: z.enum(USER_ROLES).default('customer'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(1, 'Contrasena requerida'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Profile type matching database
export interface Profile {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  tier: TierLevel;
  points_balance: number;
  total_spent: number;
  visit_count: number;
  created_at: string;
  updated_at: string;
}

// Auth state for useAuth hook
export interface AuthState {
  user: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Role-based redirect paths
export const ROLE_REDIRECTS: Record<UserRole, string> = {
  admin: '/dashboard',
  staff: '/scanner',
  customer: '/wallet',
};
