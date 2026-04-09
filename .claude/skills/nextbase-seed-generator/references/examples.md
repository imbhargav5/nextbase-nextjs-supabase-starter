# Real Examples from Nextbase Seed

Complete examples extracted from `supabase/seed.sql`.

## Section Separator

```sql
-- =====================================================
-- SECTION NAME
-- =====================================================
```

---

## Tier Types

```sql
-- =====================================================
-- TIER TYPES
-- =====================================================
INSERT INTO nextbase_tier_types (tier_identifier, name, description, tier_level, status, metadata)
VALUES
    ('PERSONAL_ESSENTIAL', 'Personal Essential', 'Entry-level tier with 1 team invitation per repository', 1, 'active', '{"max_invitations_per_repo": 1}'),
    ('PERSONAL_PRO', 'Personal Pro', 'Professional tier with 2 team invitations per repository', 2, 'active', '{"max_invitations_per_repo": 1}'),
    ('PERSONAL_ULTIMATE', 'Personal Ultimate', 'Ultimate tier with 3 team invitations per repository', 3, 'active', '{"max_invitations_per_repo": 1}'),
    ('BUSINESS_ULTIMATE', 'Nextbase Ultimate - Business', 'Business tier with 5 team invitations per repository', 4, 'active', '{"max_invitations_per_repo": 5}'),
    ('BUSINESS_ULTIMATE_PLUS', 'Nextbase Ultimate - Business Plus', 'Business Plus tier with 10 team invitations per repository', 5, 'active', '{"max_invitations_per_repo": 10}');
```

---

## Product Types

```sql
-- =====================================================
-- PRODUCT TYPES
-- =====================================================
INSERT INTO nextbase_product_types (product_type_identifier, name, description, is_upgrade, is_standalone_purchase, status)
VALUES
    -- Base products
    ('NEXTBASE_ESSENTIAL', 'Nextbase ESSENTIAL', 'Entry-level Nextbase starter kit', false, false, 'active'),
    ('NEXTBASE_PRO', 'Nextbase PRO', 'Professional Nextbase starter kit with advanced features', false, false, 'active'),
    ('NEXTBASE_ULTIMATE', 'Nextbase ULTIMATE', 'Complete Nextbase package with all features and templates', false, false, 'active'),
    ('NEXTBASE_BUSINESS_ULTIMATE', 'Nextbase Ultimate - Business', 'Business package with 5 invitations per repo', false, false, 'active'),
    ('NEXTBASE_BUSINESS_ULTIMATE_PLUS', 'Nextbase Ultimate - Business Plus', 'Business Plus package with 10 invitations per repo', false, false, 'active'),

    -- Upgrades within PERSONAL tier
    ('UPGRADE_ESSENTIAL_TO_PRO', 'Upgrade Essential to PRO', 'Upgrade from Essential to PRO tier', true, false, 'active'),
    ('UPGRADE_ESSENTIAL_TO_ULTIMATE', 'Upgrade Essential to ULTIMATE', 'Upgrade from Essential to ULTIMATE tier', true, false, 'active'),
    ('UPGRADE_PRO_TO_ULTIMATE', 'Upgrade PRO to ULTIMATE', 'Upgrade from PRO to ULTIMATE tier', true, false, 'active'),

    -- Upgrades from PERSONAL to BUSINESS
    ('UPGRADE_ESSENTIAL_TO_BUSINESS_ULTIMATE', 'Upgrade Essential to Business', 'Upgrade from Personal Essential to Business', true, false, 'active'),
    ('UPGRADE_ESSENTIAL_TO_BUSINESS_ULTIMATE_PLUS', 'Upgrade Essential to Business Plus', 'Upgrade from Personal Essential to Business Plus', true, false, 'active'),
    ('UPGRADE_PRO_TO_BUSINESS_ULTIMATE', 'Upgrade PRO to Business', 'Upgrade from Personal PRO to Business', true, false, 'active'),
    ('UPGRADE_PRO_TO_BUSINESS_ULTIMATE_PLUS', 'Upgrade PRO to Business Plus', 'Upgrade from Personal PRO to Business Plus', true, false, 'active'),
    ('UPGRADE_ULTIMATE_TO_BUSINESS_ULTIMATE', 'Upgrade ULTIMATE to Business', 'Upgrade from Personal ULTIMATE to Business', true, false, 'active'),
    ('UPGRADE_ULTIMATE_TO_BUSINESS_ULTIMATE_PLUS', 'Upgrade ULTIMATE to Business Plus', 'Upgrade from Personal ULTIMATE to Business Plus', true, false, 'active'),

    -- Upgrades within BUSINESS tier
    ('UPGRADE_BUSINESS_ULTIMATE_TO_BUSINESS_ULTIMATE_PLUS', 'Upgrade Business to Business Plus', 'Upgrade from Business to Business Plus', true, false, 'active'),

    -- Framer templates (standalone purchases)
    ('FRAMER_TEMPLATE_TRANSCEND', 'TRANSCEND Framer Template', 'Premium Framer template for SaaS products', false, true, 'active'),
    ('FRAMER_TEMPLATE_POWERSAAS', 'POWERSAAS Framer Template', 'Modern Framer template for SaaS landing pages', false, true, 'active'),
    ('NEXTJS_TEMPLATE_SERENIA', 'Serenia Next.js Template', 'Modern Next.js template for SaaS applications', false, true, 'active');
```

