-- Migration: 002_tier_trigger
-- Description: Automatic tier promotion trigger

-- Function to calculate and update tier
CREATE OR REPLACE FUNCTION public.check_tier_promotion()
RETURNS TRIGGER AS $$
DECLARE
    new_tier TEXT;
    current_tier TEXT;
BEGIN
    current_tier := NEW.tier;

    -- Calculate tier based on spending and visits
    IF NEW.total_spent >= 15000 AND NEW.visit_count >= 15 THEN
        new_tier := 'embajador';
    ELSIF NEW.total_spent >= 5000 AND NEW.visit_count >= 5 THEN
        new_tier := 'conocedor';
    ELSE
        new_tier := 'explorador';
    END IF;

    -- Only promote, never demote
    IF (new_tier = 'embajador') OR
       (new_tier = 'conocedor' AND current_tier = 'explorador') THEN
        NEW.tier := new_tier;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic tier promotion
DROP TRIGGER IF EXISTS trigger_check_tier_promotion ON public.profiles;

CREATE TRIGGER trigger_check_tier_promotion
    BEFORE UPDATE OF total_spent, visit_count
    ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.check_tier_promotion();

-- Add tier promotion history table for tracking
CREATE TABLE IF NOT EXISTS public.tier_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    previous_tier TEXT NOT NULL CHECK (previous_tier IN ('explorador', 'conocedor', 'embajador')),
    new_tier TEXT NOT NULL CHECK (new_tier IN ('explorador', 'conocedor', 'embajador')),
    promoted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on tier_history
ALTER TABLE public.tier_history ENABLE ROW LEVEL SECURITY;

-- Users can only read their own tier history
CREATE POLICY "Users can view own tier history"
    ON public.tier_history FOR SELECT
    USING (auth.uid() = user_id);

-- Only system can insert tier history (via trigger)
CREATE POLICY "System can insert tier history"
    ON public.tier_history FOR INSERT
    WITH CHECK (true);

-- Function to log tier promotion
CREATE OR REPLACE FUNCTION public.log_tier_promotion()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.tier IS DISTINCT FROM NEW.tier THEN
        INSERT INTO public.tier_history (user_id, previous_tier, new_tier)
        VALUES (NEW.id, OLD.tier, NEW.tier);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for logging tier promotions
DROP TRIGGER IF EXISTS trigger_log_tier_promotion ON public.profiles;

CREATE TRIGGER trigger_log_tier_promotion
    AFTER UPDATE OF tier
    ON public.profiles
    FOR EACH ROW
    WHEN (OLD.tier IS DISTINCT FROM NEW.tier)
    EXECUTE FUNCTION public.log_tier_promotion();

-- Create index for tier history queries
CREATE INDEX IF NOT EXISTS idx_tier_history_user_id ON public.tier_history(user_id);
CREATE INDEX IF NOT EXISTS idx_tier_history_promoted_at ON public.tier_history(promoted_at DESC);
