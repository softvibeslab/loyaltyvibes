'use client';

import { useState, useEffect, useCallback } from 'react';
import { Profile } from '../types';
import { profileService, UpdateProfileData } from '../services/profileService';
import { createClient } from '@/shared/lib/supabase/client';

interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        return;
      }

      const profileData = await profileService.getProfile(user.id);
      setProfile(profileData);
    } catch (err) {
      setError('Error al cargar el perfil');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    if (!profile) {
      throw new Error('No hay perfil cargado');
    }

    try {
      setLoading(true);
      setError(null);

      const updated = await profileService.updateProfile(profile.id, data);
      if (updated) {
        setProfile(updated);
      }
    } catch (err) {
      setError('Error al actualizar el perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchProfile();

    // Subscribe to realtime profile changes
    const supabase = createClient();

    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const channel = supabase
          .channel('profile-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${user.id}`,
            },
            (payload) => {
              if (payload.eventType === 'UPDATE') {
                setProfile(payload.new as Profile);
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    };

    setupSubscription();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
}

// Hook for profile stats only (lighter)
export function useProfileStats() {
  const [stats, setStats] = useState<{
    points_balance: number;
    total_spent: number;
    visit_count: number;
    tier: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const statsData = await profileService.getProfileStats(user.id);
        setStats(statsData);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  return { stats, loading };
}