---

## Billing Products Catalogue (Multi-Provider)

```sql
-- =====================================================
-- BILLING PRODUCTS CATALOGUE
-- =====================================================
INSERT INTO billing_products_catalogue (provider, product_id, price_id, price_amount, price_currency, product_name)
VALUES
    -- Stripe products
    ('stripe', 'prod_TI2Y81a1Vgt3ie', 'price_1SLSTaSRemIguBmf27YuLWb4', 9900, 'usd', 'Nextbase Essential - Personal'),
    ('stripe', 'prod_TI2Zr2YBDCDsl8', 'price_1SLSUCSRemIguBmfWgZ7Bhkk', 29900, 'usd', 'Nextbase Pro - Personal'),
    ('stripe', 'prod_TI2ZdUmUnm4xLm', 'price_1SLSUmSRemIguBmfXNQ96IZ4', 39900, 'usd', 'Nextbase Ultimate - Personal'),
    ('stripe', 'prod_TI2afnw7aElUVE', 'price_1SLSVKSRemIguBmfxkUZGEAB', 69900, 'usd', 'Nextbase Ultimate - Business'),
    ('stripe', 'prod_TI2bCxkFvC5Hk6', 'price_1SLSVsSRemIguBmftF31BSsa', 89900, 'usd', 'Nextbase Ultimate - Business Plus'),

    -- Stripe upgrades
    ('stripe', 'prod_TI2b1OEIkVZFVa', 'price_1SLSWRSRemIguBmfrTKg5Elt', 20000, 'usd', 'Upgrade: Essential → Pro'),
    ('stripe', 'prod_TI2dcKjsvmtsBE', 'price_1SLSYLSRemIguBmfRI8cLPWP', 30000, 'usd', 'Upgrade: Essential → Ultimate'),

    -- LemonSqueezy products
    ('lemonsqueezy', '670731', '1054140', 9900, 'usd', 'Nextbase Essential - Personal'),
    ('lemonsqueezy', '670733', '1054144', 29900, 'usd', 'Nextbase Pro - Personal'),
    ('lemonsqueezy', '670738', '1054151', 39900, 'usd', 'Nextbase Ultimate - Personal'),
    ('lemonsqueezy', '670741', '1054156', 69900, 'usd', 'Nextbase Ultimate - Business'),
    ('lemonsqueezy', '670742', '1054157', 89900, 'usd', 'Nextbase Ultimate - Business Plus'),

    -- LemonSqueezy upgrades
    ('lemonsqueezy', '670744', '1054159', 20000, 'usd', 'Upgrade: Essential → Pro'),
    ('lemonsqueezy', '670745', '1054160', 30000, 'usd', 'Upgrade: Essential → Ultimate'),

    -- Polar products
    ('polar', '59bdd999-51d7-4e41-bd4d-eda718c2e6c5', '64cd9f4b-c6aa-47ac-ab7b-282996222d36', 9900, 'usd', 'Nextbase Essential - Personal'),
    ('polar', '48e586d9-0f8c-44e0-9a66-7a64fd70f4c3', '363b2755-9ee0-49d7-a529-f005daba9805', 29900, 'usd', 'Nextbase Pro - Personal'),
    ('polar', '13875231-17cd-4607-82bc-7600837e434a', '2fe4c6a4-1c7e-47c0-b336-28a36fc31583', 39900, 'usd', 'Nextbase Ultimate - Personal'),

    -- Polar standalone templates
    ('polar', '19a65e12-d672-450b-8d55-888b62233b43', '28633fe7-99c3-47f9-ae8b-6277507a323b', 7900, 'usd', 'TRANSCEND Framer Template'),
    ('polar', '4d3f31dd-6cdb-422e-8390-1c3a712cb461', '38f1af08-83fe-452f-98c7-e9ee92a8e645', 7900, 'usd', 'POWERSAAS Framer Template'),
    ('polar', 'cd70e22a-9a3b-4f67-b074-cba4792a7803', 'bf0e35c5-0f98-4b3e-ae11-b60606589df0', 7900, 'usd', 'Serenia Next.js Template');
```

