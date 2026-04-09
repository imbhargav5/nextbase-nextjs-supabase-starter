# Nextbase Database Schema Reference

Complete schema reference for seed data generation.

## Enum Types

```sql
-- Tier/Product/Benefit status
CREATE TYPE tier_status AS ENUM ('active', 'deprecated');
CREATE TYPE product_status AS ENUM ('active', 'deprecated');
CREATE TYPE benefit_status AS ENUM ('active', 'deprecated');

-- Payment providers
CREATE TYPE payment_provider AS ENUM ('stripe', 'lemonsqueezy', 'polar');
CREATE TYPE payment_provider_type AS ENUM ('stripe', 'ls', 'polar');

-- Workspace roles
CREATE TYPE workspace_member_role_type AS ENUM ('owner', 'admin', 'member', 'readonly');
```

---

## Core Tables

### nextbase_tier_types

Defines product tiers.

```sql
CREATE TABLE nextbase_tier_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_identifier TEXT UNIQUE NOT NULL,  -- e.g., 'PERSONAL_ESSENTIAL'
    name TEXT NOT NULL,                     -- e.g., 'Personal Essential'
    description TEXT,
    tier_level INTEGER NOT NULL,            -- 1-5, higher is better
    status tier_status DEFAULT 'active',
    metadata JSONB DEFAULT '{}',            -- e.g., {"max_invitations_per_repo": 1}
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Seed Values:**
| tier_identifier | tier_level | metadata |
|-----------------|------------|----------|
| PERSONAL_ESSENTIAL | 1 | `{"max_invitations_per_repo": 1}` |
| PERSONAL_PRO | 2 | `{"max_invitations_per_repo": 1}` |
| PERSONAL_ULTIMATE | 3 | `{"max_invitations_per_repo": 1}` |
| BUSINESS_ULTIMATE | 4 | `{"max_invitations_per_repo": 5}` |
| BUSINESS_ULTIMATE_PLUS | 5 | `{"max_invitations_per_repo": 10}` |

---

### nextbase_product_types

Defines purchasable products.

```sql
CREATE TABLE nextbase_product_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_type_identifier TEXT UNIQUE NOT NULL,  -- e.g., 'NEXTBASE_ESSENTIAL'
    name TEXT NOT NULL,
    description TEXT,
    is_upgrade BOOLEAN DEFAULT false,              -- true for upgrade products
    is_standalone_purchase BOOLEAN DEFAULT false,  -- true for Framer templates, etc.
    status product_status DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Product Categories:**
- **Base products**: `NEXTBASE_ESSENTIAL`, `NEXTBASE_PRO`, `NEXTBASE_ULTIMATE`, `NEXTBASE_BUSINESS_ULTIMATE`, `NEXTBASE_BUSINESS_ULTIMATE_PLUS`
- **Upgrades**: `UPGRADE_ESSENTIAL_TO_PRO`, `UPGRADE_*_TO_*`
- **Standalone**: `FRAMER_TEMPLATE_TRANSCEND`, `FRAMER_TEMPLATE_POWERSAAS`, `NEXTJS_TEMPLATE_SERENIA`

---

### nextbase_product_types_to_tier_map

Maps product combinations to resulting tiers.

```sql
CREATE TABLE nextbase_product_types_to_tier_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nextbase_tier_id UUID NOT NULL REFERENCES nextbase_tier_types(id) ON DELETE CASCADE,
    nextbase_product_type_ids UUID[] NOT NULL,  -- Array of product type IDs
    description TEXT,                            -- e.g., 'ESSENTIAL + UPGRADE_ESSENTIAL_TO_PRO'
    created_at TIMESTAMPTZ DEFAULT now()
);
```

**Example mappings:**
- `[NEXTBASE_ESSENTIAL]` → PERSONAL_ESSENTIAL
- `[NEXTBASE_ESSENTIAL, UPGRADE_ESSENTIAL_TO_PRO]` → PERSONAL_PRO
- `[NEXTBASE_PRO, UPGRADE_PRO_TO_BUSINESS_ULTIMATE]` → BUSINESS_ULTIMATE

