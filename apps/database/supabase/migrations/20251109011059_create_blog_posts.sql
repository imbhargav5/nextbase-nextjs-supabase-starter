-- Migration: Create blog posts and comments tables
-- Notice: No mcp tool found. Falling back to migration files for database changes.
-- Created: 2025-11-09 01:10:59 UTC

-- Up migration
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at'
  ) THEN
    CREATE OR REPLACE FUNCTION public.set_updated_at()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $function$
    BEGIN
      NEW.updated_at = timezone('utc', now());
      RETURN NEW;
    END;
    $function$;
  END IF;
END $$;

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
  FOR SELECT
  USING (TRUE);

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

-- Down migration
-- DROP POLICY IF EXISTS content_blog_post_comments_delete_policy ON public.content_blog_post_comments;
-- DROP POLICY IF EXISTS content_blog_post_comments_update_policy ON public.content_blog_post_comments;
-- DROP POLICY IF EXISTS content_blog_post_comments_insert_policy ON public.content_blog_post_comments;
-- DROP POLICY IF EXISTS content_blog_post_comments_select_policy ON public.content_blog_post_comments;
-- DROP TRIGGER IF EXISTS set_updated_at_content_blog_post_comments ON public.content_blog_post_comments;
-- DROP INDEX IF EXISTS content_blog_post_comments_author_id_idx;
-- DROP INDEX IF EXISTS content_blog_post_comments_post_id_idx;
-- DROP TABLE IF EXISTS public.content_blog_post_comments;
--
-- DROP POLICY IF EXISTS content_blog_posts_delete_policy ON public.content_blog_posts;
-- DROP POLICY IF EXISTS content_blog_posts_update_policy ON public.content_blog_posts;
-- DROP POLICY IF EXISTS content_blog_posts_insert_policy ON public.content_blog_posts;
-- DROP POLICY IF EXISTS content_blog_posts_select_policy ON public.content_blog_posts;
-- DROP TRIGGER IF EXISTS set_updated_at_content_blog_posts ON public.content_blog_posts;
-- DROP INDEX IF EXISTS content_blog_posts_published_at_idx;
-- DROP INDEX IF EXISTS content_blog_posts_author_id_idx;
-- DROP INDEX IF EXISTS content_blog_posts_slug_key;
-- DROP TABLE IF EXISTS public.content_blog_posts;
--
-- DROP FUNCTION IF EXISTS public.set_updated_at();

