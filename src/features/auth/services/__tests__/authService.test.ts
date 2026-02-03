import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from '../authService';
import type { Profile, RegisterInput, LoginInput } from '../../types';

// Mock Supabase client
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

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('register', () => {
    const validInput: RegisterInput = {
      email: 'test@example.com',
      password: 'Password123',
      name: 'Test User',
      role: 'customer',
    };

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

    it('should create auth user in Supabase', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'user-123', email: validInput.email } },
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

      const result = await authService.register(validInput);

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: validInput.email,
        password: validInput.password,
      });
      expect(result.success).toBe(true);
    });

    it('should create profile with default tier explorador and 0 points', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'user-123', email: validInput.email } },
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

      await authService.register(validInput);

      expect(mockInsert).toHaveBeenCalledWith({
        id: 'user-123',
        email: validInput.email,
        name: validInput.name,
        role: validInput.role,
        tier: 'explorador',
        points_balance: 0,
        total_spent: 0,
        visit_count: 0,
      });
    });

    it('should return profile data on success', async () => {
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

      const result = await authService.register(validInput);

      if (result.data) {
        expect(result.data.email).toBe(mockProfile.email);
        expect(result.data.role).toBe(mockProfile.role);
        expect(result.data.tier).toBe('explorador');
        expect(result.data.points_balance).toBe(0);
      }
      expect(result.error).toBeNull();
    });

    it('should handle Supabase auth errors', async () => {
      const authError = new Error('Auth failed: Email already exists');
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: authError,
      });

      const result = await authService.register(validInput);

      expect(result.data).toBeNull();
      expect(result.error).toBe(authError.message);
    });

    it('should handle profile creation errors', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });

      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Profile creation failed'),
      });

      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await authService.register(validInput);

      expect(result.data).toBeNull();
      expect(result.error).toBe('Profile creation failed');
    });

    it('should handle when no user returned from registration', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await authService.register(validInput);

      expect(result.data).toBeNull();
      expect(result.error).toBe('No user returned from registration');
    });

    it('should log registration success', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'user-123', email: validInput.email } },
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

      await authService.register(validInput);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[AUTH] Registration successful:',
        validInput.email
      );
      consoleSpy.mockRestore();
    });

    it('should log registration errors', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: new Error('Registration error'),
      });

      await authService.register(validInput);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[AUTH] Registration failed:',
        'Registration error'
      );
      consoleSpy.mockRestore();
    });
  });

  describe('login', () => {
    const validInput: LoginInput = {
      email: 'test@example.com',
      password: 'Password123',
    };

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

    it('should sign in with valid credentials', async () => {
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

      const result = await authService.login(validInput);

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: validInput.email,
        password: validInput.password,
      });
    });

    it('should fetch user profile after authentication', async () => {
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

      await authService.login(validInput);

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', 'user-123');
      expect(mockSingle).toHaveBeenCalled();
    });

    it('should return profile data on success', async () => {
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

      const result = await authService.login(validInput);

      expect(result.data).toEqual(mockProfile);
      expect(result.error).toBeNull();
    });

    it('should handle invalid credentials with generic error', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: new Error('Invalid login credentials'),
      });

      const result = await authService.login(validInput);

      expect(result.data).toBeNull();
      expect(result.error).toBe('Email o contrasena invalidos');
    });

    it('should handle profile fetch errors', async () => {
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

      const result = await authService.login(validInput);

      expect(result.data).toBeNull();
      expect(result.error).toBe('Error al cargar perfil');
    });

    it('should log login success', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'user-123', email: validInput.email } },
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

      await authService.login(validInput);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[AUTH] Login successful:',
        validInput.email
      );
      consoleSpy.mockRestore();
    });

    it('should log login errors', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: new Error('Invalid credentials'),
      });

      await authService.login(validInput);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[AUTH] Login failed:',
        'Invalid credentials'
      );
      consoleSpy.mockRestore();
    });
  });

  describe('logout', () => {
    it('should sign out from Supabase', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null });

      await authService.logout();

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });

    it('should handle logout errors gracefully', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockSupabase.auth.signOut.mockResolvedValue({
        error: new Error('Logout failed'),
      });

      await authService.logout();

      expect(consoleSpy).toHaveBeenCalledWith(
        '[AUTH] Logout failed:',
        'Logout failed'
      );
      consoleSpy.mockRestore();
    });

    it('should log logout success', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockSupabase.auth.signOut.mockResolvedValue({ error: null });

      await authService.logout();

      expect(consoleSpy).toHaveBeenCalledWith('[AUTH] Logout successful');
      consoleSpy.mockRestore();
    });
  });

  describe('getSession', () => {
    it('should return current session', async () => {
      const mockSession = {
        user: { id: 'user-123', email: 'test@example.com' },
        access_token: 'token',
      };
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
      });

      const session = await authService.getSession();

      expect(session).toEqual(mockSession);
    });

    it('should return null if no session', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      const session = await authService.getSession();

      expect(session).toBeNull();
    });
  });

  describe('getProfile', () => {
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

    it('should fetch profile by user ID', async () => {
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

      const profile = await authService.getProfile('user-123');

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', 'user-123');
      expect(profile).toEqual(mockProfile);
    });

    it('should return null on error', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
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

      const profile = await authService.getProfile('user-123');

      expect(profile).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        '[AUTH] Profile fetch failed:',
        'Profile not found'
      );
      consoleSpy.mockRestore();
    });

    it('should handle profile not found', async () => {
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

      const profile = await authService.getProfile('nonexistent-user');

      expect(profile).toBeNull();
    });
  });
});
