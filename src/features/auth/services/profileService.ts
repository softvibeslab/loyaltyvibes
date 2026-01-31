'use client';

import { createClient } from '@/shared/lib/supabase/client';
import { Profile, UserRole, TierLevel } from '../types';

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface ProfileStats {
  points_balance: number;
  total_spent: number;
  visit_count: number;
  tier: TierLevel;
}

class ProfileService {
  private supabase = createClient();

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data as Profile;
  }

  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await this.supabase.auth.getUser();

    if (!user) {
      return null;
    }

    return this.getProfile(user.id);
  }

  async updateProfile(userId: string, data: UpdateProfileData): Promise<Profile | null> {
    const { data: profile, error } = await this.supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw new Error('No se pudo actualizar el perfil');
    }

    return profile as Profile;
  }

  async getProfileStats(userId: string): Promise<ProfileStats | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('points_balance, total_spent, visit_count, tier')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching stats:', error);
      return null;
    }

    return data as ProfileStats;
  }

  async getProfilesByRole(role: UserRole): Promise<Profile[]> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles by role:', error);
      return [];
    }

    return data as Profile[];
  }

  async searchProfiles(query: string): Promise<Profile[]> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(20);

    if (error) {
      console.error('Error searching profiles:', error);
      return [];
    }

    return data as Profile[];
  }
}

export const profileService = new ProfileService();
