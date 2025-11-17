BEGIN;

SELECT plan(33);

-- Test 1: Verify private_items table has all required columns (combines multiple column checks)
SELECT ok(
    EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'private_items'
        AND column_name IN ('id', 'name', 'description', 'created_at')
      GROUP BY table_name
      HAVING COUNT(*) = 4
    ),
    'private_items should have all required columns: id, name, description, created_at'
  );

-- Test 2: Verify id column is uuid type
SELECT col_type_is(
    'public',
    'private_items',
    'id',
    'uuid',
    'id column should be uuid type'
  );

-- Test 3: Verify created_at is timestamptz type
SELECT col_type_is(
    'public',
    'private_items',
    'created_at',
    'timestamp with time zone',
    'created_at should be timestamptz'
  );

-- Test 4: Verify name has NOT NULL constraint
SELECT col_not_null(
    'public',
    'private_items',
    'name',
    'name column should be NOT NULL'
  );

-- Test 5: Verify idx_private_items_created_at index exists
SELECT has_index(
    'public',
    'private_items',
    'idx_private_items_created_at',
    'idx_private_items_created_at index should exist'
  );

-- Test 6: Verify idx_private_items_id_created_at composite index exists
SELECT has_index(
    'public',
    'private_items',
    'idx_private_items_id_created_at',
    'idx_private_items_id_created_at composite index should exist'
  );

-- Test 7: Verify private_items has primary key on id
SELECT col_is_pk(
    'public',
    'private_items',
    'id',
    'id should be primary key'
  );

-- Test 8: Verify RLS is enabled on private_items
SELECT ok(
    EXISTS (
      SELECT 1
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename = 'private_items'
        AND rowsecurity = TRUE
    ),
    'RLS should be enabled on private_items'
  );

-- Test 9: Verify all 4 policies exist on private_items
SELECT ok(
    (
      SELECT COUNT(*)
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'private_items'
    ) = 4,
    'private_items should have exactly 4 policies'
  );

-- Test 10: Verify specific policies exist (select, insert, update, delete)
SELECT ok(
    EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'private_items'
        AND policyname = 'select_all_policy'
    )
    AND EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'private_items'
        AND policyname = 'insert_auth_policy'
    )
    AND EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'private_items'
        AND policyname = 'update_own_policy'
    )
    AND EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'private_items'
        AND policyname = 'delete_own_policy'
    ),
    'All required policies (select_all_policy, insert_auth_policy, update_own_policy, delete_own_policy) should exist'
  );

-- Test 11: Verify content_blog_posts table exists
SELECT has_table(
    'public',
    'content_blog_posts',
    'content_blog_posts table should exist'
  );

-- Test 12: Verify content_blog_posts has key columns
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

-- Test 13: Verify content_blog_posts.author_id column type
SELECT col_type_is(
    'public',
    'content_blog_posts',
    'author_id',
    'uuid',
    'content_blog_posts.author_id should be uuid'
  );

-- Test 14: Verify content_blog_posts.is_published column type
SELECT col_type_is(
    'public',
    'content_blog_posts',
    'is_published',
    'boolean',
    'content_blog_posts.is_published should be boolean'
  );

-- Test 15: Verify slug unique index exists
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

-- Test 16: Verify author_id index exists
SELECT has_index(
    'public',
    'content_blog_posts',
    'content_blog_posts_author_id_idx',
    'content_blog_posts_author_id_idx index should exist'
  );

-- Test 17: Verify published_at composite index exists
SELECT has_index(
    'public',
    'content_blog_posts',
    'content_blog_posts_published_at_idx',
    'content_blog_posts_published_at_idx index should exist'
  );

-- Test 18: Verify updated_at trigger exists on content_blog_posts
SELECT has_trigger(
    'public',
    'content_blog_posts',
    'set_updated_at_content_blog_posts',
    'content_blog_posts should have updated_at trigger'
  );

-- Test 19: Verify RLS is enabled on content_blog_posts
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

-- Test 20: Verify content_blog_posts has four RLS policies
SELECT ok(
    (
      SELECT COUNT(*)
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'content_blog_posts'
    ) = 4,
    'content_blog_posts should have exactly 4 policies'
  );

-- Test 21: Verify content_blog_post_comments table exists
SELECT has_table(
    'public',
    'content_blog_post_comments',
    'content_blog_post_comments table should exist'
  );

-- Test 22: Verify content_blog_post_comments has key columns
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

-- Test 23: Verify content_blog_post_comments.blog_post_id column type
SELECT col_type_is(
    'public',
    'content_blog_post_comments',
    'blog_post_id',
    'uuid',
    'content_blog_post_comments.blog_post_id should be uuid'
  );

-- Test 24: Verify content_blog_post_comments.author_id column type
SELECT col_type_is(
    'public',
    'content_blog_post_comments',
    'author_id',
    'uuid',
    'content_blog_post_comments.author_id should be uuid'
  );

-- Test 25: Verify blog_post_id foreign key to content_blog_posts
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

-- Test 26: Verify author_id foreign key to auth.users
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

-- Test 27: Verify comments index on blog_post_id exists
SELECT has_index(
    'public',
    'content_blog_post_comments',
    'content_blog_post_comments_post_id_idx',
    'content_blog_post_comments_post_id_idx index should exist'
  );

-- Test 28: Verify comments index on author_id exists
SELECT has_index(
    'public',
    'content_blog_post_comments',
    'content_blog_post_comments_author_id_idx',
    'content_blog_post_comments_author_id_idx index should exist'
  );

-- Test 29: Verify updated_at trigger exists on content_blog_post_comments
SELECT has_trigger(
    'public',
    'content_blog_post_comments',
    'set_updated_at_content_blog_post_comments',
    'content_blog_post_comments should have updated_at trigger'
  );

-- Test 30: Verify RLS is enabled on content_blog_post_comments
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

-- Test 31: Verify content_blog_post_comments has four RLS policies
SELECT ok(
    (
      SELECT COUNT(*)
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'content_blog_post_comments'
    ) = 4,
    'content_blog_post_comments should have exactly 4 policies'
  );

-- Test 32: Verify comment policies (select, insert, update, delete) exist
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

-- Test 33: Verify bookmark functionality stays cookie-based (no table)
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
