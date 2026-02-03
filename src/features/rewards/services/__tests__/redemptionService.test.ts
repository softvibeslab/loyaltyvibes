import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { redemptionService } from '../redemptionService';
import { transactionService } from '@/features/transactions/services/transactionService';
import type { RedemptionWithReward, RedeemRewardInput, ClaimRedemptionInput } from '../../types';

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(),
  rpc: vi.fn(),
};

vi.mock('@/shared/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}));

// Mock transaction service
vi.mock('@/features/transactions/services/transactionService', () => ({
  transactionService: {
    createRedeemTransaction: vi.fn(),
  },
}));

describe('redemptionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateRedemptionCode', () => {
    it('should generate code in correct format', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: 'LV-ABCD-1234-EF56',
        error: null,
      });

      const code = await redemptionService.generateRedemptionCode();

      expect(code).toMatch(/^LV-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/);
    });

    it('should handle RPC errors', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: null,
        error: new Error('RPC error'),
      });

      await expect(redemptionService.generateRedemptionCode()).rejects.toThrow(
        'Error al generar código de canje'
      );
    });
  });

  describe('redeemReward', () => {
    const validInput: RedeemRewardInput = {
      user_id: 'user-123',
      reward_id: 'reward-123',
    };

    const mockProfile = {
      id: 'user-123',
      tier: 'conocedor',
      points_balance: 500,
    };

    const mockReward = {
      id: 'reward-123',
      name: 'Café Gratis',
      description: 'Un café gratis',
      points_cost: 100,
      is_active: true,
      is_limited: false,
      stock: null,
      min_tier: 'explorador',
    };

    const mockRedemption = {
      id: 'redemption-123',
      user_id: 'user-123',
      reward_id: 'reward-123',
      points_used: 100,
      redemption_code: 'LV-ABCD-1234-EF56',
      status: 'pending',
      expires_at: '2024-02-01T00:00:00Z',
    };

    it('should redeem reward successfully - happy path', async () => {
      // Mock profile fetch
      const mockProfileEq = vi.fn().mockReturnThis();
      const mockProfileSingle = vi.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      // Mock reward fetch
      const mockRewardEq = vi.fn().mockReturnThis();
      const mockRewardSingle = vi.fn().mockResolvedValue({
        data: mockReward,
        error: null,
      });

      // Mock redemption creation
      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockRedemptionSingle = vi.fn().mockResolvedValue({
        data: mockRedemption,
        error: null,
      });

      // Mock transaction creation
      const mockTransaction = {
        id: 'transaction-123',
        points: -100,
      };
      vi.mocked(transactionService.createRedeemTransaction).mockResolvedValue(
        mockTransaction as any
      );

      // Mock update transaction_id
      const mockUpdateEq = vi.fn().mockResolvedValue({ error: null });

      // Mock final redemption fetch
      const mockFinalEq = vi.fn().mockReturnThis();
      const mockFinalSingle = vi.fn().mockResolvedValue({
        data: {
          ...mockRedemption,
          rewards: mockReward,
        },
        error: null,
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: mockProfileEq,
            single: mockProfileSingle,
          } as any;
        } else if (table === 'rewards') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: mockRewardEq,
            single: mockRewardSingle,
          } as any;
        } else if (table === 'redemptions') {
          return {
            insert: mockInsert,
            select: mockSelect,
            single: mockRedemptionSingle,
            update: vi.fn().mockReturnThis(),
            eq: mockUpdateEq,
          } as any;
        }
        return {} as any;
      });

      // Chain the mocks for second call to redemptions
      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockRedemptionSingle,
        update: vi.fn().mockReturnThis(),
        eq: mockUpdateEq,
      } as any);

      // Set up the final fetch
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: mockFinalEq,
        single: mockFinalSingle,
      } as any);

      const result = await redemptionService.redeemReward(validInput);

      expect(result.success).toBe(true);
      expect(result.redemption).toBeTruthy();
      expect(result.code).toBe(mockRedemption.redemption_code);
    });

    it('should fail when user not found', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'User not found' },
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });

      const result = await redemptionService.redeemReward(validInput);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Usuario no encontrado');
    });

    it('should fail when reward not found', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn()
        .mockResolvedValueOnce({ data: mockProfile, error: null })
        .mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });

      const result = await redemptionService.redeemReward(validInput);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Recompensa no encontrada');
    });

    it('should fail when reward is inactive', async () => {
      const inactiveReward = { ...mockReward, is_active: false };
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn()
        .mockResolvedValueOnce({ data: mockProfile, error: null })
        .mockResolvedValueOnce({ data: inactiveReward, error: null });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });

      const result = await redemptionService.redeemReward(validInput);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Recompensa no disponible');
    });

    it('should fail when tier requirement not met', async () => {
      const exploradorProfile = { ...mockProfile, tier: 'explorador' };
      const embajadorReward = { ...mockReward, min_tier: 'embajador' };

      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn()
        .mockResolvedValueOnce({ data: exploradorProfile, error: null })
        .mockResolvedValueOnce({ data: embajadorReward, error: null });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });

      const result = await redemptionService.redeemReward(validInput);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Requiere tier');
    });

    it('should fail when user has insufficient points', async () => {
      const poorProfile = { ...mockProfile, points_balance: 50 };

      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn()
        .mockResolvedValueOnce({ data: poorProfile, error: null })
        .mockResolvedValueOnce({ data: mockReward, error: null });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });

      const result = await redemptionService.redeemReward(validInput);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Puntos insuficientes');
    });

    it('should fail when limited reward is out of stock', async () => {
      const outOfStockReward = { ...mockReward, is_limited: true, stock: 0 };

      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn()
        .mockResolvedValueOnce({ data: mockProfile, error: null })
        .mockResolvedValueOnce({ data: outOfStockReward, error: null });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });

      const result = await redemptionService.redeemReward(validInput);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Recompensa agotada');
    });

    it('should rollback redemption when transaction fails', async () => {
      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockRedemptionSingle = vi.fn()
        .mockResolvedValueOnce({ data: mockRedemption, error: null });

      vi.mocked(transactionService.createRedeemTransaction).mockResolvedValue(null);

      const mockDelete = vi.fn().mockResolvedValue({ error: null });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn()
          .mockResolvedValueOnce({ data: mockProfile, error: null })
          .mockResolvedValueOnce({ data: mockReward, error: null }),
        insert: mockInsert,
        delete: mockDelete,
      } as any);

      const result = await redemptionService.redeemReward(validInput);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al procesar transacción de puntos');
      expect(mockDelete).toHaveBeenCalled();
    });
  });

  describe('claimRedemption', () => {
    const validCode: ClaimRedemptionInput = {
      code: 'LV-ABCD-1234-EF56',
    };

    const mockRedemptionWithReward: RedemptionWithReward = {
      id: 'redemption-123',
      user_id: 'user-123',
      reward_id: 'reward-123',
      transaction_id: 'transaction-123',
      points_used: 100,
      redemption_code: 'LV-ABCD-1234-EF56',
      status: 'pending',
      claimed_at: null,
      expires_at: '2025-12-31T23:59:59Z',
      created_at: '2024-01-01T00:00:00Z',
      reward: {
        name: 'Café Gratis',
        description: 'Un café gratis',
        category: 'drink',
        image_url: 'https://example.com/cafe.jpg',
      },
    };

    it('should claim redemption successfully', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn()
        .mockResolvedValueOnce({ data: mockRedemptionWithReward, error: null })
        .mockResolvedValueOnce({
          data: { ...mockRedemptionWithReward, status: 'claimed' },
          error: null,
        });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
        update: vi.fn().mockReturnThis(),
      });

      const result = await redemptionService.claimRedemption(validCode);

      expect(result.success).toBe(true);
      expect(result.redemption?.status).toBe('claimed');
    });

    it('should fail with invalid code format', async () => {
      const invalidCode: ClaimRedemptionInput = {
        code: 'INVALID-CODE',
      };

      const result = await redemptionService.claimRedemption(invalidCode);

      expect(result.success).toBe(false);
      expect(result.error).toContain('inválido');
    });

    it('should fail when code not found', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });

      const result = await redemptionService.claimRedemption(validCode);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Código de canje inválido');
    });

    it('should fail when already claimed', async () => {
      const claimedRedemption = {
        ...mockRedemptionWithReward,
        status: 'claimed',
      };

      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: claimedRedemption,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });

      const result = await redemptionService.claimRedemption(validCode);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Este canje ya fue reclamado');
    });

    it('should fail when already expired', async () => {
      const expiredRedemption = {
        ...mockRedemptionWithReward,
        status: 'expired',
      };

      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: expiredRedemption,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });

      const result = await redemptionService.claimRedemption(validCode);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Este canje ha expirado');
    });

    it('should fail when cancelled', async () => {
      const cancelledRedemption = {
        ...mockRedemptionWithReward,
        status: 'cancelled',
      };

      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: cancelledRedemption,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });

      const result = await redemptionService.claimRedemption(validCode);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Este canje fue cancelado');
    });

    it('should auto-expire when expiration date passed', async () => {
      const expiredDateRedemption = {
        ...mockRedemptionWithReward,
        expires_at: '2023-01-01T00:00:00Z',
      };

      const mockUpdate = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockResolvedValue({ error: null });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: expiredDateRedemption,
          error: null,
        }),
        update: mockUpdate,
      });

      const result = await redemptionService.claimRedemption(validCode);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Este canje ha expirado');
    });
  });

  describe('cancelRedemption', () => {
    const mockRedemption = {
      id: 'redemption-123',
      user_id: 'user-123',
      status: 'pending',
      points_used: 100,
    };

    it('should cancel pending redemption successfully', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockRedemption,
        error: null,
      });

      const mockUpdate = vi.fn().mockReturnThis();
      const mockUpdateEq = vi.fn().mockResolvedValue({
        error: null,
      });

      mockSupabase.from.mockReturnValue((table: string) => {
        if (table === 'redemptions') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: mockEq,
            single: mockSingle,
            update: mockUpdate,
          } as any;
        }
        return {} as any;
      });

      // Chain the second call
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      } as any).mockReturnValueOnce({
        update: mockUpdate,
        eq: mockUpdateEq,
      } as any);

      vi.mocked(transactionService.createRedeemTransaction).mockResolvedValue({
        id: 'transaction-refund',
      } as any);

      const result = await redemptionService.cancelRedemption('redemption-123', 'user-123');

      expect(result).toBe(true);
    });

    it('should fail when redemption not found', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });

      const result = await redemptionService.cancelRedemption('nonexistent', 'user-123');

      expect(result).toBe(false);
    });

    it('should fail when user not authorized', async () => {
      const otherUserRedemption = { ...mockRedemption, user_id: 'other-user' };

      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: otherUserRedemption,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });

      const result = await redemptionService.cancelRedemption('redemption-123', 'user-123');

      expect(result).toBe(false);
    });

    it('should fail when redemption not in pending status', async () => {
      const claimedRedemption = { ...mockRedemption, status: 'claimed' };

      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: claimedRedemption,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });

      const result = await redemptionService.cancelRedemption('redemption-123', 'user-123');

      expect(result).toBe(false);
    });
  });

  describe('getUserRedemptions', () => {
    const mockRedemptions: RedemptionWithReward[] = [
      {
        id: 'redemption-1',
        user_id: 'user-123',
        reward_id: 'reward-1',
        transaction_id: 'transaction-1',
        points_used: 100,
        redemption_code: 'LV-AAAA-1111-2222',
        status: 'pending',
        claimed_at: null,
        expires_at: '2025-12-31T23:59:59Z',
        created_at: '2024-01-01T00:00:00Z',
        reward: {
          name: 'Café Gratis',
          description: 'Un café gratis',
          category: 'drink',
          image_url: null,
        },
      },
    ];

    it('should return user redemptions', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockRedemptions,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        order: mockOrder,
      });

      const redemptions = await redemptionService.getUserRedemptions('user-123');

      expect(redemptions).toEqual(mockRedemptions);
    });

    it('should filter by status when provided', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({
        data: [mockRedemptions[0]],
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        order: mockOrder,
      });

      const redemptions = await redemptionService.getUserRedemptions('user-123', 'pending');

      expect(mockEq).toHaveBeenCalledWith('status', 'pending');
      expect(redemptions.length).toBe(1);
    });

    it('should return empty array on error', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Database error'),
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        order: mockOrder,
      });

      const redemptions = await redemptionService.getUserRedemptions('user-123');

      expect(redemptions).toEqual([]);
    });
  });

  describe('getRedemptionById', () => {
    it('should return redemption with reward details', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'redemption-1',
          rewards: { name: 'Test Reward' },
        },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });

      const redemption = await redemptionService.getRedemptionById('redemption-1');

      expect(redemption).toBeTruthy();
    });

    it('should return null on error', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Not found'),
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });

      const redemption = await redemptionService.getRedemptionById('nonexistent');

      expect(redemption).toBeNull();
    });
  });

  describe('getUserRedemptionSummary', () => {
    const mockRedemptions: RedemptionWithReward[] = [
      {
        id: 'redemption-1',
        user_id: 'user-123',
        reward_id: 'reward-1',
        transaction_id: 'transaction-1',
        points_used: 100,
        redemption_code: 'LV-AAAA-1111-2222',
        status: 'claimed',
        claimed_at: '2024-01-02T00:00:00Z',
        expires_at: '2025-12-31T23:59:59Z',
        created_at: '2024-01-01T00:00:00Z',
        reward: {
          name: 'Café Gratis',
          description: 'Un café gratis',
          category: 'drink',
          image_url: null,
        },
      },
      {
        id: 'redemption-2',
        user_id: 'user-123',
        reward_id: 'reward-2',
        transaction_id: 'transaction-2',
        points_used: 200,
        redemption_code: 'LV-BBBB-3333-4444',
        status: 'pending',
        claimed_at: null,
        expires_at: '2025-12-31T23:59:59Z',
        created_at: '2024-01-03T00:00:00Z',
        reward: {
          name: 'Descuento',
          description: '20% de descuento',
          category: 'discount',
          image_url: null,
        },
      },
    ];

    it('should return summary with counts', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockRedemptions,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        order: mockOrder,
      });

      const summary = await redemptionService.getUserRedemptionSummary('user-123');

      expect(summary.total_redemptions).toBe(2);
      expect(summary.claimed_redemptions).toBe(1);
      expect(summary.pending_redemptions).toBe(1);
      expect(summary.total_points_redeemed).toBe(300);
      expect(summary.last_redemption).toBeTruthy();
    });

    it('should return empty summary on error', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Database error'),
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        order: mockOrder,
      });

      const summary = await redemptionService.getUserRedemptionSummary('user-123');

      expect(summary.total_redemptions).toBe(0);
      expect(summary.last_redemption).toBeNull();
    });
  });

  describe('expirePendingRedemptions', () => {
    it('should expire pending redemptions', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: 5,
        error: null,
      });

      const count = await redemptionService.expirePendingRedemptions();

      expect(count).toBe(5);
    });

    it('should return 0 on error', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: null,
        error: new Error('RPC error'),
      });

      const count = await redemptionService.expirePendingRedemptions();

      expect(count).toBe(0);
    });
  });
});
