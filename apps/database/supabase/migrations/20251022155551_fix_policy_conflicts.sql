-- Migration: Fix policy conflicts
-- Created: 2025-10-22 15:55:51
-- This migration handles existing policy conflicts by dropping and recreating them safely
-- Drop existing policies that might conflict
DROP POLICY IF EXISTS select_all_policy ON public.private_items;
DROP POLICY IF EXISTS insert_auth_policy ON public.private_items;
DROP POLICY IF EXISTS update_auth_policy ON public.private_items;
DROP POLICY IF EXISTS update_own_policy ON public.private_items;
DROP POLICY IF EXISTS delete_own_policy ON public.private_items;

-- Recreate all policies with proper names and logic
CREATE POLICY select_all_policy ON public.private_items FOR
SELECT USING (TRUE);

CREATE POLICY insert_auth_policy ON public.private_items FOR
INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY update_own_policy ON public.private_items FOR
UPDATE USING (auth.uid() = id);

CREATE POLICY delete_own_policy ON public.private_items FOR DELETE USING (auth.uid() = id);
