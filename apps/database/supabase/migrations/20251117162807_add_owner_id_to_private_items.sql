-- Migration: Add owner_id column to private_items and update RLS policies
-- Created: 2025-11-17 16:28:07
-- Up migration
-- 1. Add owner_id column (nullable initially to handle existing rows)
ALTER TABLE public.private_items
ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users (id) ON DELETE CASCADE;

-- 2. Create index on owner_id for performance
CREATE INDEX IF NOT EXISTS idx_private_items_owner_id ON public.private_items (owner_id);

-- 3. Create function to automatically set owner_id on INSERT if not provided
CREATE OR REPLACE FUNCTION public.set_private_item_owner_id() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN -- Only set owner_id if it's NULL and user is authenticated
  IF NEW.owner_id IS NULL
  AND auth.uid() IS NOT NULL THEN NEW.owner_id := auth.uid();
END IF;
RETURN NEW;
END;
$$;

-- 4. Create trigger to automatically set owner_id on INSERT
DROP TRIGGER IF EXISTS set_owner_id_on_insert ON public.private_items;
CREATE TRIGGER set_owner_id_on_insert BEFORE
INSERT ON public.private_items FOR EACH ROW EXECUTE FUNCTION public.set_private_item_owner_id();

-- 5. Drop existing policies to recreate them with correct logic
DROP POLICY IF EXISTS select_all_policy ON public.private_items;
DROP POLICY IF EXISTS insert_auth_policy ON public.private_items;
DROP POLICY IF EXISTS update_own_policy ON public.private_items;
DROP POLICY IF EXISTS delete_own_policy ON public.private_items;

-- 6. Recreate policies with owner_id-based checks
-- SELECT: Everyone can read (keep existing behavior)
CREATE POLICY select_all_policy ON public.private_items FOR
SELECT USING (TRUE);

-- INSERT: Authenticated users can insert, owner_id will be set automatically
CREATE POLICY insert_auth_policy ON public.private_items FOR
INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATE: Users can only update their own items
CREATE POLICY update_own_policy ON public.private_items FOR
UPDATE USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- DELETE: Users can only delete their own items
CREATE POLICY delete_own_policy ON public.private_items FOR DELETE USING (auth.uid() = owner_id);

-- Down migration (commented out)
-- DROP POLICY IF EXISTS delete_own_policy ON public.private_items;
-- DROP POLICY IF EXISTS update_own_policy ON public.private_items;
-- DROP POLICY IF EXISTS insert_auth_policy ON public.private_items;
-- DROP POLICY IF EXISTS select_all_policy ON public.private_items;
-- DROP TRIGGER IF EXISTS set_owner_id_on_insert ON public.private_items;
-- DROP FUNCTION IF EXISTS public.set_private_item_owner_id();
-- DROP INDEX IF EXISTS idx_private_items_owner_id;
-- ALTER TABLE public.private_items DROP COLUMN IF EXISTS owner_id;