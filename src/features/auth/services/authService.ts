import { createClient } from '@/shared/lib/supabase/client';
import type { RegisterInput, LoginInput, Profile } from '../types';

type AuthResult<T> = { data: T; error: null } | { data: null; error: string };

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult<Profile>> {
    const supabase = createClient();

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
    });

    if (authError) {
      console.error('[AUTH] Registration failed:', authError.message);
      return { data: null, error: authError.message };
    }

    if (!authData.user) {
      return { data: null, error: 'No user returned from registration' };
    }

    // Create profile with defaults (E-01: explorador tier, 0 points)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: input.email,
        name: input.name || null,
        role: input.role || 'customer',
        tier: 'explorador',
        points_balance: 0,
        total_spent: 0,
        visit_count: 0,
      })
      .select()
      .single();

    if (profileError) {
      console.error('[AUTH] Profile creation failed:', profileError.message);
      return { data: null, error: profileError.message };
    }

    console.log('[AUTH] Registration successful:', authData.user.email);
    return { data: profile as Profile, error: null };
  },

  async login(input: LoginInput): Promise<AuthResult<Profile>> {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      console.error('[AUTH] Login failed:', error.message);
      return { data: null, error: 'Email o contrasena invalidos' };
    }

    // Fetch profile for role-based redirect
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('[AUTH] Profile fetch failed:', profileError.message);
      return { data: null, error: 'Error al cargar perfil' };
    }

    console.log('[AUTH] Login successful:', data.user.email);
    return { data: profile as Profile, error: null };
  },

  async logout(): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[AUTH] Logout failed:', error.message);
    } else {
      console.log('[AUTH] Logout successful');
    }
  },

  async getSession() {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  async getProfile(userId: string): Promise<Profile | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[AUTH] Profile fetch failed:', error.message);
      return null;
    }

    return data as Profile;
  },
};
