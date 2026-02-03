import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rewardsService } from '../rewardsService';
import type { Reward, CreateRewardInput, UpdateRewardInput } from '../../types';

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(),
};

vi.mock('@/shared/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}));

describe('rewardsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getActiveRewards', () => {
    const mockRewards: Reward[] = [
      {
        id: 'reward-1',
        name: 'Café Gratis',
        description: 'Un café gratis de cualquier tamaño',
        points_cost: 100,
        stock: null,
        image_url: 'https://example.com/cafe.jpg',
        min_tier: 'explorador',
        category: 'drink',
        is_active: true,
        is_limited: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'reward-2',
        name: 'Descuento 20%',
        description: '20% de descuento en tu próxima compra',
        points_cost: 200,
        stock: 50,
        image_url: null,
        min_tier: 'conocedor',
        category: 'discount',
        is_active: true,
        is_limited: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'reward-3',
        name: 'Experiencia exclusiva',
        description: 'Tour exclusivo de la cafetería',
        points_cost: 500,
        stock: 5,
        image_url: 'https://example.com/tour.jpg',
        min_tier: 'embajador',
        category: 'experience',
        is_active: true,
        is_limited: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    it('should return active rewards for explorador tier', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockRewards.filter(r => r.min_tier === 'explorador'),
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        order: mockOrder,
        in: vi.fn().mockReturnThis(),
      });

      const rewards = await rewardsService.getActiveRewards('explorador');

      expect(rewards.length).toBeGreaterThan(0);
      expect(rewards[0]).toMatchObject({
        available: true,
        meets_tier_requirement: true,
      });
    });

    it('should return rewards for conocedor tier (incluye explorador)', async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockRewards.filter(r => ['explorador', 'conocedor'].includes(r.min_tier)),
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: mockOrder,
        in: vi.fn().mockReturnThis(),
      });

      const rewards = await rewardsService.getActiveRewards('conocidor');

      expect(rewards.length).toBeGreaterThan(0);
      rewards.forEach(reward => {
        expect(reward.meets_tier_requirement).toBe(true);
      });
    });

    it('should return all rewards for embajador tier', async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockRewards,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: mockOrder,
        in: vi.fn().mockReturnThis(),
      });

      const rewards = await rewardsService.getActiveRewards('embajador');

      expect(rewards.length).toBe(3);
      rewards.forEach(reward => {
        expect(reward.meets_tier_requirement).toBe(true);
      });
    });

    it('should filter by category when provided', async () => {
      const mockIn = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockRewards.filter(r => r.category === 'drink'),
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        order: mockOrder,
        in: mockIn,
      });

      const rewards = await rewardsService.getActiveRewards('explorador', {
        category: 'drink',
      });

      expect(mockEq).toHaveBeenCalledWith('category', 'drink');
      expect(rewards.every(r => r.category === 'drink')).toBe(true);
    });

    it('should filter by max points when provided', async () => {
      const mockIn = vi.fn().mockReturnThis();
      const mockLte = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockRewards.filter(r => r.points_cost <= 200),
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: mockOrder,
        in: mockIn,
        lte: mockLte,
      });

      const rewards = await rewardsService.getActiveRewards('explorador', {
        max_points: 200,
      });

      expect(mockLte).toHaveBeenCalledWith('points_cost', 200);
      expect(rewards.every(r => r.points_cost <= 200)).toBe(true);
    });

    it('should include affordability status when user_points provided', async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: [mockRewards[0]],
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: mockOrder,
        in: vi.fn().mockReturnThis(),
      });

      const rewards = await rewardsService.getActiveRewards('explorador', {
        user_points: 150,
      });

      expect(rewards[0].can_afford).toBe(true);
    });

    it('should set available=false for limited rewards with no stock', async () => {
      const noStockReward = {
        ...mockRewards[1],
        stock: 0,
      };

      const mockOrder = vi.fn().mockResolvedValue({
        data: [noStockReward],
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: mockOrder,
        in: vi.fn().mockReturnThis(),
      });

      const rewards = await rewardsService.getActiveRewards('conocedor');

      expect(rewards[0].available).toBe(false);
      expect(rewards[0].stock_remaining).toBe(0);
    });

    it('should handle database errors gracefully', async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Database error'),
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: mockOrder,
        in: vi.fn().mockReturnThis(),
      });

      await expect(rewardsService.getActiveRewards('explorador')).rejects.toThrow(
        'Error al cargar recompensas disponibles'
      );
    });

    it('should return empty array when no rewards found', async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: mockOrder,
        in: vi.fn().mockReturnThis(),
      });

      const rewards = await rewardsService.getActiveRewards('explorador');

      expect(rewards).toEqual([]);
    });
  });

  describe('getRewardById', () => {
    const mockReward: Reward = {
      id: 'reward-123',
      name: 'Café Gratis',
      description: 'Un café gratis',
      points_cost: 100,
      stock: null,
      image_url: 'https://example.com/cafe.jpg',
      min_tier: 'explorador',
      category: 'drink',
      is_active: true,
      is_limited: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    it('should return reward by ID', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockReward,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });

      const reward = await rewardsService.getRewardById('reward-123');

      expect(reward).toEqual(mockReward);
      expect(mockEq).toHaveBeenCalledWith('id', 'reward-123');
    });

    it('should return null when reward not found', async () => {
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

      const reward = await rewardsService.getRewardById('nonexistent');

      expect(reward).toBeNull();
    });
  });

  describe('checkAvailability', () => {
    it('should return available=true for unlimited reward', async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: true,
        error: null,
      });

      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'reward-1',
          is_limited: false,
          stock: null,
        },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });
      mockSupabase.rpc = mockRpc;

      const availability = await rewardsService.checkAvailability('reward-1');

      expect(availability.available).toBe(true);
      expect(availability.stock_remaining).toBeNull();
    });

    it('should return available=true for limited reward with stock', async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: true,
        error: null,
      });

      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'reward-2',
          is_limited: true,
          stock: 10,
        },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });
      mockSupabase.rpc = mockRpc;

      const availability = await rewardsService.checkAvailability('reward-2');

      expect(availability.available).toBe(true);
      expect(availability.stock_remaining).toBe(10);
    });

    it('should return available=false for limited reward with no stock', async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: true,
        error: null,
      });

      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'reward-3',
          is_limited: true,
          stock: 0,
        },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        single: mockSingle,
      });
      mockSupabase.rpc = mockRpc;

      const availability = await rewardsService.checkAvailability('reward-3');

      expect(availability.available).toBe(false);
      expect(availability.reason).toBe('Recompensa agotada');
      expect(availability.stock_remaining).toBe(0);
    });

    it('should return available=false when reward not found', async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: false,
        error: null,
      });

      mockSupabase.rpc = mockRpc;

      const availability = await rewardsService.checkAvailability('nonexistent');

      expect(availability.available).toBe(false);
      expect(availability.reason).toBe('Recompensa no encontrada o inactiva');
    });

    it('should handle RPC errors gracefully', async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('RPC error'),
      });

      mockSupabase.rpc = mockRpc;

      const availability = await rewardsService.checkAvailability('reward-1');

      expect(availability.available).toBe(false);
      expect(availability.reason).toContain('Error al verificar disponibilidad');
    });
  });

  describe('decrementStock', () => {
    it('should decrement stock for limited reward', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          is_limited: true,
          stock: 10,
        },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
        update: vi.fn().mockReturnThis(),
      });

      const result = await rewardsService.decrementStock('reward-1');

      expect(result).toBe(true);
    });

    it('should return true for unlimited rewards (no stock change)', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          is_limited: false,
          stock: null,
        },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await rewardsService.decrementStock('reward-1');

      expect(result).toBe(true);
    });

    it('should return false when stock is empty', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          is_limited: true,
          stock: 0,
        },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await rewardsService.decrementStock('reward-1');

      expect(result).toBe(false);
    });

    it('should handle database errors', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Not found'),
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await rewardsService.decrementStock('reward-1');

      expect(result).toBe(false);
    });
  });

  describe('createReward', () => {
    const validInput: CreateRewardInput = {
      name: 'Nuevo Premio',
      description: 'Descripción del premio',
      points_cost: 150,
      stock: 20,
      image_url: 'https://example.com/image.jpg',
      min_tier: 'conocedor',
      category: 'food',
      is_active: true,
      is_limited: true,
    };

    it('should create new reward successfully', async () => {
      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'reward-new',
          ...validInput,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      const reward = await rewardsService.createReward(validInput);

      expect(reward).toBeTruthy();
      expect(mockInsert).toHaveBeenCalled();
    });

    it('should handle creation errors', async () => {
      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Creation failed'),
      });

      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      await expect(rewardsService.createReward(validInput)).rejects.toThrow(
        'Error al crear recompensa'
      );
    });
  });

  describe('updateReward', () => {
    const updateInput: UpdateRewardInput = {
      name: 'Nombre Actualizado',
      points_cost: 200,
    };

    it('should update existing reward', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'reward-1',
          name: 'Nombre Actualizado',
          points_cost: 200,
        },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const reward = await rewardsService.updateReward('reward-1', updateInput);

      expect(reward).toBeTruthy();
      expect(reward?.name).toBe('Nombre Actualizado');
    });

    it('should handle update errors', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Update failed'),
      });

      mockSupabase.from.mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      await expect(
        rewardsService.updateReward('reward-1', updateInput)
      ).rejects.toThrow('Error al actualizar recompensa');
    });
  });

  describe('deactivateReward', () => {
    it('should deactivate reward successfully', async () => {
      const mockEq = vi.fn().mockResolvedValue({
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: mockEq,
      });

      const result = await rewardsService.deactivateReward('reward-1');

      expect(result).toBe(true);
    });

    it('should handle deactivation errors', async () => {
      const mockEq = vi.fn().mockResolvedValue({
        error: new Error('Deactivation failed'),
      });

      mockSupabase.from.mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: mockEq,
      });

      const result = await rewardsService.deactivateReward('reward-1');

      expect(result).toBe(false);
    });
  });

  describe('getAllRewards', () => {
    it('should return only active rewards by default', async () => {
      const mockEq = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({
        data: [
          { id: 'reward-1', is_active: true },
          { id: 'reward-2', is_active: true },
        ],
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        order: mockOrder,
      });

      const rewards = await rewardsService.getAllRewards();

      expect(mockEq).toHaveBeenCalledWith('is_active', true);
      expect(rewards.length).toBe(2);
    });

    it('should return all rewards when includeInactive=true', async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: [
          { id: 'reward-1', is_active: true },
          { id: 'reward-2', is_active: false },
        ],
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: mockOrder,
      });

      const rewards = await rewardsService.getAllRewards(true);

      expect(rewards.length).toBe(2);
    });
  });

  describe('getRewardStatistics', () => {
    it('should return reward statistics', async () => {
      const mockSelect = vi.fn().mockResolvedValue({
        data: [
          {
            reward_id: 'reward-1',
            reward_name: 'Café Gratis',
            total_redemptions: 100,
            claimed_count: 80,
            pending_count: 15,
            expired_count: 5,
          },
        ],
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      const stats = await rewardsService.getRewardStatistics();

      expect(stats.length).toBeGreaterThan(0);
    });

    it('should return empty array on error', async () => {
      const mockSelect = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Stats error'),
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      const stats = await rewardsService.getRewardStatistics();

      expect(stats).toEqual([]);
    });
  });
});
