CREATE TABLE IF NOT EXISTS public.private_items (
  created_at timestamp WITH time zone NOT NULL DEFAULT NOW(),
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description character varying NOT NULL
);

-- 1. Enable RLS
ALTER TABLE public.private_items ENABLE ROW LEVEL SECURITY;

-- 2. Create Policy for SELECT
CREATE POLICY IF NOT EXISTS select_all_policy ON public.private_items FOR
SELECT USING (TRUE);

-- 3. Create Policy for INSERT
CREATE POLICY IF NOT EXISTS insert_auth_policy ON public.private_items FOR
INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 4. Create Policy for UPDATE
CREATE POLICY IF NOT EXISTS update_auth_policy ON public.private_items FOR
UPDATE USING (auth.uid() = id);
