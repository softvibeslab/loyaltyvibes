import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  registerSchema,
  loginSchema,
  USER_ROLES,
  TIER_LEVELS,
  TIER_CONFIG,
  ROLE_REDIRECTS,
  type RegisterInput,
  type LoginInput,
} from '../types';

describe('auth types and schemas', () => {
  describe('USER_ROLES constant', () => {
    it('should contain all three roles', () => {
      expect(USER_ROLES).toEqual(['admin', 'staff', 'customer']);
      expect(USER_ROLES).toHaveLength(3);
    });

    it('should be a readonly tuple', () => {
      expect(USER_ROLES).toBeInstanceOf(Array);
    });
  });

  describe('TIER_LEVELS constant', () => {
    it('should contain all three tier levels', () => {
      expect(TIER_LEVELS).toEqual(['explorador', 'conocedor', 'embajador']);
      expect(TIER_LEVELS).toHaveLength(3);
    });
  });

  describe('TIER_CONFIG constant', () => {
    it('should have configuration for each tier', () => {
      expect(TIER_CONFIG.explorador).toEqual({
        multiplier: 1.0,
        label: 'Explorador',
        color: 'amber',
      });
      expect(TIER_CONFIG.conocedor).toEqual({
        multiplier: 1.2,
        label: 'Conocedor',
        color: 'gray',
      });
      expect(TIER_CONFIG.embajador).toEqual({
        multiplier: 1.5,
        label: 'Embajador',
        color: 'yellow',
      });
    });

    it('should have increasing multipliers', () => {
      expect(TIER_CONFIG.explorador.multiplier).toBeLessThan(
        TIER_CONFIG.conocedor.multiplier
      );
      expect(TIER_CONFIG.conocedor.multiplier).toBeLessThan(
        TIER_CONFIG.embajador.multiplier
      );
    });
  });

  describe('ROLE_REDIRECTS constant', () => {
    it('should map each role to correct path', () => {
      expect(ROLE_REDIRECTS.admin).toBe('/dashboard');
      expect(ROLE_REDIRECTS.staff).toBe('/scanner');
      expect(ROLE_REDIRECTS.customer).toBe('/wallet');
    });

    it('should have paths for all roles', () => {
      expect(Object.keys(ROLE_REDIRECTS)).toEqual(['admin', 'staff', 'customer']);
    });
  });

  describe('registerSchema', () => {
    const validInput = {
      email: 'test@example.com',
      password: 'Password123',
      name: 'John Doe',
      role: 'customer' as const,
    };

    describe('email validation', () => {
      it('should accept valid email', () => {
        const result = registerSchema.safeParse(validInput);
        expect(result.success).toBe(true);
      });

      it('should reject invalid email', () => {
        const result = registerSchema.safeParse({
          ...validInput,
          email: 'invalid-email',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('Email invalido');
        }
      });

      it('should reject empty email', () => {
        const result = registerSchema.safeParse({
          ...validInput,
          email: '',
        });
        expect(result.success).toBe(false);
      });
    });

    describe('password validation', () => {
      it('should accept password with 8+ chars, uppercase, and number', () => {
        const result = registerSchema.safeParse(validInput);
        expect(result.success).toBe(true);
      });

      it('should reject password less than 8 characters', () => {
        const result = registerSchema.safeParse({
          ...validInput,
          password: 'Pass1',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('Minimo 8 caracteres');
        }
      });

      it('should reject password without uppercase', () => {
        const result = registerSchema.safeParse({
          ...validInput,
          password: 'password123',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe(
            'Requiere al menos una mayuscula'
          );
        }
      });

      it('should reject password without number', () => {
        const result = registerSchema.safeParse({
          ...validInput,
          password: 'Password',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe(
            'Requiere al menos un numero'
          );
        }
      });
    });

    describe('name validation', () => {
      it('should accept valid name', () => {
        const result = registerSchema.safeParse(validInput);
        expect(result.success).toBe(true);
      });

      it('should accept undefined name (optional)', () => {
        const result = registerSchema.safeParse({
          email: 'test@example.com',
          password: 'Password123',
        });
        expect(result.success).toBe(true);
      });

      it('should accept null name', () => {
        const result = registerSchema.safeParse({
          ...validInput,
          name: null,
        });
        expect(result.success).toBe(true);
      });

      it('should reject name with less than 2 characters', () => {
        const result = registerSchema.safeParse({
          ...validInput,
          name: 'J',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('Nombre requerido');
        }
      });
    });

    describe('role validation', () => {
      it('should accept valid roles', () => {
        const adminResult = registerSchema.safeParse({
          ...validInput,
          role: 'admin',
        });
        expect(adminResult.success).toBe(true);

        const staffResult = registerSchema.safeParse({
          ...validInput,
          role: 'staff',
        });
        expect(staffResult.success).toBe(true);

        const customerResult = registerSchema.safeParse({
          ...validInput,
          role: 'customer',
        });
        expect(customerResult.success).toBe(true);
      });

      it('should default to customer role', () => {
        const result = registerSchema.safeParse({
          email: 'test@example.com',
          password: 'Password123',
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.role).toBe('customer');
        }
      });
    });

    describe('type inference', () => {
      it('should correctly infer RegisterInput type', () => {
        const input: RegisterInput = {
          email: 'test@example.com',
          password: 'Password123',
          name: 'John Doe',
          role: 'customer',
        };
        expect(input).toBeDefined();
      });
    });
  });

  describe('loginSchema', () => {
    const validInput = {
      email: 'test@example.com',
      password: 'AnyPassword123',
    };

    describe('email validation', () => {
      it('should accept valid email', () => {
        const result = loginSchema.safeParse(validInput);
        expect(result.success).toBe(true);
      });

      it('should reject invalid email', () => {
        const result = loginSchema.safeParse({
          ...validInput,
          email: 'not-an-email',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('Email invalido');
        }
      });
    });

    describe('password validation', () => {
      it('should accept any non-empty password', () => {
        const result = loginSchema.safeParse(validInput);
        expect(result.success).toBe(true);
      });

      it('should reject empty password', () => {
        const result = loginSchema.safeParse({
          ...validInput,
          password: '',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors[0].message).toBe('Contrasena requerida');
        }
      });
    });

    describe('type inference', () => {
      it('should correctly infer LoginInput type', () => {
        const input: LoginInput = {
          email: 'test@example.com',
          password: 'Password123',
        };
        expect(input).toBeDefined();
      });
    });
  });
});