---

## Billing Tables

### billing_products_catalogue

Central catalog of products across all payment providers.

```sql
CREATE TABLE billing_products_catalogue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider payment_provider NOT NULL,      -- 'stripe', 'lemonsqueezy', 'polar'
    product_id TEXT NOT NULL,                -- Provider's product ID
    price_id TEXT NOT NULL,                  -- Provider's price ID
    price_amount NUMERIC NOT NULL,           -- In cents (9900 = $99.00)
    price_currency TEXT DEFAULT 'usd',
    product_name TEXT,                       -- Human-readable name
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (provider, product_id, price_id)
);
```

---

### billing_price_to_nextbase_product_type_map

Links catalog prices to internal product types.

```sql
CREATE TABLE billing_price_to_nextbase_product_type_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    billing_products_catalogue_id UUID NOT NULL REFERENCES billing_products_catalogue(id) ON DELETE CASCADE,
    nextbase_product_type_id UUID NOT NULL REFERENCES nextbase_product_types(id) ON DELETE CASCADE,
    provider payment_provider_type,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (billing_products_catalogue_id, nextbase_product_type_id)
);
```

---

### billing_payments

Records of completed payments.

```sql
CREATE TABLE billing_payments (
    id TEXT PRIMARY KEY,                     -- Provider's transaction ID
    workspace_id UUID REFERENCES workspaces(id),
    billing_products_catalogue_id UUID NOT NULL REFERENCES billing_products_catalogue(id),
    amount NUMERIC(10,2),
    payment_date TIMESTAMPTZ,
    method TEXT,                             -- 'stripe', 'lemon_squeezy', 'polar'
    info JSONB,                              -- Provider-specific metadata
    status TEXT,                             -- 'paid', 'succeeded', 'pending', 'failed'
    currency TEXT,
    provider payment_provider_type
);
```

**Trigger:** `sync_workspace_tier_and_benefits_on_payment` - Updates tier and grants benefits on insert.

---

### billing_ls_customers

LemonSqueezy customer records.

```sql
CREATE TABLE billing_ls_customers (
    customer_id VARCHAR PRIMARY KEY,         -- LemonSqueezy customer ID
    workspace_id UUID REFERENCES workspaces(id)
);
```

---

### billing_polar_customers

Polar customer records.

```sql
CREATE TABLE billing_polar_customers (
    customer_id VARCHAR PRIMARY KEY,         -- Polar customer ID
    workspace_id UUID REFERENCES workspaces(id)
);
```

---

### billing_assets_access

Tracks asset access with invitation details.

```sql
CREATE TABLE billing_assets_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id),
    member_details JSONB,                    -- {"invitations": [...]}
    created_at TIMESTAMPTZ DEFAULT now(),
    asset_enum TEXT,                         -- Matches benefit_identifier
    UNIQUE (workspace_id, asset_enum)
);
```

**member_details structure:**
```json
{
  "invitations": [
    {
      "type": "github",
      "username": "alice_gh",
      "invited_at": "2024-01-15T10:35:00.000Z"
    },
    {
      "type": "framer",
      "email": "alice@example.com",
      "invited_at": "2024-01-15T10:40:00.000Z",
      "discount_code": "ALICE999008FAKE"
    }
  ]
}
```

---

## Benefits Tables

### available_benefits

Catalog of all available benefits.

```sql
CREATE TABLE available_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    benefit_identifier TEXT UNIQUE NOT NULL,  -- e.g., 'GITHUB_REPO_NEXTBASE_ESSENTIAL'
    name TEXT NOT NULL,
    description TEXT,
    benefit_type TEXT,                        -- 'github_repo', 'framer_template', 'digital_asset'
    status benefit_status DEFAULT 'active',
    metadata JSONB DEFAULT '{}',              -- Type-specific metadata
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Metadata by type:**
```sql
-- GitHub repo
'{"owner": "imbhargav5", "repo": "nextbase-essential"}'

