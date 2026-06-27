# pgTap Test Templates

Detailed templates for each test type. Copy and customize for your specific use case.

## Table of Contents

- [RLS Tests](#rls-tests)
- [Trigger Tests](#trigger-tests)
- [Function Tests](#function-tests)
- [Schema Tests](#schema-tests)
- [Cascade Tests](#cascade-tests)

---

## RLS Tests

**Location:** `supabase/tests/database/rls/NN_tablename_rls.test.sql`

```sql
-- =====================================================
-- RLS: [Table Name] Access Control
-- =====================================================
-- Tests Row Level Security policies for [table_name]
--
-- Permission Matrix:
-- - Owner: SELECT, INSERT, UPDATE, DELETE
-- - Admin: SELECT, INSERT, UPDATE, DELETE
-- - Member: SELECT only
-- - Readonly: SELECT only
-- - Outsider: No access

BEGIN;
SELECT plan([number_of_tests]);

-- =====================================================
-- Setup Test Data (postgres role - bypasses RLS)
-- =====================================================
SELECT tests.create_test_user('11111111-1111-1111-1111-111111111111'::uuid, 'owner@test.com');
SELECT tests.create_test_user('22222222-2222-2222-2222-222222222222'::uuid, 'admin@test.com');
SELECT tests.create_test_user('33333333-3333-3333-3333-333333333333'::uuid, 'member@test.com');
SELECT tests.create_test_user('44444444-4444-4444-4444-444444444444'::uuid, 'readonly@test.com');
SELECT tests.create_test_user('55555555-5555-5555-5555-555555555555'::uuid, 'outsider@test.com');

SELECT tests.create_test_workspace('test-ws', 'Test Workspace', '11111111-1111-1111-1111-111111111111'::uuid);

DO $$
DECLARE v_ws_id uuid;
BEGIN
  v_ws_id := tests.get_workspace_id('test-ws');
  PERFORM tests.add_workspace_member(v_ws_id, '22222222-2222-2222-2222-222222222222'::uuid, 'admin');
  PERFORM tests.add_workspace_member(v_ws_id, '33333333-3333-3333-3333-333333333333'::uuid, 'member');
  PERFORM tests.add_workspace_member(v_ws_id, '44444444-4444-4444-4444-444444444444'::uuid, 'readonly');
END $$;

SET LOCAL ROLE authenticated;

-- =====================================================
-- Test 1: Owner can SELECT
-- =====================================================
SELECT tests.set_user_context('11111111-1111-1111-1111-111111111111'::uuid);

DO $$
DECLARE v_ws_id uuid; v_count integer;
BEGIN
  v_ws_id := tests.get_workspace_id('test-ws');
  SELECT COUNT(*)::integer INTO v_count FROM [table_name] WHERE workspace_id = v_ws_id;
  IF v_count = 0 THEN RAISE EXCEPTION 'Owner cannot SELECT'; END IF;
END $$;
SELECT pass('Owner can SELECT from [table_name]');

-- =====================================================
-- Test 2: Owner can INSERT
-- =====================================================
SELECT lives_ok(
  $$INSERT INTO [table_name] (workspace_id, [columns])
    VALUES ((SELECT tests.get_workspace_id('test-ws')), [values])$$,
  'Owner can INSERT into [table_name]'
);

-- =====================================================
-- Test 3: Owner can UPDATE
-- =====================================================
DO $$
DECLARE v_ws_id uuid;
BEGIN
  v_ws_id := tests.get_workspace_id('test-ws');
  UPDATE [table_name] SET [column] = [new_value] WHERE workspace_id = v_ws_id;
  IF NOT EXISTS (
    SELECT 1 FROM [table_name] WHERE workspace_id = v_ws_id AND [column] = [new_value]
  ) THEN RAISE EXCEPTION 'Owner cannot UPDATE'; END IF;
END $$;
SELECT pass('Owner can UPDATE [table_name]');

-- =====================================================
-- Test 4: Owner can DELETE
-- =====================================================
DO $$
DECLARE v_ws_id uuid; v_id uuid;
BEGIN
  v_ws_id := tests.get_workspace_id('test-ws');
  SELECT id INTO v_id FROM [table_name] WHERE workspace_id = v_ws_id LIMIT 1;
  DELETE FROM [table_name] WHERE id = v_id;
  IF EXISTS (SELECT 1 FROM [table_name] WHERE id = v_id) THEN
    RAISE EXCEPTION 'Owner cannot DELETE';
  END IF;
END $$;
SELECT pass('Owner can DELETE from [table_name]');

-- =====================================================
-- Test 5: Member cannot INSERT (throws)
-- =====================================================
SELECT tests.clear_user_context();
SELECT tests.set_user_context('33333333-3333-3333-3333-333333333333'::uuid);

SELECT throws_ok(
  $$INSERT INTO [table_name] (workspace_id, [columns])
    VALUES ((SELECT tests.get_workspace_id('test-ws')), [values])$$,
  'Member cannot INSERT'
);

-- =====================================================
-- Test 6: Member cannot UPDATE (silent block)
-- =====================================================
DO $$
DECLARE v_ws_id uuid; v_original text;
BEGIN
  v_ws_id := tests.get_workspace_id('test-ws');
  SELECT [column] INTO v_original FROM [table_name] WHERE workspace_id = v_ws_id LIMIT 1;
  UPDATE [table_name] SET [column] = 'hacked' WHERE workspace_id = v_ws_id;
  IF NOT EXISTS (
    SELECT 1 FROM [table_name] WHERE workspace_id = v_ws_id AND [column] = v_original
  ) THEN RAISE EXCEPTION 'Member bypassed RLS UPDATE'; END IF;
END $$;
SELECT pass('Member cannot UPDATE (RLS blocks silently)');

-- =====================================================
-- Test 7: Member cannot DELETE (silent block)
-- =====================================================
DO $$
DECLARE v_ws_id uuid; v_count_before integer; v_count_after integer;
BEGIN
  v_ws_id := tests.get_workspace_id('test-ws');
  SELECT COUNT(*)::integer INTO v_count_before FROM [table_name] WHERE workspace_id = v_ws_id;
  DELETE FROM [table_name] WHERE workspace_id = v_ws_id;
  SELECT COUNT(*)::integer INTO v_count_after FROM [table_name] WHERE workspace_id = v_ws_id;
  IF v_count_before != v_count_after THEN RAISE EXCEPTION 'Member bypassed RLS DELETE'; END IF;
END $$;
SELECT pass('Member cannot DELETE (RLS blocks silently)');

-- =====================================================
-- Test 8: Outsider sees 0 rows
-- =====================================================
SELECT tests.clear_user_context();
SELECT tests.set_user_context('55555555-5555-5555-5555-555555555555'::uuid);

DO $$
DECLARE v_ws_id uuid; v_count integer;
BEGIN
  v_ws_id := tests.get_workspace_id('test-ws');
  SELECT COUNT(*)::integer INTO v_count FROM [table_name] WHERE workspace_id = v_ws_id;
  IF v_count != 0 THEN RAISE EXCEPTION 'Outsider can see rows: %', v_count; END IF;
END $$;
SELECT pass('Outsider sees 0 rows');

-- =====================================================
-- Test 9: Cross-workspace isolation
-- =====================================================
RESET ROLE;
SELECT tests.create_test_user('66666666-6666-6666-6666-666666666666'::uuid, 'owner2@test.com');
SELECT tests.create_test_workspace('test-ws-2', 'Test Workspace 2', '66666666-6666-6666-6666-666666666666'::uuid);

SET LOCAL ROLE authenticated;
SELECT tests.set_user_context('66666666-6666-6666-6666-666666666666'::uuid);

DO $$
DECLARE v_ws1_id uuid; v_count integer;
BEGIN
  v_ws1_id := tests.get_workspace_id('test-ws');
  SELECT COUNT(*)::integer INTO v_count FROM [table_name] WHERE workspace_id = v_ws1_id;
  IF v_count != 0 THEN RAISE EXCEPTION 'Cross-workspace leak'; END IF;
END $$;
SELECT pass('Cross-workspace isolation enforced');

-- =====================================================
-- Cleanup
-- =====================================================
RESET ROLE;
SELECT tests.clear_user_context();
SELECT * FROM finish();
ROLLBACK;
```

---

## Trigger Tests

**Location:** `supabase/tests/database/triggers/NN_trigger_name.test.sql`

```sql
-- =====================================================
-- Triggers: [Trigger Name]
-- =====================================================
-- Tests [trigger_name] on [table_name]
-- Fires on: [INSERT/UPDATE/DELETE]
-- Purpose: [What the trigger does]

BEGIN;
SELECT plan([number_of_tests]);

SELECT tests.create_test_user('11111111-1111-1111-1111-111111111111'::uuid, 'user@test.com');

-- =====================================================
-- Test 1: Trigger fires on INSERT
-- =====================================================
DO $$
DECLARE v_new_id uuid;
BEGIN
  INSERT INTO [table_name] ([columns]) VALUES ([values]) RETURNING id INTO v_new_id;
  IF NOT EXISTS (SELECT 1 FROM [related_table] WHERE [fk] = v_new_id) THEN
    RAISE EXCEPTION 'Trigger did not create related record';
  END IF;
END $$;
SELECT pass('Trigger creates [related_table] on INSERT');

-- =====================================================
-- Test 2: Trigger is idempotent
-- =====================================================
DO $$
DECLARE v_id uuid; v_count_before integer; v_count_after integer;
BEGIN
  SELECT id INTO v_id FROM [table_name] LIMIT 1;
  SELECT COUNT(*)::integer INTO v_count_before FROM [related_table] WHERE [fk] = v_id;
  UPDATE [table_name] SET [column] = [value] WHERE id = v_id;
  SELECT COUNT(*)::integer INTO v_count_after FROM [related_table] WHERE [fk] = v_id;
  IF v_count_before != v_count_after THEN
    RAISE EXCEPTION 'Trigger not idempotent: before=%, after=%', v_count_before, v_count_after;
  END IF;
END $$;
SELECT pass('Trigger is idempotent');

-- =====================================================
-- Test 3: Trigger works with RLS enabled
-- =====================================================
SET LOCAL ROLE authenticated;
SELECT tests.set_user_context('11111111-1111-1111-1111-111111111111'::uuid);

DO $$
DECLARE v_new_id uuid;
BEGIN
  INSERT INTO [table_name] ([columns]) VALUES ([values]) RETURNING id INTO v_new_id;
  RESET ROLE;
  IF NOT EXISTS (SELECT 1 FROM [related_table] WHERE [fk] = v_new_id) THEN
    RAISE EXCEPTION 'Trigger failed with RLS enabled';
  END IF;
  SET LOCAL ROLE authenticated;
END $$;
SELECT pass('Trigger works with RLS enabled');

-- =====================================================
-- Test 4: Trigger handles NULL values
-- =====================================================
RESET ROLE;

DO $$
DECLARE v_new_id uuid;
BEGIN
  INSERT INTO [table_name] ([columns], [nullable_col]) VALUES ([values], NULL) RETURNING id INTO v_new_id;
  IF NOT EXISTS (SELECT 1 FROM [related_table] WHERE [fk] = v_new_id) THEN
    RAISE EXCEPTION 'Trigger failed with NULL';
  END IF;
END $$;
SELECT pass('Trigger handles NULL values');

SELECT tests.clear_user_context();
SELECT * FROM finish();
ROLLBACK;
```

---

## Function Tests

**Location:** `supabase/tests/database/logic/NN_function_name.test.sql`

```sql
-- =====================================================
-- Logic: [Function Name]
-- =====================================================
-- Tests [function_name]()
-- Parameters: [list]
-- Returns: [type]

BEGIN;
SELECT plan([number_of_tests]);

SELECT tests.create_test_user('11111111-1111-1111-1111-111111111111'::uuid, 'user@test.com');
SELECT tests.create_test_workspace('test-ws', 'Test Workspace', '11111111-1111-1111-1111-111111111111'::uuid);

-- =====================================================
-- Test 1: Valid input returns correct result
-- =====================================================
DO $$
DECLARE v_ws_id uuid; v_result RECORD;
BEGIN
  v_ws_id := tests.get_workspace_id('test-ws');
  SELECT * INTO v_result FROM [function_name](v_ws_id) LIMIT 1;
  IF v_result.[column] != [expected] THEN
    RAISE EXCEPTION 'Incorrect result: %', v_result.[column];
  END IF;
END $$;
SELECT pass('[function_name]() returns correct result');

-- =====================================================
-- Test 2: NULL input handled
-- =====================================================
DO $$
DECLARE v_result RECORD;
BEGIN
  SELECT * INTO v_result FROM [function_name](NULL) LIMIT 1;
  IF v_result IS NOT NULL THEN
    RAISE EXCEPTION 'Should return NULL for NULL input';
  END IF;
END $$;
SELECT pass('[function_name]() handles NULL input');

-- =====================================================
-- Test 3: Non-existent ID returns empty
-- =====================================================
DO $$
DECLARE v_count integer;
BEGIN
  SELECT COUNT(*)::integer INTO v_count
  FROM [function_name]('00000000-0000-0000-0000-000000000000'::uuid);
  IF v_count != 0 THEN RAISE EXCEPTION 'Should return empty'; END IF;
END $$;
SELECT pass('[function_name]() returns empty for non-existent ID');

-- =====================================================
-- Test 4: Function is idempotent
-- =====================================================
DO $$
DECLARE v_ws_id uuid; v_count1 integer; v_count2 integer;
BEGIN
  v_ws_id := tests.get_workspace_id('test-ws');
  PERFORM [function_name](v_ws_id);
  SELECT COUNT(*)::integer INTO v_count1 FROM [affected_table] WHERE workspace_id = v_ws_id;
  PERFORM [function_name](v_ws_id);
  SELECT COUNT(*)::integer INTO v_count2 FROM [affected_table] WHERE workspace_id = v_ws_id;
  IF v_count1 != v_count2 THEN
    RAISE EXCEPTION 'Not idempotent: %→%', v_count1, v_count2;
  END IF;
END $$;
SELECT pass('[function_name]() is idempotent');

SELECT tests.clear_user_context();
SELECT * FROM finish();
ROLLBACK;
```

---

## Schema Tests

**Location:** `supabase/tests/database/data-integrity/NN_test_name.test.sql`

```sql
-- =====================================================
-- Data Integrity: [Test Focus]
-- =====================================================
-- Validates constraints, indexes, defaults

BEGIN;
SELECT plan([number_of_tests]);

-- =====================================================
-- Test 1: Index exists
-- =====================================================
SELECT has_index('public', '[table]', '[index_name]', 'Index exists');

-- =====================================================
-- Test 2: NOT NULL enforced
-- =====================================================
SELECT throws_ok(
  $$INSERT INTO [table] ([columns], [required_col]) VALUES ([values], NULL)$$,
  '23502', NULL, 'NOT NULL enforced on [required_col]'
);

-- =====================================================
-- Test 3: UNIQUE enforced
-- =====================================================
SELECT tests.create_test_user('11111111-1111-1111-1111-111111111111'::uuid, 'user@test.com');
SELECT tests.create_test_workspace('test-ws', 'Test', '11111111-1111-1111-1111-111111111111'::uuid);

DO $$
DECLARE v_ws_id uuid;
BEGIN
  v_ws_id := tests.get_workspace_id('test-ws');
  INSERT INTO [table] (workspace_id, [unique_col]) VALUES (v_ws_id, 'val');
  BEGIN
    INSERT INTO [table] (workspace_id, [unique_col]) VALUES (v_ws_id, 'val');
    RAISE EXCEPTION 'UNIQUE not enforced';
  EXCEPTION WHEN unique_violation THEN NULL;
  END;
END $$;
SELECT pass('UNIQUE constraint enforced');

-- =====================================================
-- Test 4: Foreign key enforced
-- =====================================================
SELECT throws_ok(
  $$INSERT INTO [table] (workspace_id, [cols])
    VALUES ('00000000-0000-0000-0000-000000000000'::uuid, [vals])$$,
  '23503', NULL, 'Foreign key enforced'
);

-- =====================================================
-- Test 5: Default value set
-- =====================================================
DO $$
DECLARE v_ws_id uuid; v_id uuid; v_default [type];
BEGIN
  v_ws_id := tests.get_workspace_id('test-ws');
  INSERT INTO [table] (workspace_id, [required_cols]) VALUES (v_ws_id, [vals]) RETURNING id INTO v_id;
  SELECT [col_with_default] INTO v_default FROM [table] WHERE id = v_id;
  IF v_default != [expected] THEN RAISE EXCEPTION 'Default not set: %', v_default; END IF;
END $$;
SELECT pass('Default value set correctly');

SELECT tests.clear_user_context();
SELECT * FROM finish();
ROLLBACK;
```

---

## Cascade Tests

**Location:** `supabase/tests/database/cascade/NN_cascading_deletes.test.sql`

```sql
-- =====================================================
-- Cascade: [Parent Table] Deletion Effects
-- =====================================================
-- Tests cascading delete behavior

BEGIN;
SELECT plan([number_of_tests]);

SELECT tests.create_test_user('11111111-1111-1111-1111-111111111111'::uuid, 'user@test.com');
SELECT tests.create_test_workspace('cascade-test-ws', 'Cascade Test', '11111111-1111-1111-1111-111111111111'::uuid);

DO $$
DECLARE v_ws_id uuid;
BEGIN
  v_ws_id := tests.get_workspace_id('cascade-test-ws');
  INSERT INTO [child_table_1] (workspace_id, [cols]) VALUES (v_ws_id, [vals]);
  INSERT INTO [child_table_2] (workspace_id, [cols]) VALUES (v_ws_id, [vals]);
END $$;

-- =====================================================
-- Test 1: Child records exist before deletion
-- =====================================================
DO $$
DECLARE v_ws_id uuid; v_count integer;
BEGIN
  v_ws_id := tests.get_workspace_id('cascade-test-ws');
  SELECT COUNT(*)::integer INTO v_count FROM [child_table_1] WHERE workspace_id = v_ws_id;
  IF v_count = 0 THEN RAISE EXCEPTION 'Setup failed'; END IF;
END $$;
SELECT pass('Child records exist before cascade');

-- =====================================================
-- Test 2: CASCADE deletes child_table_1
-- =====================================================
DO $$
DECLARE v_ws_id uuid; v_count integer;
BEGIN
  v_ws_id := tests.get_workspace_id('cascade-test-ws');
  DELETE FROM [parent_table] WHERE id = v_ws_id;
  SELECT COUNT(*)::integer INTO v_count FROM [child_table_1] WHERE workspace_id = v_ws_id;
  IF v_count != 0 THEN RAISE EXCEPTION 'CASCADE failed: % records remain', v_count; END IF;
END $$;
SELECT pass('Deleting parent cascades to child_table_1');

-- =====================================================
-- Test 3: CASCADE deletes child_table_2
-- =====================================================
DO $$
DECLARE v_ws_id uuid; v_count integer;
BEGIN
  v_ws_id := tests.get_workspace_id('cascade-test-ws');
  SELECT COUNT(*)::integer INTO v_count FROM [child_table_2] WHERE workspace_id = v_ws_id;
  IF v_count != 0 THEN RAISE EXCEPTION 'CASCADE failed: % records remain', v_count; END IF;
END $$;
SELECT pass('Deleting parent cascades to child_table_2');

-- =====================================================
-- Test 4: No orphaned records
-- =====================================================
DO $$
DECLARE v_orphans integer;
BEGIN
  SELECT COUNT(*)::integer INTO v_orphans
  FROM [child_table_1] ct
  LEFT JOIN [parent_table] pt ON ct.workspace_id = pt.id
  WHERE pt.id IS NULL;
  IF v_orphans > 0 THEN RAISE EXCEPTION 'Orphaned records: %', v_orphans; END IF;
END $$;
SELECT pass('No orphaned records');

SELECT tests.clear_user_context();
SELECT * FROM finish();
ROLLBACK;
```
