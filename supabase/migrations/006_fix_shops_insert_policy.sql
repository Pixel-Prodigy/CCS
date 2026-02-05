-- Fix: Recreate the INSERT policy for shops table
-- This ensures authenticated users can create shops during onboarding
-- Drop the policy if it exists (ignore error if it doesn't)
DROP POLICY IF EXISTS "Authenticated users can create shop" ON shops;
-- Recreate the policy with explicit syntax
CREATE POLICY "Authenticated users can create shop" ON shops FOR
INSERT TO authenticated WITH CHECK (true);