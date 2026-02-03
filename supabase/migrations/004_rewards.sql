-- Migration: 004_rewards
-- Description: Rewards catalog table for gamification system
-- SPEC-GAMIFICATION-002: LoyaltyVibes rewards and redemptions

-- Create rewards table
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    points_cost INTEGER NOT NULL CHECK (points_cost > 0),
    stock INTEGER CHECK (stock >= 0),
    image_url TEXT,
    min_tier TEXT NOT NULL CHECK (min_tier IN ('explorador', 'conocedor', 'embajador')) DEFAULT 'explorador',
    category TEXT NOT NULL CHECK (category IN ('food', 'drink', 'merchandise', 'experience', 'discount')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_limited BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Customers can view active rewards
CREATE POLICY "Customers can view active rewards"
    ON public.rewards FOR SELECT
    USING (
        is_active = true OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Staff can create rewards
CREATE POLICY "Staff can create rewards"
    ON public.rewards FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Staff can update rewards
CREATE POLICY "Staff can update rewards"
    ON public.rewards FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Only admins can delete rewards
CREATE POLICY "Admins can delete rewards"
    ON public.rewards FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_rewards_is_active ON public.rewards(is_active);
CREATE INDEX IF NOT EXISTS idx_rewards_category ON public.rewards(category);
CREATE INDEX IF NOT EXISTS idx_rewards_min_tier ON public.rewards(min_tier);
CREATE INDEX IF NOT EXISTS idx_rewards_points_cost ON public.rewards(points_cost);
CREATE INDEX IF NOT EXISTS idx_rewards_is_limited ON public.rewards(is_limited);

-- Index for tier-based queries with active filtering
CREATE INDEX IF NOT EXISTS idx_rewards_active_tier ON public.rewards(is_active, min_tier);

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_rewards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update timestamp on reward changes
DROP TRIGGER IF EXISTS rewards_updated_at ON public.rewards;

CREATE TRIGGER rewards_updated_at
    BEFORE UPDATE ON public.rewards
    FOR EACH ROW
    EXECUTE FUNCTION update_rewards_updated_at();

-- Function: Check if reward is available for redemption
CREATE OR REPLACE FUNCTION public.is_reward_available(reward_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_reward RECORD;
BEGIN
    SELECT * INTO v_reward
    FROM public.rewards
    WHERE id = reward_id AND is_active = true;

    -- Reward not found or inactive
    IF NOT FOUND THEN
        RETURN false;
    END IF;

    -- Check stock for limited rewards
    IF v_reward.is_limited THEN
        IF v_reward.stock IS NULL OR v_reward.stock <= 0 THEN
            RETURN false;
        END IF;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment for documentation
COMMENT ON TABLE public.rewards IS 'Catálogo de recompensas canjeables por puntos';
COMMENT ON COLUMN public.rewards.points_cost IS 'Costo en puntos requerido para canjear la recompensa';
COMMENT ON COLUMN public.rewards.stock IS 'Cantidad disponible (NULL para ilimitado cuando is_limited=false)';
COMMENT ON COLUMN public.rewards.min_tier IS 'Nivel mínimo de tier requerido para canjear';
COMMENT ON COLUMN public.rewards.is_limited IS 'Indica si la recompensa tiene stock limitado';