---

## Available Benefits

```sql
-- =====================================================
-- AVAILABLE BENEFITS
-- =====================================================
INSERT INTO available_benefits (benefit_identifier, name, description, benefit_type, status, metadata)
VALUES
    -- GitHub repo benefits
    ('GITHUB_REPO_NEXTBASE_ESSENTIAL', 'Nextbase Essential Repository', 'Access to the Nextbase Essential starter kit repository', 'github_repo', 'active'::benefit_status, '{"owner": "imbhargav5", "repo": "nextbase-essential"}'),
    ('GITHUB_REPO_NEXTBASE_PRO', 'Nextbase Pro Repository', 'Access to the Nextbase Pro starter kit repository', 'github_repo', 'active'::benefit_status, '{"owner": "imbhargav5", "repo": "nextbase-pro"}'),
    ('GITHUB_REPO_NEXTBASE_ULTIMATE', 'Nextbase Ultimate Repository', 'Access to the Nextbase Ultimate starter kit repository', 'github_repo', 'active'::benefit_status, '{"owner": "imbhargav5", "repo": "nextbase-ultimate"}'),
    ('GITHUB_REPO_10_NEXT_JS_LANDING_PAGES', 'Nextbase Landing Pages Kit', 'Collection of 10 Next.js landing page templates', 'github_repo', 'active'::benefit_status, '{"owner": "imbhargav5", "repo": "nextbase-landing-kit"}'),
    ('GITHUB_REPO_AI_STARTER', 'AI Starter Repository', 'AI-powered starter kit with Vercel AI SDK', 'github_repo', 'active'::benefit_status, '{"owner": "imbhargav5", "repo": "nextbase-ai-starter"}'),

    -- Framer templates
    ('FRAMER_TEMPLATE_TRANSCEND', 'Transcend Framer Template', 'Premium Framer template for SaaS products', 'framer_template', 'active'::benefit_status, '{"variantId": "404953"}'),
    ('FRAMER_TEMPLATE_POWERSAAS', 'PowerSaaS Framer Template', 'Modern Framer template for SaaS landing pages', 'framer_template', 'active'::benefit_status, '{"variantId": "410352"}'),

    -- Next.js templates
    ('NEXTJS_TEMPLATE_SERENIA', 'Serenia Next.js Template', 'Modern Next.js template for SaaS applications', 'digital_asset', 'active'::benefit_status, '{}')
ON CONFLICT (benefit_identifier) DO UPDATE
SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    metadata = EXCLUDED.metadata;
```

---

## Test Users (with auth.users)

