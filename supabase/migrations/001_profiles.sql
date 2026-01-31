-- SPEC-AUTH-001: Profiles table for user data
-- Extends auth.users with application-specific fields

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    role TEXT CHECK (role IN ('admin', 'staff', 'customer')) DEFAULT 'customer',
    tier TEXT CHECK (tier IN ('explorador', 'conocedor', 'embajador')) DEFAULT 'explorador',
    points_balance INTEGER DEFAULT 0 CHECK (points_balance >= 0),
    total_spent DECIMAL(10,2) DEFAULT 0 CHECK (total_spent >= 0),
    visit_count INTEGER DEFAULT 0 CHECK (visit_count >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own profile (name only)
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy: Allow insert for authenticated users (registration)
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update timestamp on profile changes
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Index for role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Index for tier-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON public.profiles(tier);