-- Framer template
'{"variantId": "404953"}'

-- Digital asset
'{}'
```

---

### available_benefits_to_tiers

Maps benefits to tiers (many-to-many).

```sql
CREATE TABLE available_benefits_to_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    available_benefit_id UUID NOT NULL REFERENCES available_benefits(id) ON DELETE CASCADE,
    tier_id UUID NOT NULL REFERENCES nextbase_tier_types(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (available_benefit_id, tier_id)
);
```

---

### available_benefits_to_standalone_products

Maps benefits to standalone products.

```sql
CREATE TABLE available_benefits_to_standalone_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    available_benefit_id UUID NOT NULL REFERENCES available_benefits(id) ON DELETE CASCADE,
    product_type_id UUID NOT NULL REFERENCES nextbase_product_types(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (available_benefit_id, product_type_id)
);
```

---

## User & Workspace Tables

### auth.users (Supabase built-in)

```sql
-- Key columns for seed data
INSERT INTO "auth"."users" (
    "instance_id",           -- '00000000-0000-0000-0000-000000000000'
    "id",                    -- User UUID
    "aud",                   -- 'authenticated'
    "role",                  -- 'authenticated'
    "email",
    "encrypted_password",    -- bcrypt hash
    "email_confirmed_at",    -- NULL if unconfirmed
    "confirmation_token",
    "confirmation_sent_at",
    "recovery_token",
    "recovery_sent_at",
    "email_change_token_new",
    "email_change",
    "email_change_sent_at",
    "last_sign_in_at",
    "raw_app_meta_data",     -- '{"provider": "email", "providers": ["email"]}'
    "raw_user_meta_data",    -- '{}'
    "is_super_admin",        -- Set via make_user_app_admin()
    "created_at",
    "updated_at",
    "phone",
    "phone_confirmed_at",
    "phone_change",
    "phone_change_token",
    "phone_change_sent_at",
    "email_change_token_current",
    "email_change_confirm_status",  -- 0
    "banned_until",
    "reauthentication_token",
    "reauthentication_sent_at",
    "is_sso_user",           -- false
    "deleted_at",
    "is_anonymous"           -- false
);
```

**Trigger:** Creates `user_profiles` and `workspaces` rows automatically.

---

### user_profiles

```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR,
    avatar_url VARCHAR,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

**Note:** Created automatically by trigger on `auth.users` insert. Update `full_name` after user creation.

---

### workspaces

```sql
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR UNIQUE NOT NULL,            -- 'personal-{user_id}'
    name VARCHAR,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

**Note:** Personal workspace created automatically with slug `personal-{user_id}`.

---

### nextbase_workspace_tiers

Assigns tiers to workspaces.

```sql
CREATE TABLE nextbase_workspace_tiers (
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    tier_id UUID REFERENCES nextbase_tier_types(id) ON DELETE CASCADE,
    PRIMARY KEY (workspace_id)  -- One tier per workspace
);
```

---

## Key Functions

### make_user_app_admin

```sql
CREATE OR REPLACE FUNCTION make_user_app_admin(user_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE auth.users
    SET is_super_admin = true
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Usage:**
```sql
SELECT make_user_app_admin('00000000-0000-0000-0000-000000000001');
```

---

## Trigger Behaviors

### on_auth_user_created_create_profile
- **Fires:** AFTER INSERT on `auth.users`
- **Creates:** `user_profiles` row with matching `id`

### on_auth_user_created_create_workspace
- **Fires:** AFTER INSERT on `auth.users`
- **Creates:** `workspaces` row with slug `personal-{user_id}`
- **Creates:** `workspace_members` row with role `owner`

### sync_workspace_tier_and_benefits_on_payment
- **Fires:** AFTER INSERT on `billing_payments`
- **Actions:**
  1. Checks if product is standalone → grants standalone benefits
  2. Calls `refresh_workspace_tier()` → updates workspace tier
  3. Calls `backfill_benefits_for_workspace_by_tier()` → grants tier benefits
