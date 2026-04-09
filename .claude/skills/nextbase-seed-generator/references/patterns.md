# SQL Patterns for Seed Data

Reference patterns used in Nextbase seed files.

## Pattern A: Simple INSERT with VALUES

Use for static lookup data where all values are known.

```sql
INSERT INTO nextbase_tier_types (tier_identifier, name, description, tier_level, status, metadata)
VALUES
    ('PERSONAL_ESSENTIAL', 'Personal Essential', 'Entry-level tier', 1, 'active', '{"max_invitations_per_repo": 1}'),
    ('PERSONAL_PRO', 'Personal Pro', 'Professional tier', 2, 'active', '{"max_invitations_per_repo": 1}'),
    ('PERSONAL_ULTIMATE', 'Personal Ultimate', 'Ultimate tier', 3, 'active', '{"max_invitations_per_repo": 1}');
```

**When to use:**
- Tier types
- Product types
- Benefit definitions
- Billing catalog entries

---

## Pattern B: INSERT with SELECT and JOINs

Use when inserting mapping data that references other tables by identifier.

```sql
-- Map direct product purchases to tiers
INSERT INTO nextbase_product_types_to_tier_map (nextbase_tier_id, nextbase_product_type_ids, description)
SELECT
    t.id as nextbase_tier_id,
    ARRAY[pt.id] as nextbase_product_type_ids,
    'Direct ' || pt.name || ' purchase'
FROM nextbase_tier_types t
JOIN nextbase_product_types pt ON (
    (t.tier_identifier = 'PERSONAL_ESSENTIAL' AND pt.product_type_identifier = 'NEXTBASE_ESSENTIAL') OR
    (t.tier_identifier = 'PERSONAL_PRO' AND pt.product_type_identifier = 'NEXTBASE_PRO') OR
    (t.tier_identifier = 'PERSONAL_ULTIMATE' AND pt.product_type_identifier = 'NEXTBASE_ULTIMATE')
);
```

**When to use:**
- Product-to-tier mappings
- Multi-product upgrade paths
- Any mapping requiring ID lookups

---

## Pattern C: INSERT with VALUES Subquery and JOINs

Use for complex mappings where you have a list of identifier pairs to map.

```sql
-- Map prices to product types
INSERT INTO billing_price_to_nextbase_product_type_map (
    billing_products_catalogue_id,
    nextbase_product_type_id,
    provider,
    is_active,
    notes
)
SELECT
    bpc.id,
    pt.id,
    bpc.provider,
    true,
    notes
FROM (VALUES
    -- (price_id, product_type_identifier, notes)
    ('price_1SLSTaSRemIguBmf27YuLWb4', 'NEXTBASE_ESSENTIAL', NULL),
    ('price_1SLSUCSRemIguBmfWgZ7Bhkk', 'NEXTBASE_PRO', NULL),
    ('price_1SLSUmSRemIguBmfXNQ96IZ4', 'NEXTBASE_ULTIMATE', NULL),
    ('price_1SLSVKSRemIguBmfxkUZGEAB', 'NEXTBASE_BUSINESS_ULTIMATE', 'Maps to Business tier')
) AS mapping_data(price_id, product_type, notes)
JOIN billing_products_catalogue bpc ON bpc.price_id = mapping_data.price_id
JOIN nextbase_product_types pt ON pt.product_type_identifier = mapping_data.product_type;
```

**Advantages:**
- Clear mapping of identifiers
- Single query for multiple mappings
- Automatically resolves UUIDs via JOINs

---

## Pattern D: INSERT with CROSS JOIN and WHERE

Use for many-to-many relationships with conditional assignment.

