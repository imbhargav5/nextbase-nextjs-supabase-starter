# Nextbase Seed Data Generator

Generate seed data for Nextbase Supabase databases following established patterns and conventions.

## When to Use This Skill

- Creating or updating `supabase/seed.sql` for development
- Adding new tier types or product types to the system
- Setting up test users with different purchase histories
- Configuring multi-provider billing catalogs (Stripe, LemonSqueezy, Polar)
- Creating app admin users for testing

## Core Principles

1. **Section Organization**: Use clear separators for logical grouping
   ```sql
   -- =====================================================
   -- SECTION NAME
   -- =====================================================
   ```

2. **Naming Conventions**:
   - Use `snake_case` for database objects (tables, columns)
   - Use `SCREAMING_SNAKE_CASE` for identifiers and enums (e.g., `PERSONAL_ESSENTIAL`, `GITHUB_REPO_NEXTBASE_PRO`)

3. **Relational Data**: Use JOINs to resolve IDs, never hardcode UUIDs for references

4. **Metadata**: Use JSONB for flexible, extensible metadata fields

5. **Idempotency**: Use `ON CONFLICT ... DO NOTHING` or `DO UPDATE` for repeatable inserts

6. **Trigger Awareness**: Understand that user creation triggers automatic profile and workspace creation

## Required Insertion Order

Foreign key constraints require this specific order:

1. `nextbase_tier_types` - Tier definitions
2. `nextbase_product_types` - Product definitions
3. `nextbase_product_types_to_tier_map` - Product-to-tier mappings
4. `billing_products_catalogue` - Multi-provider price catalog
5. `billing_price_to_nextbase_product_type_map` - Price-to-product mappings
6. `available_benefits` - Benefit definitions
7. `available_benefits_to_tiers` - Tier-benefit junction
8. `available_benefits_to_standalone_products` - Standalone product benefits
9. `auth.users` - Test users (triggers create profiles/workspaces)
10. `UPDATE user_profiles` - Set full names after trigger creation
11. `SELECT make_user_app_admin()` - Create admin user(s)
12. `billing_payments` - Payment records
13. `billing_ls_customers` / `billing_polar_customers` - Provider customers
14. `billing_assets_access` - Asset access records
15. `nextbase_workspace_tiers` - Workspace tier assignments

## Database Schema Reference

See `references/schema.md` for complete table definitions.

### Key Tables Overview

| Table | Purpose |
|-------|---------|
| `nextbase_tier_types` | Tier definitions (PERSONAL_ESSENTIAL, PRO, ULTIMATE, BUSINESS_*) |
| `nextbase_product_types` | Products (base, upgrades, standalone like Framer templates) |
| `billing_products_catalogue` | Central catalog of prices across Stripe/LS/Polar |
| `available_benefits` | Benefits (GitHub repos, Framer templates, digital assets) |
| `auth.users` | Supabase auth users |
| `workspaces` | Workspaces (auto-created with slug `personal-{user_id}`) |
| `billing_payments` | Payment records linking workspace to catalog item |

### Key Functions

```sql
-- Make a user an app admin
SELECT make_user_app_admin('00000000-0000-0000-0000-000000000001');
```

### Important Triggers

- **User creation** → automatically creates `user_profiles` row and `workspaces` row (slug: `personal-{user_id}`)
- **Payment insertion** → triggers `sync_workspace_tier_and_benefits_on_payment()` which updates tier and grants benefits

## SQL Patterns

See `references/patterns.md` for detailed examples.

### Pattern Summary

| Pattern | Use Case |
|---------|----------|
| Simple INSERT | Static lookup data (tiers, products) |
| INSERT with JOIN | Mapping tables referencing other tables |
| INSERT with VALUES subquery | Complex mappings with multiple lookups |
| CROSS JOIN with WHERE | Many-to-many relationships with conditions |
| ON CONFLICT | Idempotent operations |

## Test User Patterns

### UUID Format
Use readable, pattern-based UUIDs for test data:
- `'aaaaaaaa-1111-1111-1111-111111111111'` - First test user
- `'bbbbbbbb-2222-2222-2222-222222222222'` - Second test user
- `'00000000-0000-0000-0000-000000000001'` - Admin user (special pattern)

### Admin User Creation
```sql
-- Insert admin user
INSERT INTO "auth"."users" (
    "instance_id", "id", "aud", "role", "email", "encrypted_password",
    "email_confirmed_at", "created_at", "updated_at", ...
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000001',
    'authenticated', 'authenticated',
    'test@admin.com',
    '$2a$10$F/GG/iuE6hgeaosm8U599O5I2ykYU6llUnhGdNGPkxC3LDxxXXBOK',
    '2024-01-01 00:00:00+00',
    '2024-01-01 00:00:00+00',
    '2024-10-11 00:00:00+00',
    ...
);

-- Update profile name
UPDATE "public"."user_profiles"
SET "full_name" = 'Test Admin'
WHERE "id" = '00000000-0000-0000-0000-000000000001';

-- Grant admin privileges
SELECT make_user_app_admin('00000000-0000-0000-0000-000000000001');
```

