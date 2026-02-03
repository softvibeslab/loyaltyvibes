import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import * as authService from '../services/authService';
import type { Profile, RegisterInput, LoginInput } from '../../types';

// Mock Supabase client
const mockAuthStateChange = vi.fn();
const mockUnsubscribe = vi.fn();

const mockSupabase = {
  auth: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    })),
  },
};

vi.mock('@/shared/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}));

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock authService
const mockAuthResult = {
  data: null,
  error: null as string | null,
};

vi.mock('../services/authService', () => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    getSession: vi.fn(),
    getProfile: vi.fn(),
  },
}));

describe('useAuth', () => {
  const mockProfile: Profile = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'customer',
    tier: 'explorador',
    points_balance: 100,
    total_spent: 50,
    visit_count: 5,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockPush.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with loading state true', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(true);
    });

    it('should load session on mount', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: { user: { id: 'user-123', email: 'test@example.com' } },
        },
      });

      vi.spyOn(authService.auth, 'getProfile').mockResolvedValue(mockProfile);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(mockSupabase.auth.getSession).toHaveBeenCalled();
      });
    });

    it('should set loading to false after session check', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should set user if session exists', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: { user: { id: 'user-123' } },
        },
      });

      vi.spyOn(authService.auth, 'getProfile').mockResolvedValue(mockProfile);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.user).toEqual(mockProfile);
        expect(result.current.isAuthenticated).toBe(true);
      });
    });

    it('should not set user if no session', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
      });
    });
  });

  describe('auth state changes', () => {
    it('should update state on SIGNED_IN event', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      const onAuthStateChangeCallback = vi.fn();
      mockSupabase.auth.onAuthStateChange.mockImplementation(
        (callback: any) => {
          onAuthStateChangeCallback.mockImplementation(callback);
          return {
            data: { subscription: { unsubscribe: mockUnsubscribe } },
          };
        }
      );

      vi.spyOn(authService.auth, 'getProfile').mockResolvedValue(mockProfile);

      renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        onAuthStateChangeCallback('SIGNED_IN', {
          user: { id: 'user-123' },
        });
      });

      await waitFor(() => {
        expect(authService.auth.getProfile).toHaveBeenCalledWith('user-123');
      });
    });

    it('should clear state on SIGNED_OUT event', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: {
          session: { user: { id: 'user-123' } },
        },
      });

      vi.spyOn(authService.auth, 'getProfile').mockResolvedValue(mockProfile);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      const onAuthStateChangeCallback = vi.fn();
      mockSupabase.auth.onAuthStateChange.mockImplementation(
        (callback: any) => {
          onAuthStateChangeCallback.mockImplementation(callback);
          return {
            data: { subscription: { unsubscribe: mockUnsubscribe } },
          };
        }
      );

      await act(async () => {
        onAuthStateChangeCallback('SIGNED_OUT', null);
      });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
      });
    });

    it('should unsubscribe from auth changes on unmount', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      const { unmount } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    const registerInput: RegisterInput = {
      email: 'new@example.com',
      password: 'Password123',
      name: 'New User',
      role: 'customer',
    };

    it('should call authService.register with input', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      vi.spyOn(authService.auth, 'register').mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        const success = await result.current.register(registerInput);
        expect(success).toBe(true);
      });

      expect(authService.auth.register).toHaveBeenCalledWith(registerInput);
    });

    it('should set loading state during registration', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      vi.spyOn(authService.auth, 'register').mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({ data: mockProfile, error: null });
            }, 100);
          })
      );

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.register(registerInput);
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should set error if registration fails', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      vi.spyOn(authService.auth, 'register').mockResolvedValue({
        data: null,
        error: 'Registration failed',
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        const success = await result.current.register(registerInput);
        expect(success).toBe(false);
      });

      expect(result.current.error).toBe('Registration failed');
      expect(result.current.isLoading).toBe(false);
    });

    it('should redirect to /wallet on customer registration', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      const customerProfile = { ...mockProfile, role: 'customer' as const };
      vi.spyOn(authService.auth, 'register').mockResolvedValue({
        data: customerProfile,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.register(registerInput);
      });

      expect(mockPush).toHaveBeenCalledWith('/wallet');
    });

    it('should redirect to /scanner on staff registration', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      const staffProfile = { ...mockProfile, role: 'staff' as const };
      vi.spyOn(authService.auth, 'register').mockResolvedValue({
        data: staffProfile,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.register(registerInput);
      });

      expect(mockPush).toHaveBeenCalledWith('/scanner');
    });

    it('should redirect to /dashboard on admin registration', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      const adminProfile = { ...mockProfile, role: 'admin' as const };
      vi.spyOn(authService.auth, 'register').mockResolvedValue({
        data: adminProfile,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.register(registerInput);
      });

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('should return true on success', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      vi.spyOn(authService.auth, 'register').mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let success = false;
      await act(async () => {
        success = await result.current.register(registerInput);
      });

      expect(success).toBe(true);
    });

    it('should return false on failure', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      vi.spyOn(authService.auth, 'register').mockResolvedValue({
        data: null,
        error: 'Error',
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let success = true;
      await act(async () => {
        success = await result.current.register(registerInput);
      });

      expect(success).toBe(false);
    });
  });

  describe('login', () => {
    const loginInput: LoginInput = {
      email: 'test@example.com',
      password: 'Password123',
    };

    it('should call authService.login with input', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      vi.spyOn(authService.auth, 'login').mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        const success = await result.current.login(loginInput);
        expect(success).toBe(true);
      });

      expect(authService.auth.login).toHaveBeenCalledWith(loginInput);
    });

    it('should set loading state during login', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      vi.spyOn(authService.auth, 'login').mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({ data: mockProfile, error: null });
            }, 100);
          })
      );

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.login(loginInput);
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should set error if login fails', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      vi.spyOn(authService.auth, 'login').mockResolvedValue({
        data: null,
        error: 'Invalid credentials',
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        const success = await result.current.login(loginInput);
        expect(success).toBe(false);
      });

      expect(result.current.error).toBe('Invalid credentials');
      expect(result.current.isLoading).toBe(false);
    });

    it('should redirect to role-specific route on success', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      vi.spyOn(authService.auth, 'login').mockResolvedValue({
        data: { ...mockProfile, role: 'customer' },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login(loginInput);
      });

      expect(mockPush).toHaveBeenCalledWith('/wallet');
    });

    it('should clear existing errors before login', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      vi.spyOn(authService.auth, 'login').mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.clearError();
        await result.current.login(loginInput);
      });

      expect(result.current.error).toBeNull();
    });

    it('should return true on success', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      vi.spyOn(authService.auth, 'login').mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let success = false;
      await act(async () => {
        success = await result.current.login(loginInput);
      });

      expect(success).toBe(true);
    });

    it('should return false on failure', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      vi.spyOn(authService.auth, 'login').mockResolvedValue({
        data: null,
        error: 'Error',
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let success = true;
      await act(async () => {
        success = await result.current.login(loginInput);
      });

      expect(success).toBe(false);
    });
  });

  describe('logout', () => {
    it('should call authService.logout', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      vi.spyOn(authService.auth, 'logout').mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(authService.auth.logout).toHaveBeenCalled();
    });

    it('should redirect to /', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      vi.spyOn(authService.auth, 'logout').mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      vi.spyOn(authService.auth, 'login').mockResolvedValue({
        data: null,
        error: 'Test error',
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login({ email: 'test@test.com', password: 'pass' });
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