```sql
-- Map benefits to tiers with inheritance
INSERT INTO available_benefits_to_tiers (available_benefit_id, tier_id)
SELECT ab.id, t.id
FROM available_benefits ab
CROSS JOIN nextbase_tier_types t
WHERE
    -- PERSONAL_ESSENTIAL tier gets its own benefits
    (ab.benefit_identifier = 'GITHUB_REPO_NEXTBASE_ESSENTIAL' AND t.tier_identifier = 'PERSONAL_ESSENTIAL')

    -- PERSONAL_PRO tier gets PRO + ESSENTIAL benefits
    OR (ab.benefit_identifier IN ('GITHUB_REPO_NEXTBASE_PRO', 'GITHUB_REPO_NEXTBASE_ESSENTIAL')
        AND t.tier_identifier = 'PERSONAL_PRO')

    -- PERSONAL_ULTIMATE tier gets all personal benefits
    OR (ab.benefit_identifier IN (
        'GITHUB_REPO_NEXTBASE_ESSENTIAL',
        'GITHUB_REPO_NEXTBASE_PRO',
        'GITHUB_REPO_NEXTBASE_ULTIMATE',
        'GITHUB_REPO_10_NEXT_JS_LANDING_PAGES'
    ) AND t.tier_identifier = 'PERSONAL_ULTIMATE')

    -- BUSINESS_ULTIMATE_PLUS gets everything except standalone templates
    OR (t.tier_identifier = 'BUSINESS_ULTIMATE_PLUS'
        AND ab.benefit_identifier NOT IN ('FRAMER_TEMPLATE_TRANSCEND', 'FRAMER_TEMPLATE_POWERSAAS'))
ON CONFLICT (available_benefit_id, tier_id) DO NOTHING;
```

**When to use:**
- Benefits-to-tiers mapping
- Any junction table with complex rules
- Inheritance patterns (higher tiers get lower tier benefits)

---

## Pattern E: JSONB Metadata

Use JSONB for flexible, extensible metadata.

```sql
-- Tier metadata
INSERT INTO nextbase_tier_types (tier_identifier, name, metadata)
VALUES (
    'BUSINESS_ULTIMATE',
    'Business Ultimate',
    '{"max_invitations_per_repo": 5}'::jsonb
);

-- Benefit metadata for GitHub repos
INSERT INTO available_benefits (benefit_identifier, name, benefit_type, metadata)
VALUES (
    'GITHUB_REPO_NEXTBASE_ESSENTIAL',
    'Nextbase Essential Repository',
    'github_repo',
    '{"owner": "imbhargav5", "repo": "nextbase-essential"}'::jsonb
);

-- Benefit metadata for Framer templates
INSERT INTO available_benefits (benefit_identifier, name, benefit_type, metadata)
VALUES (
    'FRAMER_TEMPLATE_TRANSCEND',
    'Transcend Framer Template',
    'framer_template',
    '{"variantId": "404953"}'::jsonb
);

-- Payment info metadata
INSERT INTO billing_payments (id, info, ...)
VALUES (
    'fake_payment_001',
    '{"receipt": "https://lemonsqueezy.com/receipt1", "refunded": false, "order_number": 10000001}'::jsonb,
    ...
);
```

---

## Pattern F: UUID Patterns for Test Data

Use readable, pattern-based UUIDs for test users.

```sql
-- Pattern: use repeating characters for readability
-- User 1
'aaaaaaaa-1111-1111-1111-111111111111'
-- User 2
'bbbbbbbb-2222-2222-2222-222222222222'
-- User 3
'cccccccc-3333-3333-3333-333333333333'

-- Admin user (special pattern)
'00000000-0000-0000-0000-000000000001'

-- Instance ID (always zeros)
'00000000-0000-0000-0000-000000000000'

-- Free tier users (different pattern)
'11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
'22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb'

-- Team users
'17777777-7777-7777-7777-777777777777'
'18888888-8888-8888-8888-888888888888'
```

---

## Pattern G: UPDATE After INSERT (Trigger-Dependent)

Use when triggers create related records that need updates.

```sql
-- 1. Insert auth user (triggers create profile and workspace)
INSERT INTO "auth"."users" (
    "instance_id", "id", "aud", "role", "email", ...
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'aaaaaaaa-1111-1111-1111-111111111111',
    'authenticated', 'authenticated',
    'alice@example.com',
    ...
);

-- 2. Update the auto-created profile
UPDATE "public"."user_profiles"
SET "full_name" = 'Alice Johnson'
WHERE "id" = 'aaaaaaaa-1111-1111-1111-111111111111';
```

---

