# Milestone 1 — Tenancy Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a one-workspace-per-account tenancy layer (workspaces, members, roles) with RLS, a SECURITY DEFINER bootstrap RPC, a service-role Supabase client, and an onboarding flow.

**Architecture:** New `workspaces` + `workspace_members` tables guarded by RLS that keys off `auth.uid()` via `SECURITY DEFINER` helper functions (avoiding policy recursion). Workspace creation goes through a `create_workspace` RPC so member-insert policies can stay strict. A server-only service-role client is added for later milestones (ingestion, signed URLs).

**Tech Stack:** Supabase Postgres + RLS, pgTAP, Next.js server actions (`next-safe-action`), Vitest.

**Read first:** `2026-06-24-ybug-clone-overview.md` (shared conventions: commands, table/enum names, RLS helpers).

---

## File Structure

- Create: `apps/database/supabase/migrations/<ts>_create_workspaces_tables.sql` — `workspaces`, `workspace_members` tables, indexes, triggers, RLS enabled.
- Create: `apps/database/supabase/migrations/<ts>_create_workspaces_rls.sql` — helper functions, RLS policies, `create_workspace` RPC.
- Create: `apps/database/supabase/tests/workspaces_test.sql` — pgTAP schema + RLS tests.
- Create: `apps/web/src/supabase-clients/service-role.ts` — `createServiceRoleClient()`.
- Create: `apps/web/src/supabase-clients/__tests__/service-role.test.ts`.
- Create: `apps/web/src/data/user/workspaces.ts` — `getCurrentWorkspace()`, `requireCurrentWorkspace()`, `slugifyWorkspaceName()`, `createWorkspaceAction`.
- Create: `apps/web/src/data/user/__tests__/workspaces.test.ts`.
- Create: `apps/web/src/app/(app-pages)/onboarding/page.tsx` + `OnboardingForm.tsx`.
- Modify: `apps/web/src/supabase-clients/middleware.ts` — add new protected routes.
- Modify: `.env.local.example`, `.env.development.local.example`, `scripts/sync-supabase-env.ts` — add `SUPABASE_SERVICE_ROLE_KEY`.

---

## Task 1: Service-role Supabase client

**Files:**

- Create: `apps/web/src/supabase-clients/service-role.ts`
- Test: `apps/web/src/supabase-clients/__tests__/service-role.test.ts`
- Modify: `.env.local.example`, `.env.development.local.example`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/supabase-clients/__tests__/service-role.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createServiceRoleClient } from "../service-role";