### Test User with Purchase
```sql
-- Insert user
INSERT INTO "auth"."users" (...) VALUES (...);

-- Update profile (created by trigger)
UPDATE "public"."user_profiles" SET "full_name" = 'Alice Johnson'
WHERE "id" = 'aaaaaaaa-1111-1111-1111-111111111111';

-- Add payment (uses workspace_id from auto-created workspace)
INSERT INTO "public"."billing_payments" (...)
SELECT
    'fake_payment_001',
    w.id as workspace_id,
    bpc.id as billing_products_catalogue_id,
    9900.00,
    '2024-01-15 10:30:00+00'::timestamptz,
    ...
FROM workspaces w
JOIN billing_products_catalogue bpc ON bpc.price_id = '1054140'
WHERE w.slug = 'personal-aaaaaaaa-1111-1111-1111-111111111111';
```

## Multi-Provider Billing

The system supports three payment providers with a unified catalog:

### Provider Identifiers
- `'stripe'` - Stripe payments
- `'lemonsqueezy'` / `'ls'` - LemonSqueezy payments
- `'polar'` - Polar payments

### Catalog Structure
Each product has entries for each provider:
```sql
INSERT INTO billing_products_catalogue (provider, product_id, price_id, price_amount, price_currency, product_name)
VALUES
    -- Stripe
    ('stripe', 'prod_ABC123', 'price_XYZ789', 9900, 'usd', 'Nextbase Essential'),
    -- LemonSqueezy
    ('lemonsqueezy', '670731', '1054140', 9900, 'usd', 'Nextbase Essential'),
    -- Polar
    ('polar', 'uuid-here', 'price-uuid-here', 9900, 'usd', 'Nextbase Essential');
```

### Provider-Specific Customers
```sql
-- LemonSqueezy customers
INSERT INTO "public"."billing_ls_customers" ("customer_id", "workspace_id")
SELECT '9990001', w.id FROM workspaces w WHERE w.slug = 'personal-user-uuid';

-- Polar customers
INSERT INTO "public"."billing_polar_customers" ("customer_id", "workspace_id")
SELECT 'fake-polar-cust-001', w.id FROM workspaces w WHERE w.slug = 'personal-user-uuid';
```

## Tier System

### Tier Levels (ascending)
1. `PERSONAL_ESSENTIAL` - Entry tier
2. `PERSONAL_PRO` - Professional tier
3. `PERSONAL_ULTIMATE` - Ultimate personal tier
4. `BUSINESS_ULTIMATE` - Business tier (5 invitations/repo)
5. `BUSINESS_ULTIMATE_PLUS` - Business Plus (10 invitations/repo)

### Tier Benefits Inheritance
Higher tiers generally include benefits from lower tiers. Define this in `available_benefits_to_tiers`:
```sql
-- PRO tier gets its own benefits + ESSENTIAL benefits
INSERT INTO available_benefits_to_tiers (available_benefit_id, tier_id)
SELECT ab.id, t.id
FROM available_benefits ab
CROSS JOIN nextbase_tier_types t
WHERE (
    ab.benefit_identifier IN ('GITHUB_REPO_NEXTBASE_PRO', 'GITHUB_REPO_NEXTBASE_ESSENTIAL')
    AND t.tier_identifier = 'PERSONAL_PRO'
);
```

## Product Types

### Base Products
- `NEXTBASE_ESSENTIAL`, `NEXTBASE_PRO`, `NEXTBASE_ULTIMATE`
- `NEXTBASE_BUSINESS_ULTIMATE`, `NEXTBASE_BUSINESS_ULTIMATE_PLUS`

### Upgrade Products
- `UPGRADE_ESSENTIAL_TO_PRO`, `UPGRADE_ESSENTIAL_TO_ULTIMATE`
- `UPGRADE_PRO_TO_ULTIMATE`
- Cross-tier upgrades: `UPGRADE_*_TO_BUSINESS_*`

### Standalone Products
- `FRAMER_TEMPLATE_TRANSCEND`, `FRAMER_TEMPLATE_POWERSAAS`
- `NEXTJS_TEMPLATE_SERENIA`

Standalone products have `is_standalone_purchase = true` and grant benefits directly without affecting tier.

## Benefits System

### Benefit Types
- `github_repo` - GitHub repository access
- `framer_template` - Framer template access
- `digital_asset` - Other digital assets

### Metadata Examples
```sql
-- GitHub repo benefit
'{"owner": "imbhargav5", "repo": "nextbase-essential"}'::jsonb

-- Framer template benefit
'{"variantId": "404953"}'::jsonb
```

## Examples

See `references/examples.md` for complete real-world examples from the Nextbase seed file.
