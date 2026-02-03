import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from './authService'
import type { RegisterInput, LoginInput, Profile } from '../types'

// Mock Supabase client
const mockSignUp = vi.fn()
const mockSignInWithPassword = vi.fn()
const mockSignOut = vi.fn()
const mockGetSession = vi.fn()
const mockFrom = vi.fn()
const mockSelect = vi.fn()
const mockEq = vi.fn()
const mockInsert = vi.fn()
const mockSingle = vi.fn()

vi.mock('@/shared/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signUp: mockSignUp,
      signInWithPassword: mockSignInWithPassword,
      signOut: mockSignOut,
      getSession: mockGetSession,
    },
    from: mockFrom,
  })),
}))

describe('AuthService - TAG-003: Authentication Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('register', () => {
    it('should successfully register a new user with minimal data', async () => {
      const input: RegisterInput = {
        email: 'test@example.com',
        password: 'Password123',
      }

      const mockProfile: Profile = {
        id: 'user-123',
        email: 'test@example.com',
        name: null,
        role: 'customer',
        tier: 'explorador',
        points_balance: 0,
        total_spent: 0,
        visit_count: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      // Mock auth signup success
      mockSignUp.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
        error: null,
      })

      // Mock profile insert
      mockFrom.mockReturnValue({
        insert: mockInsert.mockReturnValue({
          select: mockSelect.mockReturnValue({
            single: mockSingle.mockResolvedValue({
              data: mockProfile,
              error: null,
            }),
          }),
        }),
      })

      const result = await authService.register(input)

      expect(result).toEqual({ data: mockProfile, error: null })
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
      })
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'user-123',
          email: 'test@example.com',
          tier: 'explorador',
          points_balance: 0,
        })
      )
    })

    it('should successfully register a new user with name and role', async () => {
      const input: RegisterInput = {
        email: 'staff@example.com',
        password: 'Password123',
        name: 'John Staff',
        role: 'staff',
      }

      const mockProfile: Profile = {
        id: 'user-456',
        email: 'staff@example.com',
        name: 'John Staff',
        role: 'staff',
        tier: 'explorador',
        points_balance: 0,
        total_spent: 0,
        visit_count: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      mockSignUp.mockResolvedValue({
        data: { user: { id: 'user-456', email: 'staff@example.com' } },
        error: null,
      })

      mockFrom.mockReturnValue({
        insert: mockInsert.mockReturnValue({
          select: mockSelect.mockReturnValue({
            single: mockSingle.mockResolvedValue({
              data: mockProfile,
              error: null,
            }),
          }),
        }),
      })

      const result = await authService.register(input)

      expect(result.data?.name).toBe('John Staff')
      expect(result.data?.role).toBe('staff')
    })

    it('should return error when auth signup fails', async () => {
      const input: RegisterInput = {
        email: 'invalid-email',
        password: 'weak',
      }

      mockSignUp.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid email' },
      })

      const result = await authService.register(input)

      expect(result).toEqual({ data: null, error: 'Invalid email' })
      expect(mockInsert).not.toHaveBeenCalled()
    })

    it('should return error when profile creation fails', async () => {
      const input: RegisterInput = {
        email: 'test@example.com',
        password: 'Password123',
      }

      mockSignUp.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
        error: null,
      })

      mockFrom.mockReturnValue({
        insert: mockInsert.mockReturnValue({
          select: mockSelect.mockReturnValue({
            single: mockSingle.mockResolvedValue({
              data: null,
              error: { message: 'Database constraint failed' },
            }),
          }),
        }),
      })

      const result = await authService.register(input)

      expect(result).toEqual({ data: null, error: 'Database constraint failed' })
    })

    it('should return error when no user returned from signup', async () => {
      const input: RegisterInput = {
        email: 'test@example.com',
        password: 'Password123',
      }

      mockSignUp.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await authService.register(input)

      expect(result).toEqual({ data: null, error: 'No user returned from registration' })
    })
  })

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const input: LoginInput = {
        email: 'test@example.com',
        password: 'Password123',
      }

      const mockProfile: Profile = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'customer',
        tier: 'conocedor',
        points_balance: 500,
        total_spent: 3000,
        visit_count: 8,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      mockSignInWithPassword.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
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

      const result = await authService.login(input)

      expect(result).toEqual({ data: mockProfile, error: null })
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
      })
    })

    it('should return error for invalid credentials', async () => {
      const input: LoginInput = {
        email: 'test@example.com',
        password: 'WrongPassword',
      }

      mockSignInWithPassword.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid login credentials' },
      })

      const result = await authService.login(input)

      expect(result).toEqual({
        data: null,
        error: 'Email o contrasena invalidos',
      })
      expect(mockFrom).not.toHaveBeenCalled()
    })

    it('should return error when profile fetch fails', async () => {
      const input: LoginInput = {
        email: 'test@example.com',
        password: 'Password123',
      }

      mockSignInWithPassword.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
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

      const result = await authService.login(input)

      expect(result).toEqual({ data: null, error: 'Error al cargar perfil' })
    })
  })

  describe('logout', () => {
    it('should successfully logout', async () => {
      mockSignOut.mockResolvedValue({ error: null })

      await expect(authService.logout()).resolves.not.toThrow()

      expect(mockSignOut).toHaveBeenCalled()
    })

    it('should handle logout errors gracefully', async () => {
      mockSignOut.mockResolvedValue({
        error: { message: 'Network error' },
      })

      await expect(authService.logout()).resolves.not.toThrow()

      expect(mockSignOut).toHaveBeenCalled()
    })
  })

  describe('getSession', () => {
    it('should return session when available', async () => {
      const mockSession = {
        user: { id: 'user-123', email: 'test@example.com' },
        access_token: 'token',
      }

      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
      })

      const session = await authService.getSession()

      expect(session).toEqual(mockSession)
      expect(mockGetSession).toHaveBeenCalled()
    })

    it('should return null when no session', async () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
      })

      const session = await authService.getSession()

      expect(session).toBeNull()
    })
  })

  describe('getProfile', () => {
    it('should fetch user profile by ID', async () => {
      const mockProfile: Profile = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'customer',
        tier: 'embajador',
        points_balance: 2000,
        total_spent: 15000,
        visit_count: 25,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

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

      const profile = await authService.getProfile('user-123')

      expect(profile).toEqual(mockProfile)
      expect(mockFrom).toHaveBeenCalledWith('profiles')
      expect(mockEq).toHaveBeenCalledWith('id', 'user-123')
    })

    it('should return null when profile fetch fails', async () => {
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

      const profile = await authService.getProfile('nonexistent')

      expect(profile).toBeNull()
    })

    it('should return null for database errors', async () => {
      mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq.mockReturnValue({
            single: mockSingle.mockResolvedValue({
              data: null,
              error: { message: 'Database connection failed' },
            }),
          }),
        }),
      })

      const profile = await authService.getProfile('user-123')

      expect(profile).toBeNull()
    })
  })
})
