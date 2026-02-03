-- Migration: 005_redemptions
-- Description: Redemptions tracking table for reward redemption system
-- SPEC-GAMIFICATION-002: LoyaltyVibes rewards and redemptions

-- Create redemptions table
CREATE TABLE IF NOT EXISTS public.redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    points_used INTEGER NOT NULL CHECK (points_used > 0),
    redemption_code TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'expired', 'cancelled')),
    claimed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Customers can view their own redemptions
CREATE POLICY "Customers can view own redemptions"
    ON public.redemptions FOR SELECT
    USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Staff can create redemptions for customers
CREATE POLICY "Staff can create redemptions"
    ON public.redemptions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Customers can update status of their own redemptions (claim/cancel)
CREATE POLICY "Customers can claim own redemptions"
    ON public.redemptions FOR UPDATE
    USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Only admins can delete redemptions
CREATE POLICY "Admins can delete redemptions"
    ON public.redemptions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON public.redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_reward_id ON public.redemptions(reward_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_transaction_id ON public.redemptions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_status ON public.redemptions(status);
CREATE INDEX IF NOT EXISTS idx_redemptions_redemption_code ON public.redemptions(redemption_code);
CREATE INDEX IF NOT EXISTS idx_redemptions_expires_at ON public.redemptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_redemptions_created_at ON public.redemptions(created_at DESC);

-- Composite index for user's active redemptions
CREATE INDEX IF NOT EXISTS idx_redemptions_user_status ON public.redemptions(user_id, status);

-- Function: Generate unique redemption code
CREATE OR REPLACE FUNCTION public.generate_redemption_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists BOOLEAN;
BEGIN
    -- Generate code in format LV-XXXX-XXXX-XXXX
    -- Retry if collision occurs (very unlikely with UUID-based random)
    LOOP
        code := 'LV-' || upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 4)) || '-' ||
                upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 4)) || '-' ||
                upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 4));

        SELECT EXISTS(SELECT 1 FROM public.redemptions WHERE redemption_code = code) INTO exists;

        IF NOT EXISTS THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Auto-expire pending redemptions
CREATE OR REPLACE FUNCTION public.expire_pending_redemptions()
RETURNS VOID AS $$
BEGIN
    UPDATE public.redemptions
    SET status = 'expired'
    WHERE status = 'pending'
      AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Set claimed_at timestamp when status changes to claimed
CREATE OR REPLACE FUNCTION public.set_claimed_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    -- Set claimed_at when status changes to claimed
    IF NEW.status = 'claimed' AND (OLD IS NULL OR OLD.status != 'claimed') THEN
        NEW.claimed_at = NOW();
    END IF;

    -- Clear claimed_at if status changes from claimed
    IF NEW.status != 'claimed' AND (OLD IS NOT NULL AND OLD.status = 'claimed') THEN
        NEW.claimed_at = NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-set claimed_at on status change
DROP TRIGGER IF EXISTS trigger_set_claimed_timestamp ON public.redemptions;

CREATE TRIGGER trigger_set_claimed_timestamp
    BEFORE UPDATE OF status ON public.redemptions
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION public.set_claimed_timestamp();

-- Function: Decrement reward stock on redemption
CREATE OR REPLACE FUNCTION public.decrement_reward_stock()
RETURNS TRIGGER AS $$
DECLARE
    v_is_limited BOOLEAN;
BEGIN
    -- Only decrement for new redemptions
    IF (TG_OP = 'INSERT') THEN
        -- Check if reward is limited
        SELECT is_limited INTO v_is_limited
        FROM public.rewards
        WHERE id = NEW.reward_id;

        -- Decrement stock for limited rewards
        IF v_is_limited THEN
            UPDATE public.rewards
            SET stock = stock - 1
            WHERE id = NEW.reward_id AND stock IS NOT NULL AND stock > 0;
        END IF;

        RETURN NEW;
    END IF;

    -- If redemption is cancelled, restore stock
    IF (TG_OP = 'UPDATE') AND OLD.status = 'pending' AND NEW.status = 'cancelled' THEN
        UPDATE public.rewards
        SET stock = stock + 1
        WHERE id = NEW.reward_id AND is_limited = true;
        RETURN NEW;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auto-decrement stock on redemption
DROP TRIGGER IF EXISTS trigger_decrement_reward_stock ON public.redemptions;

CREATE TRIGGER trigger_decrement_reward_stock
    AFTER INSERT OR UPDATE OF status ON public.redemptions
    FOR EACH ROW
    EXECUTE FUNCTION public.decrement_reward_stock();

-- Create view for redemption summary
CREATE OR REPLACE VIEW public.redemption_summary AS
SELECT
    r.id AS reward_id,
    r.name AS reward_name,
    r.category,
    COUNT(red.id) AS total_redemptions,
    COUNT(CASE WHEN red.status = 'claimed' THEN 1 END) AS claimed_count,
    COUNT(CASE WHEN red.status = 'pending' THEN 1 END) AS pending_count,
    COUNT(CASE WHEN red.status = 'expired' THEN 1 END) AS expired_count,
    SUM(red.points_used) AS total_points_redeemed
FROM public.rewards r
LEFT JOIN public.redemptions red ON red.reward_id = r.id
GROUP BY r.id, r.name, r.category;

-- Grant access to the view
GRANT SELECT ON public.redemption_summary TO authenticated;

-- Add comment for documentation
COMMENT ON TABLE public.redemptions IS 'Registro de canjes de recompensas por usuarios';
COMMENT ON COLUMN public.redemptions.redemption_code IS 'Código único formato LV-XXXX-XXXX-XXXX para validar el canje';
COMMENT ON COLUMN public.redemptions.claimed_at IS 'Timestamp cuando el usuario reclama físicamente la recompensa';
COMMENT ON COLUMN public.redemptions.expires_at IS 'Fecha de expiración del canje (generalmente 30 días)';