## Pattern H: ON CONFLICT for Idempotency

Use to make seed data re-runnable without errors.

```sql
-- Insert or update on conflict
INSERT INTO available_benefits (benefit_identifier, name, description, metadata)
VALUES
    ('GITHUB_REPO_NEXTBASE_ESSENTIAL', 'Nextbase Essential', 'Access to repo', '{"owner": "imbhargav5", "repo": "nextbase-essential"}')
ON CONFLICT (benefit_identifier) DO UPDATE
SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    metadata = EXCLUDED.metadata;

-- Insert or ignore on conflict
INSERT INTO available_benefits_to_tiers (available_benefit_id, tier_id)
SELECT ab.id, t.id
FROM available_benefits ab
CROSS JOIN nextbase_tier_types t
WHERE ...
ON CONFLICT (available_benefit_id, tier_id) DO NOTHING;
```

---

## Pattern I: Workspace-Based Queries

Reference workspaces by their auto-generated slug.

```sql
-- Get workspace_id for a user
SELECT id FROM workspaces WHERE slug = 'personal-aaaaaaaa-1111-1111-1111-111111111111';

-- Insert payment with workspace lookup
INSERT INTO "public"."billing_payments" (id, workspace_id, billing_products_catalogue_id, ...)
SELECT
    'fake_payment_001',
    w.id as workspace_id,
    bpc.id as billing_products_catalogue_id,
    ...
FROM workspaces w
JOIN billing_products_catalogue bpc ON bpc.price_id = '1054140'
WHERE w.slug = 'personal-aaaaaaaa-1111-1111-1111-111111111111';

-- Insert customer with workspace lookup
INSERT INTO "public"."billing_ls_customers" ("customer_id", "workspace_id")
SELECT
    c.customer_id,
    w.id as workspace_id
FROM (VALUES
    ('9990001', 'aaaaaaaa-1111-1111-1111-111111111111'),
    ('9990002', 'bbbbbbbb-2222-2222-2222-222222222222')
) AS c(customer_id, user_id)
JOIN workspaces w ON w.slug = 'personal-' || c.user_id::text;
```

---

## Pattern J: Multi-Product Array Mappings

Map multiple products to a single tier using arrays.

```sql
-- Upgrade path: ESSENTIAL + UPGRADE = PRO
INSERT INTO nextbase_product_types_to_tier_map (nextbase_tier_id, nextbase_product_type_ids, description)
SELECT
    t.id as nextbase_tier_id,
    ARRAY[pt1.id, pt2.id] as nextbase_product_type_ids,
    'ESSENTIAL + ' || pt2.name
FROM nextbase_tier_types t
JOIN nextbase_product_types pt1 ON pt1.product_type_identifier = 'NEXTBASE_ESSENTIAL'
JOIN nextbase_product_types pt2 ON (
    (t.tier_identifier = 'PERSONAL_PRO' AND pt2.product_type_identifier = 'UPGRADE_ESSENTIAL_TO_PRO') OR
    (t.tier_identifier = 'PERSONAL_ULTIMATE' AND pt2.product_type_identifier = 'UPGRADE_ESSENTIAL_TO_ULTIMATE')
);
```

---

## Pattern K: Standalone Product to Benefit Mapping

Map standalone products directly to their benefits.

```sql
INSERT INTO available_benefits_to_standalone_products (available_benefit_id, product_type_id)
SELECT
    ab.id as available_benefit_id,
    pt.id as product_type_id
FROM available_benefits ab
CROSS JOIN nextbase_product_types pt
WHERE (
    (ab.benefit_identifier = 'FRAMER_TEMPLATE_TRANSCEND' AND
     pt.product_type_identifier = 'FRAMER_TEMPLATE_TRANSCEND') OR
    (ab.benefit_identifier = 'FRAMER_TEMPLATE_POWERSAAS' AND
     pt.product_type_identifier = 'FRAMER_TEMPLATE_POWERSAAS') OR
    (ab.benefit_identifier = 'NEXTJS_TEMPLATE_SERENIA' AND
     pt.product_type_identifier = 'NEXTJS_TEMPLATE_SERENIA')
);
```
