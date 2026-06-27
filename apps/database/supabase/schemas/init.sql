-- =============================================================================
-- Extensions
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

-- =============================================================================
-- Functions
-- =============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_private_item_owner_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.owner_id IS NULL AND auth.uid() IS NOT NULL THEN
    NEW.owner_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

-- =============================================================================
-- Tables
-- =============================================================================

-- private_items: User-owned items with RLS
CREATE TABLE IF NOT EXISTS public.private_items (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name character varying NOT NULL,
  description character varying NOT NULL,
  owner_id uuid REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT private_items_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_private_items_created_at
  ON public.private_items (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_private_items_id_created_at
  ON public.private_items (id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_private_items_owner_id
  ON public.private_items (owner_id);

CREATE TRIGGER set_owner_id_on_insert
  BEFORE INSERT ON public.private_items
  FOR EACH ROW
  EXECUTE FUNCTION public.set_private_item_owner_id();

ALTER TABLE public.private_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_all_policy ON public.private_items
  FOR SELECT USING (TRUE);

CREATE POLICY insert_auth_policy ON public.private_items
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY update_own_policy ON public.private_items
  FOR UPDATE USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY delete_own_policy ON public.private_items
  FOR DELETE USING (auth.uid() = owner_id);

-- =============================================================================
-- Blog: content_blog_posts
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.content_blog_posts (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  slug text NOT NULL,
  title text NOT NULL,
  excerpt text,
  body text NOT NULL,
  author_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  is_published boolean NOT NULL DEFAULT true,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE UNIQUE INDEX IF NOT EXISTS content_blog_posts_slug_key
  ON public.content_blog_posts (slug);

CREATE INDEX IF NOT EXISTS content_blog_posts_author_id_idx
  ON public.content_blog_posts (author_id);

CREATE INDEX IF NOT EXISTS content_blog_posts_published_at_idx
  ON public.content_blog_posts (is_published, published_at DESC);

CREATE TRIGGER set_updated_at_content_blog_posts
  BEFORE UPDATE ON public.content_blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.content_blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY content_blog_posts_select_policy
  ON public.content_blog_posts
  FOR SELECT
  USING (is_published OR auth.uid() = author_id OR auth.role() = 'service_role');

CREATE POLICY content_blog_posts_insert_policy
  ON public.content_blog_posts
  FOR INSERT
  WITH CHECK (auth.uid() = author_id OR auth.role() = 'service_role');

CREATE POLICY content_blog_posts_update_policy
  ON public.content_blog_posts
  FOR UPDATE
  USING (auth.uid() = author_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = author_id OR auth.role() = 'service_role');

CREATE POLICY content_blog_posts_delete_policy
  ON public.content_blog_posts
  FOR DELETE
  USING (auth.uid() = author_id OR auth.role() = 'service_role');

-- =============================================================================
-- Blog: content_blog_post_comments
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.content_blog_post_comments (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  blog_post_id uuid NOT NULL REFERENCES public.content_blog_posts (id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS content_blog_post_comments_post_id_idx
  ON public.content_blog_post_comments (blog_post_id, created_at DESC);

CREATE INDEX IF NOT EXISTS content_blog_post_comments_author_id_idx
  ON public.content_blog_post_comments (author_id);

CREATE TRIGGER set_updated_at_content_blog_post_comments
  BEFORE UPDATE ON public.content_blog_post_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.content_blog_post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY content_blog_post_comments_select_policy
  ON public.content_blog_post_comments
  FOR SELECT USING (TRUE);

CREATE POLICY content_blog_post_comments_insert_policy
  ON public.content_blog_post_comments
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY content_blog_post_comments_update_policy
  ON public.content_blog_post_comments
  FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY content_blog_post_comments_delete_policy
  ON public.content_blog_post_comments
  FOR DELETE
  USING (auth.uid() = author_id);
