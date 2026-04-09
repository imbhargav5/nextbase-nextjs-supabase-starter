---
name: pgtap-test-generator
description: Generate comprehensive pgTap tests for Supabase PostgreSQL databases. Use when asked to write database tests for RLS policies, triggers, functions, data integrity, cascading deletes, or any pgTap/Supabase testing. Triggers include "write pgTap tests", "test RLS policies", "create trigger tests", "test database function", "write cascade tests", "test data integrity".
---

# pgTap Test Generation

Generate production-quality pgTap tests for Supabase PostgreSQL databases.

## Core Principles

1. **Transaction isolation**: All tests use BEGIN/ROLLBACK for automatic cleanup
2. **Helper reuse**: Use `tests` schema helper functions (not manual SQL)
3. **Comprehensive coverage**: Test happy path, edge cases, errors, and RLS
4. **Accurate planning**: `plan(N)` must match actual test count

## Test File Structure

```sql
BEGIN;
SELECT plan(N);  -- Exact test count

-- Setup (postgres role - bypasses RLS)
SELECT tests.create_test_user('11111111-1111-1111-1111-111111111111'::uuid, 'owner@test.com');
SELECT tests.create_test_workspace('test-ws', 'Test Workspace', '11111111-1111-1111-1111-111111111111'::uuid);

-- Switch to authenticated role for RLS tests
SET LOCAL ROLE authenticated;
SELECT tests.set_user_context('11111111-1111-1111-1111-111111111111'::uuid);

-- Tests...

-- Cleanup
RESET ROLE;
SELECT tests.clear_user_context();
SELECT * FROM finish();
ROLLBACK;
```

## Test Types & References

| Type | Location Pattern | Reference |
|------|------------------|-----------|
| RLS | `supabase/tests/database/rls/NN_*.test.sql` | [templates.md#rls](references/templates.md#rls-tests) |
| Triggers | `supabase/tests/database/triggers/NN_*.test.sql` | [templates.md#triggers](references/templates.md#trigger-tests) |
| Functions | `supabase/tests/database/logic/NN_*.test.sql` | [templates.md#functions](references/templates.md#function-tests) |
| Schema | `supabase/tests/database/data-integrity/NN_*.test.sql` | [templates.md#schema](references/templates.md#schema-tests) |
| Cascade | `supabase/tests/database/cascade/NN_*.test.sql` | [templates.md#cascade](references/templates.md#cascade-tests) |

## Critical RLS Behavior

**MUST UNDERSTAND:**
- **INSERT blocked** → Throws exception → Use `throws_ok()`
- **UPDATE blocked** → Silently affects 0 rows → Verify data unchanged
- **DELETE blocked** → Silently affects 0 rows → Verify data still exists

## Naming Conventions

**Test Users (UUIDs):**
- `'11111111-...'` - Owner
- `'22222222-...'` - Admin
- `'33333333-...'` - Member
- `'44444444-...'` - Readonly
- `'55555555-...'` - Outsider
- `'66666666-...'` - Second workspace owner

**Emails:** `{role}@test.com` (owner@test.com, admin@test.com)

**Workspaces:** `test-ws`, `test-ws-2`, `cascade-test-ws`

## Common Patterns

### DO Block with Assertion
```sql
DO $$
DECLARE v_count integer;
BEGIN
  SELECT COUNT(*)::integer INTO v_count FROM table WHERE ...;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'Expected rows, found none';
  END IF;
END $$;
SELECT pass('Description');
```

### Silent RLS Block Verification
```sql
DO $$
DECLARE v_original text; v_after text;
BEGIN
  SELECT col INTO v_original FROM tbl LIMIT 1;
  UPDATE tbl SET col = 'hacked';  -- Blocked silently
  SELECT col INTO v_after FROM tbl LIMIT 1;
  IF v_original != v_after THEN
    RAISE EXCEPTION 'RLS bypassed';
  END IF;
END $$;
SELECT pass('UPDATE blocked by RLS');
```

### Role Switching
```sql
SET LOCAL ROLE authenticated;
SELECT tests.set_user_context('user-uuid'::uuid);
-- ... tests ...
RESET ROLE;
SELECT tests.clear_user_context();
```

## pgTap Assertions

```sql
SELECT plan(N);                              -- Declare test count
SELECT pass('message');                      -- Pass with message
SELECT ok(condition, 'message');             -- Assert true
SELECT is(actual, expected, 'message');      -- Assert equality
SELECT lives_ok($$SQL$$, 'message');         -- No exception
SELECT throws_ok($$SQL$$, 'SQLSTATE', NULL, 'message');  -- Specific error
SELECT has_index('public', 'table', 'idx', 'description');
SELECT * FROM finish();
```

**Error Codes:** `23502` (not_null), `23503` (fk), `23505` (unique), `23514` (check)

## Helper Functions

See [references/helpers.md](references/helpers.md) for complete list. Key functions:

```sql
-- Users
tests.create_test_user(user_id uuid, email text)
tests.set_user_context(user_id uuid)
tests.clear_user_context()

-- Workspaces
tests.create_test_workspace(slug text, name text, owner_id uuid)
tests.get_workspace_id(slug text) → uuid
tests.add_workspace_member(ws_id uuid, user_id uuid, role text)

-- Tiers & Benefits
tests.set_workspace_tier(ws_id uuid, tier_identifier text)
tests.workspace_has_benefit(ws_id uuid, benefit_identifier text) → boolean
```

## Workflow

1. **Ask clarifying questions:**
   - What type of test? (RLS/Trigger/Function/Schema/Cascade)
   - What database object?
   - What specific behavior to test?

2. **Read appropriate template** from [references/templates.md](references/templates.md)

3. **Use helper functions** from [references/helpers.md](references/helpers.md)

4. **Test edge cases:**
   - NULL values
   - Non-existent IDs
   - Cross-workspace isolation (RLS)
   - Constraint violations
   - Idempotency

5. **Save to:** `supabase/tests/database/[category]/NN_test_name.test.sql`

## RLS Testing Checklist

- ✅ Owner permissions (SELECT, INSERT, UPDATE, DELETE)
- ✅ Admin permissions
- ✅ Member permissions (usually SELECT only)
- ✅ Readonly permissions
- ✅ Outsider sees 0 rows
- ✅ Cross-workspace isolation
- ✅ INSERT throws, UPDATE/DELETE silent
