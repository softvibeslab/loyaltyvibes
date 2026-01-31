'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/client';
import { authService } from '../services/authService';
import type { AuthState, Profile, RegisterInput, LoginInput } from '../types';
import { ROLE_REDIRECTS } from '../types';

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Session listener (U-05: maintain session across refreshes)
  useEffect(() => {
    const supabase = createClient();

    // Check initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const profile = await authService.getProfile(session.user.id);
        setState({
          user: profile,
          isLoading: false,
          isAuthenticated: !!profile,
          error: null,
        });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const profile = await authService.getProfile(session.user.id);
        setState({
          user: profile,
          isLoading: false,
          isAuthenticated: !!profile,
          error: null,
        });
      } else if (event === 'SIGNED_OUT') {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = useCallback(
    async (input: RegisterInput): Promise<boolean> => {
      setState((s) => ({ ...s, isLoading: true, error: null }));

      const result = await authService.register(input);

      if (result.error) {
        setState((s) => ({ ...s, isLoading: false, error: result.error }));
        return false;
      }

      // Redirect based on role (E-02)
      const redirectPath = ROLE_REDIRECTS[result.data.role] || '/wallet';
      router.push(redirectPath);
      return true;
    },
    [router]
  );

  const login = useCallback(
    async (input: LoginInput): Promise<boolean> => {
      setState((s) => ({ ...s, isLoading: true, error: null }));

      const result = await authService.login(input);

      if (result.error) {
        setState((s) => ({ ...s, isLoading: false, error: result.error }));
        return false;
      }

      // Redirect based on role (E-02)
      const redirectPath = ROLE_REDIRECTS[result.data.role] || '/wallet';
      router.push(redirectPath);
      return true;
    },
    [router]
  );

  const logout = useCallback(async () => {
    await authService.logout();
    router.push('/'); // E-03: redirect to landing
  }, [router]);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  return {
    ...state,
    register,
    login,
    logout,
    clearError,
  };
}
