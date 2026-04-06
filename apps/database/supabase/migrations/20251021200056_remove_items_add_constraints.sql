-- Migration: Remove items table and add constraints to private_items
-- Created: 2025-10-21 20:00:56
-- Drop items table completely
DROP TABLE IF EXISTS public.items CASCADE;

-- Add primary key to private_items
ALTER TABLE public.private_items
ADD CONSTRAINT private_items_pkey PRIMARY KEY (id);

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_private_items_created_at ON public.private_items(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_private_items_id_created_at ON public.private_items(id, created_at DESC);

-- Fix UPDATE policy
DROP POLICY IF EXISTS update_auth_policy ON public.private_items;
CREATE POLICY update_own_policy ON public.private_items FOR
UPDATE USING (auth.uid() = id);

-- Add DELETE policy
CREATE POLICY delete_own_policy ON public.private_items FOR DELETE USING (auth.uid() = id);
