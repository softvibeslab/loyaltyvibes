import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Transaction, TransactionSummary } from '../types'
import type { TierLevel } from '@/features/auth/types'

// Mock Supabase client
const mockEq = vi.fn()
const mockSingle = vi.fn()
const mockSelect = vi.fn()
const mockInsert = vi.fn()
const mockUpdate = vi.fn()
const mockOrder = vi.fn()
const mockRange = vi.fn()
const mockGte = vi.fn()
const mockLimit = vi.fn()

const mockFrom = vi.fn((table: string) => {
  return {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
  }
})

vi.mock('@/shared/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}))

// Mock pointsService
vi.mock('./pointsService', () => ({
  pointsService: {
    calculatePoints: vi.fn(),
    calculatePointsValue: vi.fn(),
  },
}))

// Import service after mocking
const { transactionService } = await import('./transactionService')
const { pointsService } = await import('./pointsService')

describe('TransactionService - TAG-005: Transaction Service', () => {
  const mockUserId = 'user-123'
  const mockStaffId = 'staff-456'
  const mockTier: TierLevel = 'conocedor'

  beforeEach(() => {
    vi.clearAllMocks()

    // Create a proper chain object for Supabase query builder pattern
    const createChain = () => {
      let chainResult: any = { data: null, error: null }

      const chain: any = {
        eq: vi.fn((...args: any[]) => {
          ;(chain.eq as any).mock.calls.push(args)
          return chain
        }),
        single: () => mockSingle(),
        order: vi.fn((...args: any[]) => {
          ;(chain.order as any).mock.calls.push(args)
          return chain
        }),
        gte: vi.fn((...args: any[]) => {
          ;(chain.gte as any).mock.calls.push(args)
          return chain
        }),
        limit: vi.fn((...args: any[]) => {
          ;(chain.limit as any).mock.calls.push(args)
          return chain
        }),
        // range method - calls mockRange with arguments
        range: vi.fn((...args: any[]) => {
          return mockRange(...args)
        }),
        __setResult: (result: any) => {
          chainResult = result
        },
        then: (onFulfilled?: (value: any) => any, onRejected?: (reason: any) => any) => {
          return Promise.resolve(chainResult).then(onFulfilled, onRejected)
        },
      }

      chain.eq.mock.calls = []
      chain.order.mock.calls = []
      chain.gte.mock.calls = []
      chain.limit.mock.calls = []
      chain.range.mock.calls = []

      return chain
    }

    const queryChain = createChain()

    mockSelect.mockReturnValue(queryChain)

    mockInsert.mockReturnValue({
      select: () => ({
        single: mockSingle,
      }),
    })

    mockUpdate.mockReturnValue({
      eq: queryChain.eq,
    })

    ;(mockSelect as any).__chain = queryChain
  })

  describe('createEarnTransaction', () => {
    it('should create earn transaction successfully', async () => {
      const mockProfile = {
        points_balance: 500,
      }

      const mockTransaction: Transaction = {
        id: 'tx-123',
        user_id: mockUserId,
        type: 'earn',
        amount: 1000,
        points: 120,
        points_before: 500,
        points_after: 620,
        multiplier_applied: 1.2,
        tier_at_transaction: mockTier,
        description: 'Compra en establecimiento',
        reference_id: null,
        status: 'completed',
        created_at: '2024-01-01T00:00:00Z',
        processed_at: '2024-01-01T00:00:00Z',
        staff_id: mockStaffId,
      }

      // Mock points calculation
      vi.mocked(pointsService.calculatePoints).mockReturnValue({
        basePoints: 100,
        tierMultiplier: 1.2,
        bonusMultiplier: 1,
        totalPoints: 120,
        breakdown: { base: 100, tierBonus: 20, bonus: 0 },
      })

      // Mock profile fetch
      mockSingle.mockResolvedValueOnce({
        data: mockProfile,
        error: null,
      })

      // Mock transaction insert
      mockSingle.mockResolvedValueOnce({
        data: mockTransaction,
        error: null,
      })

      const result = await transactionService.createEarnTransaction(
        mockUserId,
        1000,
        mockTier,
        'Compra en establecimiento',
        mockStaffId
      )

      expect(result).toEqual(mockTransaction)
      expect(pointsService.calculatePoints).toHaveBeenCalledWith({
        amount: 1000,
        tier: mockTier,
      })
    })

    it('should throw error when user not found', async () => {
      vi.mocked(pointsService.calculatePoints).mockReturnValue({
        basePoints: 100,
        tierMultiplier: 1.2,
        bonusMultiplier: 1,
        totalPoints: 120,
        breakdown: { base: 100, tierBonus: 20, bonus: 0 },
      })

      mockSingle.mockResolvedValue({
        data: null,
        error: { message: 'Profile not found' },
      })

      await expect(
        transactionService.createEarnTransaction(mockUserId, 1000, mockTier)
      ).rejects.toThrow('Usuario no encontrado')
    })

    it('should throw error when transaction insert fails', async () => {
      const mockProfile = { points_balance: 500 }

      vi.mocked(pointsService.calculatePoints).mockReturnValue({
        basePoints: 100,
        tierMultiplier: 1.2,
        bonusMultiplier: 1,
        totalPoints: 120,
        breakdown: { base: 100, tierBonus: 20, bonus: 0 },
      })

      mockSingle.mockResolvedValueOnce({
        data: mockProfile,
        error: null,
      })

      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { message: 'Insert failed' },
      })

      await expect(
        transactionService.createEarnTransaction(mockUserId, 1000, mockTier)
      ).rejects.toThrow('Error al crear la transacción')
    })
  })

  describe('createRedeemTransaction', () => {
    it('should create redeem transaction successfully', async () => {
      const mockProfile = {
        points_balance: 500,
        tier: 'conocedor' as TierLevel,
      }

      const mockTransaction: Transaction = {
        id: 'tx-456',
        user_id: mockUserId,
        type: 'redeem',
        amount: 50,
        points: -200,
        points_before: 500,
        points_after: 300,
        multiplier_applied: 1,
        tier_at_transaction: 'conocedor',
        description: 'Reward redemption',
        reference_id: 'reward-123',
        status: 'completed',
        created_at: '2024-01-01T00:00:00Z',
        processed_at: '2024-01-01T00:00:00Z',
        staff_id: null,
      }

      // Mock points value calculation
      vi.mocked(pointsService.calculatePointsValue).mockReturnValue(50)

      mockSingle.mockResolvedValueOnce({
        data: mockProfile,
        error: null,
      })

      mockSingle.mockResolvedValueOnce({
        data: mockTransaction,
        error: null,
      })

      const result = await transactionService.createRedeemTransaction(
        mockUserId,
        200,
        'Reward redemption',
        'reward-123'
      )

      expect(result).toEqual(mockTransaction)
      expect(pointsService.calculatePointsValue).toHaveBeenCalledWith(200)
    })

    it('should throw error when user not found', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: 'Profile not found' },
      })

      await expect(
        transactionService.createRedeemTransaction(mockUserId, 200, 'Reward')
      ).rejects.toThrow('Usuario no encontrado')
    })

    it('should throw error when insufficient points', async () => {
      const mockProfile = {
        points_balance: 100,
        tier: 'explorador' as TierLevel,
      }

      mockSingle.mockResolvedValue({
        data: mockProfile,
        error: null,
      })

      await expect(
        transactionService.createRedeemTransaction(mockUserId, 200, 'Reward')
      ).rejects.toThrow('Puntos insuficientes')
    })

    it('should throw error when transaction insert fails', async () => {
      const mockProfile = {
        points_balance: 500,
        tier: 'conocedor' as TierLevel,
      }

      vi.mocked(pointsService.calculatePointsValue).mockReturnValue(50)

      mockSingle.mockResolvedValueOnce({
        data: mockProfile,
        error: null,
      })

      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { message: 'Insert failed' },
      })

      await expect(
        transactionService.createRedeemTransaction(mockUserId, 200, 'Reward')
      ).rejects.toThrow('Error al crear la transacción')
    })
  })

  describe('getTransactionHistory', () => {
    it('should fetch transaction history with default limit', async () => {
      const mockTransactions: Transaction[] = [
        {
          id: 'tx-1',
          user_id: mockUserId,
          type: 'earn',
          amount: 1000,
          points: 100,
          points_before: 0,
          points_after: 100,
          multiplier_applied: 1,
          tier_at_transaction: 'explorador',
          description: 'Purchase',
          reference_id: null,
          status: 'completed',
          created_at: '2024-01-01T00:00:00Z',
          processed_at: '2024-01-01T00:00:00Z',
          staff_id: null,
        },
      ]

      mockRange.mockResolvedValue({
        data: mockTransactions,
        error: null,
      })

      const result = await transactionService.getTransactionHistory(mockUserId)

      expect(result).toEqual(mockTransactions)
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockRange).toHaveBeenCalledWith(0, 49)
    })

    it('should fetch transaction history with custom limit and offset', async () => {
      mockRange.mockResolvedValue({
        data: [],
        error: null,
      })

      await transactionService.getTransactionHistory(mockUserId, 20, 10)

      expect(mockRange).toHaveBeenCalledWith(10, 29)
    })

    it('should return empty array on error', async () => {
      mockRange.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      const result = await transactionService.getTransactionHistory(mockUserId)

      expect(result).toEqual([])
    })
  })

  describe('getTransactionSummary', () => {
    it('should calculate transaction summary', async () => {
      const allTimeTransactions = [
        { type: 'earn', points: 100 },
        { type: 'earn', points: 50 },
        { type: 'redeem', points: -30 },
      ]

      const thisMonthTransactions = [
        { type: 'earn', points: 100 },
        { type: 'redeem', points: -30 },
      ]

      const lastTransaction: Transaction = {
        id: 'tx-last',
        user_id: mockUserId,
        type: 'earn',
        amount: 1000,
        points: 100,
        points_before: 0,
        points_after: 100,
        multiplier_applied: 1,
        tier_at_transaction: 'explorador',
        description: 'Latest purchase',
        reference_id: null,
        status: 'completed',
        created_at: '2024-01-15T00:00:00Z',
        processed_at: '2024-01-15T00:00:00Z',
        staff_id: null,
      }

      // Get the chain object and set results for sequential calls
      const chain = (mockSelect as any).__chain

      let callCount = 0
      chain.then = vi.fn((onFulfilled?: any) => {
        callCount++
        if (callCount === 1) {
          return Promise.resolve({ data: allTimeTransactions, error: null }).then(onFulfilled)
        }
        if (callCount === 2) {
          return Promise.resolve({ data: thisMonthTransactions, error: null }).then(onFulfilled)
        }
        // Third call is for the order().limit().single() chain - use mockSingle
        return Promise.resolve({ data: lastTransaction, error: null }).then(onFulfilled)
      })

      mockSingle.mockResolvedValue({
        data: lastTransaction,
        error: null,
      })

      const summary = await transactionService.getTransactionSummary(mockUserId)

      expect(summary).toMatchObject({
        totalEarned: 150,
        totalRedeemed: 30,
        totalTransactions: 3,
        lastTransaction,
        thisMonthEarned: 100,
        thisMonthRedeemed: 30,
      })
    })

    it('should handle empty transaction history', async () => {
      const chain = (mockSelect as any).__chain

      let callCount = 0
      chain.then = vi.fn((onFulfilled?: any) => {
        callCount++
        return Promise.resolve({ data: null, error: null }).then(onFulfilled)
      })

      mockSingle.mockResolvedValue({
        data: null,
        error: null,
      })

      const summary = await transactionService.getTransactionSummary(mockUserId)

      expect(summary).toMatchObject({
        totalEarned: 0,
        totalRedeemed: 0,
        totalTransactions: 0,
        lastTransaction: null,
        thisMonthEarned: 0,
        thisMonthRedeemed: 0,
      })
    })
  })

  describe('getTransaction', () => {
    it('should fetch transaction by ID', async () => {
      const mockTransaction: Transaction = {
        id: 'tx-123',
        user_id: mockUserId,
        type: 'earn',
        amount: 1000,
        points: 100,
        points_before: 0,
        points_after: 100,
        multiplier_applied: 1,
        tier_at_transaction: 'explorador',
        description: 'Purchase',
        reference_id: null,
        status: 'completed',
        created_at: '2024-01-01T00:00:00Z',
        processed_at: '2024-01-01T00:00:00Z',
        staff_id: null,
      }

      mockSingle.mockResolvedValue({
        data: mockTransaction,
        error: null,
      })

      const result = await transactionService.getTransaction('tx-123')

      expect(result).toEqual(mockTransaction)
    })

    it('should return null when transaction not found', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: 'Transaction not found' },
      })

      const result = await transactionService.getTransaction('nonexistent')

      expect(result).toBeNull()
    })

    it('should return null on database error', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      const result = await transactionService.getTransaction('tx-123')

      expect(result).toBeNull()
    })
  })
})
