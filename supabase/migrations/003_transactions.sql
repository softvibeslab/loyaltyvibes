-- Migration: 003_transactions
-- Description: Transactions table for points earning and redemption

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('earn', 'redeem', 'adjustment', 'expiry')),
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    points INTEGER NOT NULL,
    points_before INTEGER NOT NULL,
    points_after INTEGER NOT NULL,
    multiplier_applied DECIMAL(3,2) NOT NULL DEFAULT 1.0,
    tier_at_transaction TEXT NOT NULL CHECK (tier_at_transaction IN ('explorador', 'conocedor', 'embajador')),
    description TEXT NOT NULL,
    reference_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'failed')),
    staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policies for transactions

-- Customers can only view their own transactions
CREATE POLICY "Customers can view own transactions"
    ON public.transactions FOR SELECT
    USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Staff can create transactions for customers
CREATE POLICY "Staff can create transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Only admins can update transactions
CREATE POLICY "Admins can update transactions"
    ON public.transactions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_staff_id ON public.transactions(staff_id);

-- Function to update profile after transaction
CREATE OR REPLACE FUNCTION public.process_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process completed transactions
    IF NEW.status = 'completed' AND (OLD IS NULL OR OLD.status != 'completed') THEN
        -- Update profile points balance
        UPDATE public.profiles
        SET
            points_balance = NEW.points_after,
            updated_at = NOW()
        WHERE id = NEW.user_id;

        -- If earning transaction, update total_spent and visit_count
        IF NEW.type = 'earn' THEN
            UPDATE public.profiles
            SET
                total_spent = total_spent + NEW.amount,
                visit_count = visit_count + 1
            WHERE id = NEW.user_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for transaction processing
DROP TRIGGER IF EXISTS trigger_process_transaction ON public.transactions;

CREATE TRIGGER trigger_process_transaction
    AFTER INSERT OR UPDATE OF status
    ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.process_transaction();

-- Create view for monthly transaction summaries
CREATE OR REPLACE VIEW public.monthly_transaction_summary AS
SELECT
    user_id,
    DATE_TRUNC('month', created_at) AS month,
    SUM(CASE WHEN type = 'earn' THEN points ELSE 0 END) AS earned,
    SUM(CASE WHEN type = 'redeem' THEN ABS(points) ELSE 0 END) AS redeemed,
    COUNT(*) AS transaction_count,
    SUM(CASE WHEN type = 'earn' THEN amount ELSE 0 END) AS total_spent
FROM public.transactions
WHERE status = 'completed'
GROUP BY user_id, DATE_TRUNC('month', created_at);

-- Grant access to the view
GRANT SELECT ON public.monthly_transaction_summary TO authenticated;
