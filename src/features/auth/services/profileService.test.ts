import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Profile, UserRole } from '../types'
import type { UpdateProfileData, ProfileStats } from './profileService'

// Mock Supabase client
const mockSelect = vi.fn()
const mockEq = vi.fn()
const mockUpdate = vi.fn()
const mockOrder = vi.fn()
const mockOr = vi.fn()
const mockLimit = vi.fn()
const mockSingle = vi.fn()
const mockGetUser = vi.fn()
const mockFrom = vi.fn()

vi.mock('@/shared/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
    auth: {
      getUser: mockGetUser,
    },
  })),
}))

// Import service after mocking
const { profileService } = await import('./profileService')

describe('ProfileService - TAG-004: Profile Service', () => {
  const mockProfile: Profile = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'customer' as UserRole,
    tier: 'conocedor',
    points_balance: 500,
    total_spent: 3000,
    visit_count: 8,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProfile', () => {
    it('should fetch profile by user ID', async () => {
      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq.mockReturnValue({
            single: mockSingle.mockResolvedValue({
              data: mockProfile,
              error: null,
            }),
          }),
        }),
      })

      const result = await profileService.getProfile('user-123')

      expect(result).toEqual(mockProfile)
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('id', 'user-123')
    })

    it('should return null when profile not found', async () => {
      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq.mockReturnValue({
            single: mockSingle.mockResolvedValue({
              data: null,
              error: { message: 'No rows found' },
            }),
          }),
        }),
      })

      const result = await profileService.getProfile('nonexistent')

      expect(result).toBeNull()
    })

    it('should return null on database error', async () => {
      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq.mockReturnValue({
            single: mockSingle.mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      })

      const result = await profileService.getProfile('user-123')

      expect(result).toBeNull()
    })
  })

  describe('getCurrentProfile', () => {
    it('should fetch current user profile', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })

      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq.mockReturnValue({
            single: mockSingle.mockResolvedValue({
              data: mockProfile,
              error: null,
            }),
          }),
        }),
      })

      const result = await profileService.getCurrentProfile()

      expect(result).toEqual(mockProfile)
      expect(mockGetUser).toHaveBeenCalled()
    })

    it('should return null when no authenticated user', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await profileService.getCurrentProfile()

      expect(result).toBeNull()
      expect(mockFrom).not.toHaveBeenCalled()
    })

    it('should return null when profile fetch fails', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })

      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq.mockReturnValue({
            single: mockSingle.mockResolvedValue({
              data: null,
              error: { message: 'Profile not found' },
            }),
          }),
        }),
      })

      const result = await profileService.getCurrentProfile()

      expect(result).toBeNull()
    })
  })

  describe('updateProfile', () => {
    it('should update profile name', async () => {
      const updateData: UpdateProfileData = { name: 'Updated Name' }

      const updatedProfile = { ...mockProfile, name: 'Updated Name' }

      mockFrom.mockReturnValue({
        update: mockUpdate.mockReturnValue({
          eq: mockEq.mockReturnValue({
            select: mockSelect.mockReturnValue({
              single: mockSingle.mockResolvedValue({
                data: updatedProfile,
                error: null,
              }),
            }),
          }),
        }),
      })

      const result = await profileService.updateProfile('user-123', updateData)

      expect(result).toEqual(updatedProfile)
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Name',
          updated_at: expect.any(String),
        })
      )
    })

    it('should update profile email', async () => {
      const updateData: UpdateProfileData = { email: 'newemail@example.com' }

      const updatedProfile = { ...mockProfile, email: 'newemail@example.com' }

      mockFrom.mockReturnValue({
        update: mockUpdate.mockReturnValue({
          eq: mockEq.mockReturnValue({
            select: mockSelect.mockReturnValue({
              single: mockSingle.mockResolvedValue({
                data: updatedProfile,
                error: null,
              }),
            }),
          }),
        }),
      })

      const result = await profileService.updateProfile('user-123', updateData)

      expect(result).toEqual(updatedProfile)
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'newemail@example.com',
        })
      )
    })

    it('should update both name and email', async () => {
      const updateData: UpdateProfileData = {
        name: 'New Name',
        email: 'new@example.com',
      }

      const updatedProfile = {
        ...mockProfile,
        name: 'New Name',
        email: 'new@example.com',
      }

      mockFrom.mockReturnValue({
        update: mockUpdate.mockReturnValue({
          eq: mockEq.mockReturnValue({
            select: mockSelect.mockReturnValue({
              single: mockSingle.mockResolvedValue({
                data: updatedProfile,
                error: null,
              }),
            }),
          }),
        }),
      })

      const result = await profileService.updateProfile('user-123', updateData)

      expect(result).toEqual(updatedProfile)
    })

    it('should throw error when update fails', async () => {
      const updateData: UpdateProfileData = { name: 'Updated' }

      mockFrom.mockReturnValue({
        update: mockUpdate.mockReturnValue({
          eq: mockEq.mockReturnValue({
            select: mockSelect.mockReturnValue({
              single: mockSingle.mockResolvedValue({
                data: null,
                error: { message: 'Update failed' },
              }),
            }),
          }),
        }),
      })

      await expect(
        profileService.updateProfile('user-123', updateData)
      ).rejects.toThrow('No se pudo actualizar el perfil')
    })
  })

  describe('getProfileStats', () => {
    it('should fetch profile stats', async () => {
      const mockStats: ProfileStats = {
        points_balance: 500,
        total_spent: 3000,
        visit_count: 8,
        tier: 'conocedor',
      }

      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq.mockReturnValue({
            single: mockSingle.mockResolvedValue({
              data: mockStats,
              error: null,
            }),
          }),
        }),
      })

      const result = await profileService.getProfileStats('user-123')

      expect(result).toEqual(mockStats)
      expect(mockSelect).toHaveBeenCalledWith(
        'points_balance, total_spent, visit_count, tier'
      )
    })

    it('should return null when stats fetch fails', async () => {
      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq.mockReturnValue({
            single: mockSingle.mockResolvedValue({
              data: null,
              error: { message: 'Stats not found' },
            }),
          }),
        }),
      })

      const result = await profileService.getProfileStats('user-123')

      expect(result).toBeNull()
    })
  })

  describe('getProfilesByRole', () => {
    it('should fetch profiles by role (customer)', async () => {
      const mockProfiles: Profile[] = [mockProfile]

      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq.mockReturnValue({
            order: mockOrder.mockReturnValue({
              data: mockProfiles,
              error: null,
            }),
          }),
        }),
      })

      const result = await profileService.getProfilesByRole('customer')

      expect(result).toEqual(mockProfiles)
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('role', 'customer')
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false })
    })

    it('should fetch profiles by role (staff)', async () => {
      const staffProfile: Profile = {
        ...mockProfile,
        id: 'staff-123',
        role: 'staff',
      }

      const mockProfiles: Profile[] = [staffProfile]

      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq.mockReturnValue({
            order: mockOrder.mockReturnValue({
              data: mockProfiles,
              error: null,
            }),
          }),
        }),
      })

      const result = await profileService.getProfilesByRole('staff')

      expect(result).toEqual(mockProfiles)
      expect(mockEq).toHaveBeenCalledWith('role', 'staff')
    })

    it('should return empty array on error', async () => {
      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq.mockReturnValue({
            order: mockOrder.mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      })

      const result = await profileService.getProfilesByRole('admin')

      expect(result).toEqual([])
    })

    it('should return empty array when no profiles found', async () => {
      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq.mockReturnValue({
            order: mockOrder.mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      })

      const result = await profileService.getProfilesByRole('admin')

      expect(result).toEqual([])
    })
  })

  describe('searchProfiles', () => {
    it('should search profiles by name', async () => {
      const mockProfiles: Profile[] = [mockProfile]

      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          or: mockOr.mockReturnValue({
            limit: mockLimit.mockResolvedValue({
              data: mockProfiles,
              error: null,
            }),
          }),
        }),
      })

      const result = await profileService.searchProfiles('Test')

      expect(result).toEqual(mockProfiles)
      expect(mockOr).toHaveBeenCalledWith('name.ilike.%Test%,email.ilike.%Test%')
      expect(mockLimit).toHaveBeenCalledWith(20)
    })

    it('should search profiles by email', async () => {
      const mockProfiles: Profile[] = [mockProfile]

      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          or: mockOr.mockReturnValue({
            limit: mockLimit.mockResolvedValue({
              data: mockProfiles,
              error: null,
            }),
          }),
        }),
      })

      const result = await profileService.searchProfiles('test@example.com')

      expect(result).toEqual(mockProfiles)
    })

    it('should return empty array on search error', async () => {
      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          or: mockOr.mockReturnValue({
            limit: mockLimit.mockResolvedValue({
              data: null,
              error: { message: 'Search failed' },
            }),
          }),
        }),
      })

      const result = await profileService.searchProfiles('query')

      expect(result).toEqual([])
    })

    it('should return empty array when no results', async () => {
      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          or: mockOr.mockReturnValue({
            limit: mockLimit.mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      })

      const result = await profileService.searchProfiles('nonexistent')

      expect(result).toEqual([])
    })
  })
})