```sql
-- =====================================================
-- FAKE USER DATA FOR TESTING
-- =====================================================

-- Users with purchases
INSERT INTO "auth"."users" (
    "instance_id", "id", "aud", "role", "email", "encrypted_password",
    "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at",
    "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change",
    "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data",
    "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at",
    "phone_change", "phone_change_token", "phone_change_sent_at",
    "email_change_token_current", "email_change_confirm_status", "banned_until",
    "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous"
) VALUES
    -- Alice - ESSENTIAL tier
    ('00000000-0000-0000-0000-000000000000', 'aaaaaaaa-1111-1111-1111-111111111111',
     'authenticated', 'authenticated', 'alice.johnson@example.com',
     '$2a$10$F/GG/iuE6hgeaosm8U599O5I2ykYU6llUnhGdNGPkxC3LDxxXXBOK',
     '2024-01-15 10:30:00+00', NULL, '', '2024-01-15 10:25:00+00', '', NULL, '', '', NULL,
     '2024-10-10 08:15:00+00', '{"provider": "email", "providers": ["email"]}', '{}',
     NULL, '2024-01-15 10:25:00+00', '2024-10-10 08:15:00+00', NULL, NULL, '', '', NULL,
     '', 0, NULL, '', NULL, false, NULL, false),

    -- Bob - PRO tier
    ('00000000-0000-0000-0000-000000000000', 'bbbbbbbb-2222-2222-2222-222222222222',
     'authenticated', 'authenticated', 'bob.smith@example.com',
     '$2a$10$6EHQQFgs3EcesVWvy6DNK.cx6P6smuygng.//K4AeN8OWPpcVoGZK',
     '2024-02-20 14:45:00+00', NULL, '', '2024-02-20 14:40:00+00', '', NULL, '', '', NULL,
     '2024-10-09 16:20:00+00', '{"provider": "email", "providers": ["email"]}', '{}',
     NULL, '2024-02-20 14:40:00+00', '2024-10-09 16:20:00+00', NULL, NULL, '', '', NULL,
     '', 0, NULL, '', NULL, false, NULL, false);

-- Free tier users (no purchases)
INSERT INTO "auth"."users" (...) VALUES
    ('00000000-0000-0000-0000-000000000000', '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
     'authenticated', 'authenticated', 'grace.lee@example.com', ...);

-- Unconfirmed user
INSERT INTO "auth"."users" (...) VALUES
    ('00000000-0000-0000-0000-000000000000', '44444444-dddd-dddd-dddd-dddddddddddd',
     'authenticated', 'authenticated', 'jack.thompson@example.com',
     ...,
     NULL,  -- email_confirmed_at = NULL means unconfirmed
     ...,
     'unconfirmed_token_xyz',  -- confirmation_token
     ...);
```

---

## Admin User Creation

```sql
-- Create admin user
INSERT INTO "auth"."users" (
    "instance_id", "id", "aud", "role", "email", "encrypted_password",
    "email_confirmed_at", ...
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000001',
    'authenticated', 'authenticated',
    'test@admin.com',
    '$2a$10$F/GG/iuE6hgeaosm8U599O5I2ykYU6llUnhGdNGPkxC3LDxxXXBOK',
    '2024-01-01 00:00:00+00',
    ...
);

-- Update profile name (created by trigger)
UPDATE "public"."user_profiles"
SET "full_name" = 'Test Admin'
WHERE "id" = '00000000-0000-0000-0000-000000000001';

-- Grant admin privileges
SELECT make_user_app_admin('00000000-0000-0000-0000-000000000001');
```

---

## Update User Profiles (After Trigger)

```sql
-- Note: User profiles are automatically created by the on_auth_user_created_create_profile trigger
-- Update full names for the created profiles
UPDATE "public"."user_profiles" SET "full_name" = 'Alice Johnson' WHERE "id" = 'aaaaaaaa-1111-1111-1111-111111111111';
UPDATE "public"."user_profiles" SET "full_name" = 'Bob Smith' WHERE "id" = 'bbbbbbbb-2222-2222-2222-222222222222';
UPDATE "public"."user_profiles" SET "full_name" = 'Carol Williams' WHERE "id" = 'cccccccc-3333-3333-3333-333333333333';
UPDATE "public"."user_profiles" SET "full_name" = 'Test Admin' WHERE "id" = '00000000-0000-0000-0000-000000000001';
```

