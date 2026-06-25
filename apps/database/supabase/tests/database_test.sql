BEGIN;

SELECT plan(23);

-- Test 1: Verify content_blog_posts table exists
SELECT has_table(
    'public',
    'content_blog_posts',
    'content_blog_posts table should exist'
  );

-- Test 2: Verify content_blog_posts has key columns
SELECT ok(
    EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'content_blog_posts'
        AND column_name IN (
          'id',
          'slug',
          'title',
          'excerpt',
          'body',
          'author_id',
          'is_published',
          'published_at',
          'created_at',
          'updated_at'
        )
      GROUP BY table_name
      HAVING COUNT(*) = 10
    ),
    'content_blog_posts should expose expected columns'
  );

-- Test 3: Verify content_blog_posts.author_id column type
SELECT col_type_is(
    'public',
    'content_blog_posts',
    'author_id',
    'uuid',
    'content_blog_posts.author_id should be uuid'
  );

-- Test 4: Verify content_blog_posts.is_published column type
SELECT col_type_is(
    'public',
    'content_blog_posts',
    'is_published',
    'boolean',
    'content_blog_posts.is_published should be boolean'
  );

-- Test 5: Verify slug unique index exists
SELECT ok(
    EXISTS (
      SELECT 1
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND tablename = 'content_blog_posts'
        AND indexname = 'content_blog_posts_slug_key'
    ),
    'content_blog_posts_slug_key unique index should exist'
  );

-- Test 6: Verify author_id index exists
SELECT has_index(
    'public',
    'content_blog_posts',
    'content_blog_posts_author_id_idx',
    'content_blog_posts_author_id_idx index should exist'
  );

-- Test 7: Verify published_at composite index exists
SELECT has_index(
    'public',
    'content_blog_posts',
    'content_blog_posts_published_at_idx',
    'content_blog_posts_published_at_idx index should exist'
  );

-- Test 8: Verify updated_at trigger exists on content_blog_posts
SELECT has_trigger(
    'public',
    'content_blog_posts',
    'set_updated_at_content_blog_posts',
    'content_blog_posts should have updated_at trigger'
  );

-- Test 9: Verify RLS is enabled on content_blog_posts
SELECT ok(
    EXISTS (
      SELECT 1
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename = 'content_blog_posts'
        AND rowsecurity = TRUE
    ),
    'RLS should be enabled on content_blog_posts'
  );

-- Test 10: Verify content_blog_posts has four RLS policies
SELECT ok(
    (
      SELECT COUNT(*)
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'content_blog_posts'
    ) = 4,
    'content_blog_posts should have exactly 4 policies'
  );

-- Test 11: Verify content_blog_post_comments table exists
SELECT has_table(
    'public',
    'content_blog_post_comments',
    'content_blog_post_comments table should exist'
  );

-- Test 12: Verify content_blog_post_comments has key columns
SELECT ok(
    EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'content_blog_post_comments'
        AND column_name IN (
          'id',
          'blog_post_id',
          'author_id',
          'body',
          'created_at',
          'updated_at'
        )
      GROUP BY table_name
      HAVING COUNT(*) = 6
    ),
    'content_blog_post_comments should expose expected columns'
  );

-- Test 13: Verify content_blog_post_comments.blog_post_id column type
SELECT col_type_is(
    'public',
    'content_blog_post_comments',
    'blog_post_id',
    'uuid',
    'content_blog_post_comments.blog_post_id should be uuid'
  );

-- Test 14: Verify content_blog_post_comments.author_id column type
SELECT col_type_is(
    'public',
    'content_blog_post_comments',
    'author_id',
    'uuid',
    'content_blog_post_comments.author_id should be uuid'
  );

-- Test 15: Verify blog_post_id foreign key to content_blog_posts
SELECT ok(
    EXISTS (
      SELECT 1
      FROM information_schema.referential_constraints rc
      WHERE rc.constraint_schema = 'public'
        AND rc.constraint_name = 'content_blog_post_comments_blog_post_id_fkey'
        AND rc.unique_constraint_schema = 'public'
        AND rc.unique_constraint_name = 'content_blog_posts_pkey'
    ),
    'content_blog_post_comments.blog_post_id should reference content_blog_posts.id'
  );

-- Test 16: Verify author_id foreign key to auth.users
SELECT ok(
    EXISTS (
      SELECT 1
      FROM information_schema.referential_constraints rc
      WHERE rc.constraint_schema = 'public'
        AND rc.constraint_name = 'content_blog_post_comments_author_id_fkey'
        AND rc.unique_constraint_schema = 'auth'
        AND rc.unique_constraint_name = 'users_pkey'
    ),
    'content_blog_post_comments.author_id should reference auth.users.id'
  );

-- Test 17: Verify comments index on blog_post_id exists
SELECT has_index(
    'public',
    'content_blog_post_comments',
    'content_blog_post_comments_post_id_idx',
    'content_blog_post_comments_post_id_idx index should exist'
  );

-- Test 18: Verify comments index on author_id exists
SELECT has_index(
    'public',
    'content_blog_post_comments',
    'content_blog_post_comments_author_id_idx',
    'content_blog_post_comments_author_id_idx index should exist'
  );

-- Test 19: Verify updated_at trigger exists on content_blog_post_comments
SELECT has_trigger(
    'public',
    'content_blog_post_comments',
    'set_updated_at_content_blog_post_comments',
    'content_blog_post_comments should have updated_at trigger'
  );

-- Test 20: Verify RLS is enabled on content_blog_post_comments
SELECT ok(
    EXISTS (
      SELECT 1
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename = 'content_blog_post_comments'
        AND rowsecurity = TRUE
    ),
    'RLS should be enabled on content_blog_post_comments'
  );

-- Test 21: Verify content_blog_post_comments has four RLS policies
SELECT ok(
    (
      SELECT COUNT(*)
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'content_blog_post_comments'
    ) = 4,
    'content_blog_post_comments should have exactly 4 policies'
  );

-- Test 22: Verify comment policies (select, insert, update, delete) exist
SELECT ok(
    EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'content_blog_post_comments'
        AND policyname = 'content_blog_post_comments_select_policy'
    )
    AND EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'content_blog_post_comments'
        AND policyname = 'content_blog_post_comments_insert_policy'
    )
    AND EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'content_blog_post_comments'
        AND policyname = 'content_blog_post_comments_update_policy'
    )
    AND EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'content_blog_post_comments'
        AND policyname = 'content_blog_post_comments_delete_policy'
    ),
    'All comment policies (select, insert, update, delete) should exist'
  );

-- Test 23: Verify bookmark functionality stays cookie-based (no table)
SELECT ok(
    NOT EXISTS (
      SELECT 1
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename = 'content_blog_post_bookmarks'
    ),
    'Bookmarks should not create a content_blog_post_bookmarks table (cookie-based storage)'
  );

SELECT *
FROM finish();

ROLLBACK;
