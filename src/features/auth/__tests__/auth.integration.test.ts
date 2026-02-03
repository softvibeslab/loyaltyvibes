import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createClient } from '@/shared/lib/supabase/client';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import type { Profile, RegisterInput, LoginInput } from '../types';

// Mock Supabase client completely
const mockSupabase = {
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
  from: vi.fn(),
};

vi.mock('@/shared/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}));

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('Authentication Flow Integration', () => {
  const mockProfile: Profile = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'customer',
    tier: 'explorador',
    points_balance: 0,
    total_spent: 0,
    visit_count: 0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockPush.mockClear();

    // Setup default onAuthStateChange mock
    mockSupabase.auth.onAuthStateChange.mockImplementation(
      (callback: any) => {
        callback('SIGNED_IN', {
          user: { id: 'user-123', email: 'test@example.com' },
        });
        return {
          data: { subscription: { unsubscribe: vi.fn() } },
        };
      }
    );
  });

  describe('Registration Flow', () => {
    const registerInput: RegisterInput = {
      email: 'newuser@example.com',
      password: 'Password123',
      name: 'New User',
      role: 'customer',
    };

    it('should complete full registration journey', async () => {
      // Mock successful auth signup
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'user-123', email: registerInput.email } },
        error: null,
      });

      // Mock profile creation
      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      // Mock session check after registration
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: { user: { id: 'user-123', email: registerInput.email } },
        },
      });

      // Call authService.register
      const result = await authService.register(registerInput);

      // Verify auth user creation
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: registerInput.email,
        password: registerInput.password,
      });

      // Verify profile creation
      expect(mockInsert).toHaveBeenCalledWith({
        id: 'user-123',
        email: registerInput.email,
        name: registerInput.name,
        role: registerInput.role,
        tier: 'explorador',
        points_balance: 0,
        total_spent: 0,
        visit_count: 0,
      });

      // Verify success
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProfile);
      expect(result.error).toBeNull();
    });

    it('should create both auth user and profile', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      await authService.register(registerInput);

      expect(mockSupabase.auth.signUp).toHaveBeenCalled();
      expect(mockInsert).toHaveBeenCalled();
    });

    it('should set initial tier to explorador', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      await authService.register(registerInput);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          tier: 'explorador',
        })
      );
    });

    it('should redirect to wallet after registration via useAuth', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Mock authService.register
      vi.spyOn(authService, 'register').mockResolvedValue({
        data: { ...mockProfile, role: 'customer' },
        error: null,
      });

      await act(async () => {
        await result.current.register(registerInput);
      });

      expect(mockPush).toHaveBeenCalledWith('/wallet');
    });

    it('should maintain session after redirect', async () => {
      mockSupabase.auth.getSession
        .mockResolvedValueOnce({
          data: { session: null },
        })
        .mockResolvedValueOnce({
          data: {
            session: { user: { id: 'user-123', email: registerInput.email } },
          },
        });

      vi.spyOn(authService, 'getProfile').mockResolvedValue(mockProfile);

      const { result, rerender } = renderHook(() => useAuth());

      // Initial load - no session
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isAuthenticated).toBe(false);
      });

      // Simulate page refresh after registration
      mockSupabase.auth.onAuthStateChange.mockImplementation(
        (callback: any) => {
          callback('SIGNED_IN', {
            user: { id: 'user-123', email: registerInput.email },
          });
          return {
            data: { subscription: { unsubscribe: vi.fn() } },
          };
        }
      );

      rerender();

      // Session should be maintained
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user).toEqual(mockProfile);
      });
    });
  });

  describe('Login Flow', () => {
    const loginInput: LoginInput = {
      email: 'existing@example.com',
      password: 'Password123',
    };

    it('should complete full login journey', async () => {
      // Mock successful authentication
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'user-123', email: loginInput.email } },
        error: null,
      });

      // Mock profile fetch
      const mockEq = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      // Call authService.login
      const result = await authService.login(loginInput);

      // Verify authentication
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: loginInput.email,
        password: loginInput.password,
      });

      // Verify profile fetch
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockEq).toHaveBeenCalledWith('id', 'user-123');

      // Verify success
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProfile);
      expect(result.error).toBeNull();
    });

    it('should authenticate with valid credentials', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      const mockEq = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await authService.login(loginInput);

      expect(result.success).toBe(true);
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalled();
    });

    it('should load profile after authentication', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      const mockEq = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      await authService.login(loginInput);

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', 'user-123');
    });

    it('should redirect based on user role', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Test admin role
      vi.spyOn(authService, 'login').mockResolvedValue({
        data: { ...mockProfile, role: 'admin' },
        error: null,
      });

      await act(async () => {
        await result.current.login(loginInput);
      });

      expect(mockPush).toHaveBeenCalledWith('/dashboard');

      // Test staff role
      vi.spyOn(authService, 'login').mockResolvedValue({
        data: { ...mockProfile, role: 'staff' },
        error: null,
      });

      await act(async () => {
        await result.current.login(loginInput);
      });

      expect(mockPush).toHaveBeenCalledWith('/scanner');

      // Test customer role
      vi.spyOn(authService, 'login').mockResolvedValue({
        data: { ...mockProfile, role: 'customer' },
        error: null,
      });

      await act(async () => {
        await result.current.login(loginInput);
      });

      expect(mockPush).toHaveBeenCalledWith('/wallet');
    });

    it('should maintain session across page refreshes', async () => {
      // First load - authenticate
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: { user: { id: 'user-123', email: loginInput.email } },
        },
      });

      vi.spyOn(authService, 'getProfile').mockResolvedValue(mockProfile);

      const { result, rerender } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      // Simulate page refresh - session should persist
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: { user: { id: 'user-123', email: loginInput.email } },
        },
      });

      rerender();

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user).toEqual(mockProfile);
      });
    });
  });

  describe('Logout Flow', () => {
    it('should complete logout and redirect', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: { user: { id: 'user-123' } },
        },
      });

      vi.spyOn(authService, 'getProfile').mockResolvedValue(mockProfile);

      mockSupabase.auth.signOut.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should clear all auth state', async () => {
      mockSupabase.auth.getSession
        .mockResolvedValueOnce({
          data: {
            session: { user: { id: 'user-123' } },
          },
        })
        .mockResolvedValueOnce({
          data: { session: null },
        });

      vi.spyOn(authService, 'getProfile').mockResolvedValue(mockProfile);

      mockSupabase.auth.signOut.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.logout();
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
      });
    });

    it('should prevent access to protected routes after logout', async () => {
      mockSupabase.auth.getSession
        .mockResolvedValueOnce({
          data: {
            session: { user: { id: 'user-123' } },
          },
        })
        .mockResolvedValue({
          data: { session: null },
        });

      vi.spyOn(authService, 'getProfile').mockResolvedValue(mockProfile);

      mockSupabase.auth.signOut.mockResolvedValue({ error: null });

      // Simulate SIGNED_OUT event
      mockSupabase.auth.onAuthStateChange.mockImplementation(
        (callback: any) => {
          setTimeout(() => {
            callback('SIGNED_OUT', null);
          }, 0);
          return {
            data: { subscription: { unsubscribe: vi.fn() } },
          };
        }
      );

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.logout();
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
      });
    });
  });

  describe('Error Scenarios', () => {
    it('should show correct error for invalid credentials', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: new Error('Invalid login credentials'),
      });

      const mockEq = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      await act(async () => {
        await authService.login({
          email: 'wrong@example.com',
          password: 'wrongpass',
        });
      });

      const loginResult = await authService.login({
        email: 'wrong@example.com',
        password: 'wrongpass',
      });

      expect(loginResult.error).toBe('Email o contrasena invalidos');
    });

    it('should handle profile fetch failure', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      const mockEq = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Profile not found'),
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await authService.login({
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(result.error).toBe('Error al cargar perfil');
    });
  });
});
