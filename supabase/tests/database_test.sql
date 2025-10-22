BEGIN;

-- Load the TAP functions
SELECT plan(10);

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

SELECT *
FROM finish();

ROLLBACK;