---

## Billing Payments

```sql
-- =====================================================
-- BILLING PAYMENTS
-- =====================================================
INSERT INTO "public"."billing_payments" (
    "id", "workspace_id", "billing_products_catalogue_id",
    "amount", "payment_date", "method", "info", "status", "currency", "provider"
)
SELECT
    p.payment_id,
    w.id as workspace_id,
    bpc.id as billing_products_catalogue_id,
    p.amount,
    p.payment_date,
    p.method,
    p.info,
    p.status,
    p.currency,
    p.provider
FROM (VALUES
    -- Alice - ESSENTIAL (LemonSqueezy)
    ('fake_payment_001', 'aaaaaaaa-1111-1111-1111-111111111111', 9900.00,
     '2024-01-15 10:30:00+00'::timestamptz, 'lemon_squeezy',
     '{"receipt": "https://lemonsqueezy.com/receipt1", "refunded": false, "order_number": 10000001}'::jsonb,
     'paid', 'usd', 'ls'::payment_provider_type, '1054140'),

    -- Bob - PRO (LemonSqueezy)
    ('fake_payment_002', 'bbbbbbbb-2222-2222-2222-222222222222', 29900.00,
     '2024-02-20 14:50:00+00'::timestamptz, 'lemon_squeezy',
     '{"receipt": "https://lemonsqueezy.com/receipt2", "refunded": false, "order_number": 10000002}'::jsonb,
     'paid', 'usd', 'ls'::payment_provider_type, '1054144'),

    -- Carol - ULTIMATE (Polar)
    ('fake_payment_003', 'cccccccc-3333-3333-3333-333333333333', 39900.00,
     '2024-03-10 09:20:00+00'::timestamptz, 'polar',
     '{"quantity": 1, "test_mode": true, "order_number": "polar-order-001"}'::jsonb,
     'paid', 'usd', 'polar'::payment_provider_type, '2fe4c6a4-1c7e-47c0-b336-28a36fc31583'),

    -- David - ULTIMATE (Stripe)
    ('ch_fake_stripe_001', 'dddddddd-4444-4444-4444-444444444444', 39900.00,
     '2024-05-05 16:35:00+00'::timestamptz, 'stripe',
     '{"refunds": [], "invoiceUrl": "https://stripe.com/invoice1"}'::jsonb,
     'succeeded', 'usd', 'stripe'::payment_provider_type, 'price_1SLSUmSRemIguBmfXNQ96IZ4'),

    -- Nathan - PRO + Upgrade to Business Plus (two payments)
    ('fake_payment_009', '1aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 29900.00,
     '2024-07-05 16:35:00+00'::timestamptz, 'polar',
     '{"quantity": 1, "test_mode": true, "order_number": "polar-order-003"}'::jsonb,
     'paid', 'usd', 'polar'::payment_provider_type, '363b2755-9ee0-49d7-a529-f005daba9805'),
    ('fake_payment_010', '1aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 60000.00,
     '2024-08-01 10:00:00+00'::timestamptz, 'polar',
     '{"quantity": 1, "test_mode": true, "order_number": "polar-order-004"}'::jsonb,
     'paid', 'usd', 'polar'::payment_provider_type, 'cd989559-5b67-4e24-8d54-6a547f32d50d')
) AS p(payment_id, user_id, amount, payment_date, method, info, status, currency, provider, price_id)
JOIN workspaces w ON w.slug = 'personal-' || p.user_id::text
JOIN billing_products_catalogue bpc ON bpc.price_id = p.price_id;
```

---

## Provider Customers