describe("createServiceRoleClient", () => {
  const original = { ...process.env };
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
  });
  afterEach(() => {
    process.env = { ...original };
  });

  it("returns a client exposing a from() query builder", () => {
    const client = createServiceRoleClient();
    expect(typeof client.from).toBe("function");
  });

  it("throws when the service role key is missing", () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect(() => createServiceRoleClient()).toThrow(
      /SUPABASE_SERVICE_ROLE_KEY/
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && pnpm vitest run src/supabase-clients/__tests__/service-role.test.ts`
Expected: FAIL — `Cannot find module '../service-role'`.

- [ ] **Step 3: Write minimal implementation**

Create `apps/web/src/supabase-clients/service-role.ts`:

```ts
import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database.types";

/**
 * Privileged Supabase client that bypasses RLS. SERVER-ONLY.
 * Used by the anonymous ingestion path and for minting signed Storage URLs.
 * Never import this into client components.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/web && pnpm vitest run src/supabase-clients/__tests__/service-role.test.ts`
Expected: PASS (2 tests).

> Note: `'server-only'` throws if imported into a client bundle. In Vitest (node env) it is a no-op, so the test runs fine.

- [ ] **Step 5: Add the env var to both example files**

Append to `.env.local.example` and `.env.development.local.example`:

```
# Service role key (server-only; bypasses RLS). Get it from `supabase status` (service_role key) locally.
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

Then add the real local value to your actual `.env.local` (run `cd apps/database && supabase status` and copy the `service_role key`).

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/supabase-clients/service-role.ts apps/web/src/supabase-clients/__tests__/service-role.test.ts .env.local.example .env.development.local.example
git commit -m "feat(web): add server-only service-role supabase client"
```

---

## Task 2: `workspaces` + `workspace_members` tables

**Files:**

- Create: `apps/database/supabase/migrations/<ts>_create_workspaces_tables.sql`
- Test: `apps/database/supabase/tests/workspaces_test.sql`

- [ ] **Step 1: Write the failing test**

Create `apps/database/supabase/tests/workspaces_test.sql`:

```sql
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

SELECT plan(6);

-- Schema
SELECT has_table('public', 'workspaces', 'workspaces table exists');
SELECT has_table('public', 'workspace_members', 'workspace_members table exists');
SELECT col_type_is('public', 'workspaces', 'owner_id', 'uuid', 'workspaces.owner_id is uuid');
SELECT col_type_is('public', 'workspace_members', 'role', 'text', 'workspace_members.role is text');

-- RLS enabled
SELECT is(
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.workspaces'::regclass),
  true,
  'RLS enabled on workspaces'
);
SELECT is(
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.workspace_members'::regclass),
  true,
  'RLS enabled on workspace_members'
);

SELECT * FROM finish();
ROLLBACK;
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/database && supabase test db`
Expected: FAIL — `relation "public.workspaces" does not exist`.

- [ ] **Step 3: Create the migration**

Run: `cd apps/database && supabase migration new create_workspaces_tables`
Paste into the generated file:

```sql
-- workspaces: one per account owner
CREATE TABLE IF NOT EXISTS public.workspaces (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  owner_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.workspace_members (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (workspace_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON public.workspace_members (user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON public.workspace_members (workspace_id);

CREATE TRIGGER set_updated_at_workspaces
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_workspace_members
  BEFORE UPDATE ON public.workspace_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
```

- [ ] **Step 4: Apply and run the test**

Run: `cd apps/database && supabase db reset && supabase test db`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/database/supabase/migrations apps/database/supabase/tests/workspaces_test.sql
git commit -m "feat(db): add workspaces and workspace_members tables"
```

---

## Task 3: RLS helper functions

**Files:**

- Create: `apps/database/supabase/migrations/<ts>_create_workspaces_rls.sql` (helpers added here; policies + RPC appended in Tasks 4–5 of the SAME file)
- Test: `apps/database/supabase/tests/workspaces_test.sql` (extend)

> Because the RLS migration is one logical unit, Tasks 3–5 all write into the **same** new migration file. Create it once in this task, then append in Tasks 4 and 5.

- [ ] **Step 1: Extend the test**

In `apps/database/supabase/tests/workspaces_test.sql`, bump `SELECT plan(6);` to `SELECT plan(8);` and add before `SELECT * FROM finish();`:

```sql
SELECT has_function('public', 'is_workspace_member', ARRAY['uuid'], 'is_workspace_member(uuid) exists');
SELECT has_function('public', 'has_workspace_role', ARRAY['uuid', 'text[]'], 'has_workspace_role(uuid, text[]) exists');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/database && supabase test db`
Expected: FAIL — function `is_workspace_member` does not exist.

- [ ] **Step 3: Create the RLS migration with helper functions**

Run: `cd apps/database && supabase migration new create_workspaces_rls`
Paste into the generated file:

```sql
-- SECURITY DEFINER helpers: they run as the table owner, bypassing RLS on
-- workspace_members, which prevents infinite policy recursion.

CREATE OR REPLACE FUNCTION public.is_workspace_member(p_workspace_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members m
    WHERE m.workspace_id = p_workspace_id
      AND m.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.current_workspace_role(p_workspace_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
STABLE
AS $$
  SELECT m.role FROM public.workspace_members m
  WHERE m.workspace_id = p_workspace_id
    AND m.user_id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_workspace_role(p_workspace_id uuid, p_roles text[])
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members m
    WHERE m.workspace_id = p_workspace_id
      AND m.user_id = auth.uid()
      AND m.role = ANY (p_roles)
  );
$$;
```

- [ ] **Step 4: Apply and run the test**

Run: `cd apps/database && supabase db reset && supabase test db`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/database/supabase/migrations apps/database/supabase/tests/workspaces_test.sql
git commit -m "feat(db): add workspace RLS helper functions"
```

---

## Task 4: RLS policies + cross-workspace isolation tests

**Files:**

- Modify: the `<ts>_create_workspaces_rls.sql` file from Task 3 (append)
- Test: `apps/database/supabase/tests/workspaces_test.sql` (extend)

- [ ] **Step 1: Extend the test with isolation cases**

Replace the `SELECT plan(8);` line with `SELECT plan(12);`. Add before `SELECT * FROM finish();`:

```sql
-- Seed two users + two workspaces (as superuser, bypassing RLS)
INSERT INTO auth.users (id, email) VALUES
  ('11111111-1111-1111-1111-111111111111', 'owner-a@test.com'),
  ('22222222-2222-2222-2222-222222222222', 'owner-b@test.com');

INSERT INTO public.workspaces (id, name, slug, owner_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Workspace A', 'ws-a', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Workspace B', 'ws-b', '22222222-2222-2222-2222-222222222222');

INSERT INTO public.workspace_members (workspace_id, user_id, role) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'owner');

-- Act as user A
SET LOCAL role authenticated;
SET LOCAL request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';

SELECT results_eq(
  'SELECT count(*) FROM public.workspaces',
  ARRAY[1::bigint],
  'User A sees only their own workspace'
);

SELECT is(
  (SELECT name FROM public.workspaces LIMIT 1),
  'Workspace A',
  'User A sees Workspace A'
);

SELECT is(
  public.is_workspace_member('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  false,
  'User A is not a member of Workspace B'
);

SELECT throws_ok(
  $$ UPDATE public.workspaces SET name = 'Hacked' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' RETURNING 1 $$,
  NULL,
  NULL,
  'User A cannot update Workspace B (RLS blocks; 0 rows / no error path)'
);
```

> If `throws_ok` is awkward for a 0-row UPDATE (RLS yields 0 rows, not an error), use this instead for the 12th test:
>
> ```sql
> SELECT results_eq(
>   $$ WITH u AS (UPDATE public.workspaces SET name = 'Hacked'
>        WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' RETURNING 1)
>      SELECT count(*) FROM u $$,
>   ARRAY[0::bigint],
>   'User A cannot update Workspace B (0 rows affected)'
> );
> ```
>
> Use the `results_eq` 0-rows variant; keep `plan(12)`.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/database && supabase test db`
Expected: FAIL — without policies, RLS denies all so user A sees 0 workspaces (count mismatch) — confirms tests exercise the missing policies.

- [ ] **Step 3: Append policies to the RLS migration**

Append to `<ts>_create_workspaces_rls.sql`:

```sql
-- workspaces policies (no INSERT policy: creation goes through create_workspace RPC)
CREATE POLICY workspaces_select ON public.workspaces
  FOR SELECT USING (public.is_workspace_member(id));
CREATE POLICY workspaces_update ON public.workspaces
  FOR UPDATE USING (public.has_workspace_role(id, ARRAY['owner', 'admin']))
  WITH CHECK (public.has_workspace_role(id, ARRAY['owner', 'admin']));
CREATE POLICY workspaces_delete ON public.workspaces
  FOR DELETE USING (public.has_workspace_role(id, ARRAY['owner']));

-- workspace_members policies
CREATE POLICY members_select ON public.workspace_members
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY members_insert ON public.workspace_members
  FOR INSERT WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));
CREATE POLICY members_update ON public.workspace_members
  FOR UPDATE USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']))
  WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));
CREATE POLICY members_delete ON public.workspace_members
  FOR DELETE USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));
```

- [ ] **Step 4: Apply and run the test**

Run: `cd apps/database && supabase db reset && supabase test db`
Expected: PASS (12 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/database/supabase/migrations apps/database/supabase/tests/workspaces_test.sql
git commit -m "feat(db): add workspace and member RLS policies"
```

---

## Task 5: `create_workspace` bootstrap RPC

**Files:**

- Modify: the `<ts>_create_workspaces_rls.sql` file (append)
- Test: `apps/database/supabase/tests/workspaces_test.sql` (extend)

- [ ] **Step 1: Extend the test**

Change `SELECT plan(12);` to `SELECT plan(14);`. Add before `SELECT * FROM finish();` (still acting as user A):

```sql
SELECT lives_ok(
  $$ SELECT public.create_workspace('Second WS', 'second-ws') $$,
  'User A can create a workspace via RPC'
);

SELECT results_eq(
  $$ SELECT count(*) FROM public.workspace_members
     WHERE user_id = '11111111-1111-1111-1111-111111111111' AND role = 'owner' $$,
  ARRAY[2::bigint],
  'create_workspace inserts an owner membership for the caller'
);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/database && supabase test db`
Expected: FAIL — function `create_workspace` does not exist.

- [ ] **Step 3: Append the RPC**

Append to `<ts>_create_workspaces_rls.sql`:

```sql
CREATE OR REPLACE FUNCTION public.create_workspace(p_name text, p_slug text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_workspace_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.workspaces (name, slug, owner_id)
  VALUES (p_name, p_slug, v_user_id)
  RETURNING id INTO v_workspace_id;

  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (v_workspace_id, v_user_id, 'owner');

  RETURN v_workspace_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_workspace(text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.create_workspace(text, text) TO authenticated;
```

- [ ] **Step 4: Apply and run the test**

Run: `cd apps/database && supabase db reset && supabase test db`
Expected: PASS (14 tests).

- [ ] **Step 5: Regenerate DB types**

Run:

```bash
cd apps/database && supabase gen types typescript --local > ../web/src/lib/database.types.ts
```

Expected: `apps/web/src/lib/database.types.ts` now includes `workspaces`, `workspace_members`, and the `create_workspace` function in `Database['public']['Functions']`.

- [ ] **Step 6: Commit**

```bash
git add apps/database/supabase/migrations apps/database/supabase/tests/workspaces_test.sql apps/web/src/lib/database.types.ts
git commit -m "feat(db): add create_workspace bootstrap RPC and regenerate types"
```

---

## Task 6: Workspace data layer + create action

**Files:**

- Create: `apps/web/src/data/user/workspaces.ts`
- Test: `apps/web/src/data/user/__tests__/workspaces.test.ts`

- [ ] **Step 1: Write the failing test (pure helper)**

Create `apps/web/src/data/user/__tests__/workspaces.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { slugifyWorkspaceName } from "../workspaces";

describe("slugifyWorkspaceName", () => {
  it("lowercases and hyphenates", () => {
    expect(slugifyWorkspaceName("My Cool Team")).toBe("my-cool-team");
  });
  it("strips punctuation and collapses separators", () => {
    expect(slugifyWorkspaceName("  Acme, Inc.!! ")).toBe("acme-inc");
  });
  it('falls back to "workspace" when empty after cleaning', () => {
    expect(slugifyWorkspaceName("!!!")).toBe("workspace");
  });
  it("truncates to 40 chars", () => {
    expect(slugifyWorkspaceName("a".repeat(60)).length).toBe(40);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && pnpm vitest run src/data/user/__tests__/workspaces.test.ts`
Expected: FAIL — `Cannot find module '../workspaces'`.

- [ ] **Step 3: Implement the data module**

Create `apps/web/src/data/user/workspaces.ts`:

```ts
"use server";

import { authActionClient } from "@/lib/safe-action";
import { createSupabaseClient } from "@/supabase-clients/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function slugifyWorkspaceName(name: string): Promise<string> {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base.length > 0 ? base : "workspace";
}

export async function getCurrentWorkspace() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("workspace_members")
    .select("role, workspace:workspaces(*)")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data; // { role, workspace } | null
}

export async function requireCurrentWorkspace() {
  const membership = await getCurrentWorkspace();
  if (!membership?.workspace) {
    redirect("/onboarding");
  }
  return membership;
}

const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
});

export const createWorkspaceAction = authActionClient
  .schema(createWorkspaceSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createSupabaseClient();
    const slug = `${await slugifyWorkspaceName(
      parsedInput.name
    )}-${Math.random().toString(36).slice(2, 8)}`;
    const { data, error } = await supabase.rpc("create_workspace", {
      p_name: parsedInput.name,
      p_slug: slug,
    });
    if (error) {
      throw new Error(error.message);
    }
    revalidatePath("/", "layout");
    return { workspaceId: data as string };
  });
```

> Note: this file is `'use server'`, so every export must be async — that is why `slugifyWorkspaceName` is async. The test awaits it via `expect(...).toBe` on the resolved value; update the test to `await` if needed:
>
> ```ts
> expect(await slugifyWorkspaceName("My Cool Team")).toBe("my-cool-team");
> ```
>
> Apply `await` to all four assertions.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/web && pnpm vitest run src/data/user/__tests__/workspaces.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/data/user/workspaces.ts apps/web/src/data/user/__tests__/workspaces.test.ts
git commit -m "feat(web): add workspace data layer and create action"
```

---

## Task 7: Onboarding page + form

**Files:**

- Create: `apps/web/src/app/(app-pages)/onboarding/page.tsx`
- Create: `apps/web/src/app/(app-pages)/onboarding/OnboardingForm.tsx`

- [ ] **Step 1: Create the server page (redirect if a workspace already exists)**

Create `apps/web/src/app/(app-pages)/onboarding/page.tsx`:

```tsx
import { getCurrentWorkspace } from "@/data/user/workspaces";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./OnboardingForm";

export default async function OnboardingPage() {
  const membership = await getCurrentWorkspace();
  if (membership?.workspace) {
    redirect("/dashboard");
  }
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      <OnboardingForm />
    </div>
  );
}
```

- [ ] **Step 2: Create the client form**

Create `apps/web/src/app/(app-pages)/onboarding/OnboardingForm.tsx`:

```tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { createWorkspaceAction } from "@/data/user/workspaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
});
type FormData = z.infer<typeof formSchema>;

export function OnboardingForm() {
  const router = useRouter();
  const toastRef = useRef<string | number | undefined>(undefined);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: { name: "" },
  });

  const { execute, status } = useAction(createWorkspaceAction, {
    onExecute: () => {
      toastRef.current = toast.loading("Creating workspace");
    },
    onSuccess: () => {
      toast.success("Workspace created", { id: toastRef.current });
      router.push("/dashboard");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to create workspace", {
        id: toastRef.current,
      });
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your workspace</CardTitle>
        <CardDescription>
          A workspace holds your projects, feedback, and teammates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => execute(data))}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={status === "executing" || !form.formState.isValid}
            >
              {status === "executing" ? (
                <Spinner className="h-4 w-4" />
              ) : (
                "Create workspace"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Protect the new routes in middleware**

In `apps/web/src/supabase-clients/middleware.ts`, update the `protectedPages` array:

```ts
const protectedPages = [
  "/dashboard",
  "/onboarding",
  "/projects",
  "/inbox",
  "/members",
  "/settings",
  "/private-item",
  "/private-items",
  "/items",
  "/item",
];
```

- [ ] **Step 4: Manual verification**

Run: `pnpm web#dev`, then:

1. Sign up / log in as a fresh user.
2. Visit `/onboarding` → submit a name → expect redirect to `/dashboard`.
3. Revisit `/onboarding` → expect auto-redirect to `/dashboard` (workspace already exists).

Run typecheck/lint: `pnpm typecheck && pnpm lint` → Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/'(app-pages)'/onboarding apps/web/src/supabase-clients/middleware.ts
git commit -m "feat(web): add workspace onboarding flow and protect routes"
```

---

## Self-check (end of milestone)

- [ ] `cd apps/database && supabase test db` → all workspace tests pass.
- [ ] `pnpm --filter web test` → service-role + workspaces unit tests pass.
- [ ] `pnpm typecheck && pnpm lint` → clean.
- [ ] A fresh user is funneled through `/onboarding` and lands in the app with an owner membership.

**Carried forward / deferred:** Removing the `private_items` demo and switching the post-login landing page happens once the inbox exists (M5) and during cleanup (M7). The `requireCurrentWorkspace()` helper is wired into pages as they are built in later milestones.
