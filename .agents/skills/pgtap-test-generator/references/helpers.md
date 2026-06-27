# pgTap Helper Functions Reference

The `tests` schema contains 71+ helper functions. Use these instead of manual SQL.

## User Management

```sql
-- Create a test user with UUID and email
tests.create_test_user(user_id uuid, email text) → void

-- Delete a specific test user
tests.delete_test_user(user_id uuid) → void

-- Cleanup users matching email pattern
tests.cleanup_test_users(email_pattern text) → void

-- Generate a random test email
tests.generate_test_email() → text
```

## Workspace Management

```sql
-- Create workspace with slug, name, and owner
tests.create_test_workspace(slug text, name text, owner_id uuid) → void

-- Delete workspace by slug
tests.delete_test_workspace(slug text) → void

-- Cleanup workspaces matching slug pattern
tests.cleanup_test_workspaces(slug_pattern text) → void

-- Get workspace UUID from slug
tests.get_workspace_id(slug text) → uuid

-- Get user's personal workspace
tests.get_user_personal_workspace(user_id uuid) → uuid

-- Count workspace members
tests.workspace_member_count(workspace_id uuid) → integer
```

## Workspace Members

```sql
-- Add member with role ('owner', 'admin', 'member', 'readonly')
tests.add_workspace_member(workspace_id uuid, user_id uuid, role text) → void

-- Get member's role in workspace
tests.get_workspace_member_role(workspace_id uuid, user_id uuid) → text
```

## Tier Management

```sql
-- Get tier UUID by identifier
tests.get_tier_by_identifier(identifier text) → uuid
tests.get_tier_by_identifier_workspace(identifier text) → uuid

-- Set workspace tier
tests.set_workspace_tier(workspace_id uuid, tier_identifier text) → void

-- Get tier identifier for workspace/user
tests.get_workspace_tier_identifier(workspace_id uuid) → text
tests.get_user_tier_identifier(user_id uuid) → text

-- Get user's tier level
tests.get_user_tier_level(user_id uuid) → integer

-- Count benefits in tier
tests.get_tier_benefit_count(tier_identifier text) → integer
```

## Benefit Management

```sql
-- Get benefit UUID by identifier
tests.get_benefit_by_identifier(identifier text) → uuid
tests.get_benefit_by_identifier_workspace(identifier text) → uuid

-- Grant benefit to workspace
tests.grant_workspace_benefit(workspace_id uuid, benefit_identifier text) → void

-- Check if workspace has benefit
tests.workspace_has_benefit(workspace_id uuid, benefit_identifier text) → boolean

-- Claim benefit
tests.claim_workspace_benefit(workspace_id uuid, benefit_identifier text, details jsonb) → void

-- Check if benefit was claimed
tests.workspace_claimed_benefit(workspace_id uuid, benefit_identifier text) → boolean

-- Count benefits
tests.count_workspace_benefits(workspace_id uuid) → integer
tests.count_user_benefits(user_id uuid) → integer

-- Check if user has benefit
tests.user_has_benefit(user_id uuid, benefit_identifier text) → boolean
```

## Payment & Purchase

```sql
-- Create workspace payment record
tests.create_workspace_payment(
  workspace_id uuid,
  product_identifier text,
  amount integer,
  status text
) → uuid

-- Simulate a purchase
tests.simulate_purchase(workspace_id uuid, product_identifier text) → void

-- Generate random payment ID
tests.generate_test_payment_id() → text

-- Get product type UUID
tests.get_product_type_by_identifier(identifier text) → uuid
```

## RLS Testing

```sql
-- Set auth context (sets request.jwt.claims)
tests.set_user_context(user_id uuid) → void

-- Clear auth context
tests.clear_user_context() → void

-- Check if RLS blocks DELETE (returns true if blocked)
tests.rls_blocks_delete(table_name text, where_clause text) → boolean
```

## Assertions

```sql
-- Assert user has expected benefit count
tests.assert_user_benefit_count(user_id uuid, expected_count integer, message text) → void
```

## Cleanup

```sql
-- Remove all test data
tests.cleanup_all_test_data() → void
```

## Usage Examples

### Creating Test Setup

```sql
-- Create users with sequential UUIDs
SELECT tests.create_test_user('11111111-1111-1111-1111-111111111111'::uuid, 'owner@test.com');
SELECT tests.create_test_user('22222222-2222-2222-2222-222222222222'::uuid, 'admin@test.com');

-- Create workspace owned by first user
SELECT tests.create_test_workspace('test-ws', 'Test Workspace', '11111111-1111-1111-1111-111111111111'::uuid);

-- Add second user as admin
DO $$
DECLARE v_ws_id uuid;
BEGIN
  v_ws_id := tests.get_workspace_id('test-ws');
  PERFORM tests.add_workspace_member(v_ws_id, '22222222-2222-2222-2222-222222222222'::uuid, 'admin');
END $$;
```

### Testing with RLS

```sql
-- Switch to authenticated role (RLS enforced)
SET LOCAL ROLE authenticated;

-- Set user context (simulates JWT)
SELECT tests.set_user_context('11111111-1111-1111-1111-111111111111'::uuid);

-- ... run tests as this user ...

-- Switch user
SELECT tests.clear_user_context();
SELECT tests.set_user_context('22222222-2222-2222-2222-222222222222'::uuid);

-- ... run tests as different user ...

-- Cleanup
RESET ROLE;
SELECT tests.clear_user_context();
```

### Testing Tiers and Benefits

```sql
-- Setup workspace with tier
DO $$
DECLARE v_ws_id uuid;
BEGIN
  v_ws_id := tests.get_workspace_id('test-ws');
  PERFORM tests.set_workspace_tier(v_ws_id, 'pro');
END $$;

-- Verify tier benefits
DO $$
DECLARE v_ws_id uuid;
BEGIN
  v_ws_id := tests.get_workspace_id('test-ws');

  IF NOT tests.workspace_has_benefit(v_ws_id, 'advanced-analytics') THEN
    RAISE EXCEPTION 'Pro tier should include advanced-analytics';
  END IF;
END $$;
SELECT pass('Pro tier includes advanced-analytics benefit');
```
