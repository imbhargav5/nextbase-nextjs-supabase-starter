BEGIN;

SELECT plan(42);

-- Test 1: Verify private_items table has all required columns (combines multiple column checks)
SELECT ok(
    EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'private_items'
        AND column_name IN (
          'id',
          'name',
          'description',
          'created_at',
          'owner_id'
        )
      GROUP BY table_name
      HAVING COUNT(*) = 5
    ),
    'private_items should have all required columns: id, name, description, created_at, owner_id'
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

-- Test 11: Verify owner_id column exists and is uuid type
SELECT col_type_is(
    'public',
    'private_items',
    'owner_id',
    'uuid',
    'owner_id column should be uuid type'
  );

-- Test 12: Verify owner_id foreign key to auth.users exists
SELECT ok(
    EXISTS (
      SELECT 1
      FROM information_schema.referential_constraints rc
        JOIN information_schema.key_column_usage kcu ON rc.constraint_name = kcu.constraint_name
      WHERE kcu.table_schema = 'public'
        AND kcu.table_name = 'private_items'
        AND kcu.column_name = 'owner_id'
        AND rc.unique_constraint_schema = 'auth'
    ),
    'owner_id should have foreign key to auth.users'
  );

-- Test 13: Verify idx_private_items_owner_id index exists
SELECT has_index(
    'public',
    'private_items',
    'idx_private_items_owner_id',
    'idx_private_items_owner_id index should exist'
  );

-- Test 14: Verify trigger set_owner_id_on_insert exists
SELECT has_trigger(
    'public',
    'private_items',
    'set_owner_id_on_insert',
    'private_items should have set_owner_id_on_insert trigger'
  );

-- Test 15: Verify trigger function set_private_item_owner_id exists
SELECT ok(
    EXISTS (
      SELECT 1
      FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public'
        AND p.proname = 'set_private_item_owner_id'
    ),
    'set_private_item_owner_id function should exist'
  );

-- Test 16: Verify update_own_policy uses owner_id (not id)
SELECT ok(
    EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'private_items'
        AND policyname = 'update_own_policy'
        AND (
          qual::text LIKE '%owner_id%'
          OR with_check::text LIKE '%owner_id%'
        )
    ),
    'update_own_policy should check owner_id, not id'
  );

-- Test 17: Verify delete_own_policy uses owner_id (not id)
SELECT ok(
    EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'private_items'
        AND policyname = 'delete_own_policy'
        AND qual::text LIKE '%owner_id%'
    ),
    'delete_own_policy should check owner_id, not id'
  );

-- Test 18: Verify content_blog_posts table exists
SELECT has_table(
    'public',
    'content_blog_posts',
    'content_blog_posts table should exist'
  );

-- Test 19: Verify content_blog_posts has key columns
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

-- Test 20: Verify content_blog_posts.author_id column type
SELECT col_type_is(
    'public',
    'content_blog_posts',
    'author_id',
    'uuid',
    'content_blog_posts.author_id should be uuid'
  );

-- Test 21: Verify content_blog_posts.is_published column type
SELECT col_type_is(
    'public',
    'content_blog_posts',
    'is_published',
    'boolean',
    'content_blog_posts.is_published should be boolean'
  );

-- Test 22: Verify slug unique index exists
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

-- Test 23: Verify author_id index exists
SELECT has_index(
    'public',
    'content_blog_posts',
    'content_blog_posts_author_id_idx',
    'content_blog_posts_author_id_idx index should exist'
  );

-- Test 24: Verify published_at composite index exists
SELECT has_index(
    'public',
    'content_blog_posts',
    'content_blog_posts_published_at_idx',
    'content_blog_posts_published_at_idx index should exist'
  );

-- Test 25: Verify updated_at trigger exists on content_blog_posts
SELECT has_trigger(
    'public',
    'content_blog_posts',
    'set_updated_at_content_blog_posts',
    'content_blog_posts should have updated_at trigger'
  );

-- Test 26: Verify RLS is enabled on content_blog_posts
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

-- Test 27: Verify content_blog_posts has four RLS policies
SELECT ok(
    (
      SELECT COUNT(*)
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'content_blog_posts'
    ) = 4,
    'content_blog_posts should have exactly 4 policies'
  );

-- Test 28: Verify content_blog_post_comments table exists
SELECT has_table(
    'public',
    'content_blog_post_comments',
    'content_blog_post_comments table should exist'
  );

-- Test 29: Verify content_blog_post_comments has key columns
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

-- Test 30: Verify content_blog_post_comments.blog_post_id column type
SELECT col_type_is(
    'public',
    'content_blog_post_comments',
    'blog_post_id',
    'uuid',
    'content_blog_post_comments.blog_post_id should be uuid'
  );

-- Test 31: Verify content_blog_post_comments.author_id column type
SELECT col_type_is(
    'public',
    'content_blog_post_comments',
    'author_id',
    'uuid',
    'content_blog_post_comments.author_id should be uuid'
  );

-- Test 32: Verify blog_post_id foreign key to content_blog_posts
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

-- Test 33: Verify author_id foreign key to auth.users
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

-- Test 34: Verify comments index on blog_post_id exists
SELECT has_index(
    'public',
    'content_blog_post_comments',
    'content_blog_post_comments_post_id_idx',
    'content_blog_post_comments_post_id_idx index should exist'
  );

-- Test 35: Verify comments index on author_id exists
SELECT has_index(
    'public',
    'content_blog_post_comments',
    'content_blog_post_comments_author_id_idx',
    'content_blog_post_comments_author_id_idx index should exist'
  );

-- Test 36: Verify updated_at trigger exists on content_blog_post_comments
SELECT has_trigger(
    'public',
    'content_blog_post_comments',
    'set_updated_at_content_blog_post_comments',
    'content_blog_post_comments should have updated_at trigger'
  );

-- Test 37: Verify RLS is enabled on content_blog_post_comments
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

-- Test 38: Verify content_blog_post_comments has four RLS policies
SELECT ok(
    (
      SELECT COUNT(*)
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'content_blog_post_comments'
    ) = 4,
    'content_blog_post_comments should have exactly 4 policies'
  );

-- Test 39: Verify comment policies (select, insert, update, delete) exist
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

-- Test 40: Verify bookmark functionality stays cookie-based (no table)
SELECT ok(
    NOT EXISTS (
      SELECT 1
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename = 'content_blog_post_bookmarks'
    ),
    'Bookmarks should not create a content_blog_post_bookmarks table (cookie-based storage)'
  );

-- Test 41: Verify owner_id column is nullable (to handle existing rows)
SELECT ok(
    EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'private_items'
        AND column_name = 'owner_id'
        AND is_nullable = 'YES'
    ),
    'owner_id column should be nullable to handle existing rows'
  );

-- Test 42: Verify insert_auth_policy allows authenticated users to insert
SELECT ok(
    EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'private_items'
        AND policyname = 'insert_auth_policy'
        AND cmd = 'INSERT'
        AND (
          qual::text LIKE '%auth.uid()%'
          OR with_check::text LIKE '%auth.uid()%'
        )
    ),
    'insert_auth_policy should allow authenticated users to insert'
  );

SELECT *
FROM finish();

ROLLBACK;