```sql
-- LemonSqueezy customers
INSERT INTO "public"."billing_ls_customers" ("customer_id", "workspace_id")
SELECT
    c.customer_id,
    w.id as workspace_id
FROM (VALUES
    ('9990001', 'aaaaaaaa-1111-1111-1111-111111111111'),
    ('9990002', 'bbbbbbbb-2222-2222-2222-222222222222'),
    ('9990003', 'eeeeeeee-5555-5555-5555-555555555555')
) AS c(customer_id, user_id)
JOIN workspaces w ON w.slug = 'personal-' || c.user_id::text;

-- Polar customers
INSERT INTO "public"."billing_polar_customers" ("customer_id", "workspace_id")
SELECT
    pc.customer_id,
    w.id as workspace_id
FROM (VALUES
    ('fake-polar-cust-001', 'cccccccc-3333-3333-3333-333333333333'),
    ('fake-polar-cust-002', 'ffffffff-6666-6666-6666-666666666666'),
    ('fake-polar-cust-003', '17777777-7777-7777-7777-777777777777')
) AS pc(customer_id, user_id)
JOIN workspaces w ON w.slug = 'personal-' || pc.user_id::text;
```

---

## Workspace Tier Assignments

```sql
-- Assign tiers to workspaces based on their purchases
INSERT INTO "public"."nextbase_workspace_tiers" ("workspace_id", "tier_id")
SELECT
    w.id as workspace_id,
    t.id as tier_id
FROM auth.users u
JOIN workspaces w ON w.slug = 'personal-' || u.id::text
CROSS JOIN nextbase_tier_types t
WHERE
    (u.email = 'alice.johnson@example.com' AND t.tier_identifier = 'PERSONAL_ESSENTIAL')
    OR (u.email = 'bob.smith@example.com' AND t.tier_identifier = 'PERSONAL_PRO')
    OR (u.email = 'carol.williams@example.com' AND t.tier_identifier = 'PERSONAL_ULTIMATE')
    OR (u.email = 'karen.teams@example.com' AND t.tier_identifier = 'BUSINESS_ULTIMATE')
    OR (u.email = 'maria.ultimate@example.com' AND t.tier_identifier = 'BUSINESS_ULTIMATE_PLUS')
ON CONFLICT (workspace_id) DO NOTHING;
```

---

## Billing Assets Access

```sql
INSERT INTO "public"."billing_assets_access" (
    "id", "workspace_id", "member_details", "created_at", "asset_enum"
)
SELECT
    a.asset_id::uuid,
    w.id as workspace_id,
    a.member_details::jsonb,
    a.asset_created_at::timestamptz,
    a.asset_enum
FROM (VALUES
    -- GitHub repo access
    ('a0000001-0000-0000-0000-000000000001', 'aaaaaaaa-1111-1111-1111-111111111111',
     '{"invitations": [{"type": "github", "username": "alice_gh", "invited_at": "2024-01-15T10:35:00.000Z"}]}',
     '2024-01-15 10:35:00+00', 'GITHUB_REPO_NEXTBASE_ESSENTIAL'),

    -- Multiple GitHub invitations
    ('a0000003-0000-0000-0000-000000000003', 'cccccccc-3333-3333-3333-333333333333',
     '{"invitations": [{"type": "github", "username": "carolw", "invited_at": "2024-03-10T09:30:00.000Z"}, {"type": "github", "username": "carolw_work", "invited_at": "2024-03-10T09:35:00.000Z"}]}',
     '2024-03-10 09:30:00+00', 'GITHUB_REPO_NEXTBASE_ULTIMATE'),

    -- Framer template access
    ('a0000005-0000-0000-0000-000000000005', 'eeeeeeee-5555-5555-5555-555555555555',
     '{"invitations": [{"type": "framer", "email": "emma.davis@example.com", "invited_at": "2024-06-18T13:30:00.000Z", "discount_code": "EMMADAVIS999008FAKE"}]}',
     '2024-06-18 13:30:00+00', 'FRAMER_TEMPLATE_TRANSCEND')
) AS a(asset_id, user_id, member_details, asset_created_at, asset_enum)
JOIN workspaces w ON w.slug = 'personal-' || a.user_id::text;
```
