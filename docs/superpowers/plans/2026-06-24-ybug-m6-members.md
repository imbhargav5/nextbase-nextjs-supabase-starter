# Milestone 6 — Members & Invitations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let owners/admins manage workspace members (view, change role, remove) and invite teammates via copyable invite links (no email provider in v1). New users accept an invite link to join.

**Architecture:** A `workspace_invitations` table with admin-only RLS. Acceptance and preview go through `SECURITY DEFINER` RPCs (`accept_invitation`, `get_invitation_preview`) so a not-yet-member can join atomically without broad table access. App-level guards prevent removing/demoting the last owner.

> **Security follow-up carried from the M1 review (Tasks 3-5 code review):** the last-owner / role-escalation guards in this milestone are enforced at the **application layer** (`authActionClient`). Because `workspace_members` is also reachable via PostgREST under RLS, an `admin` could in principle bypass these guards by calling the REST API directly (e.g. self-promote to `owner`, or delete the owner's membership). For MVP this is accepted (admins are explicitly promoted, trusted teammates). A hardening follow-up should enforce owner-immutability and "at least one owner" at the **DB layer** — either via a trigger/constraint on `workspace_members`, or by routing all role/removal mutations through `SECURITY DEFINER` RPCs and tightening the `members_update`/`members_delete` policies. Add pgTAP coverage for: admin cannot self-promote to owner, and the last owner cannot be removed/demoted.

**Tech Stack:** Supabase + RLS, pgTAP, Next.js server actions, shadcn/ui, Vitest.

**Prereq:** M5 complete (uses the `get_workspace_members` RPC from M5). **Read:** `2026-06-24-ybug-clone-overview.md`.

---

## File Structure

- Create: `apps/database/supabase/migrations/<ts>_create_workspace_invitations.sql`
- Create: `apps/database/supabase/migrations/<ts>_create_invitation_rpcs.sql`
- Create: `apps/database/supabase/tests/invitations_test.sql`
- Create: `apps/web/src/utils/tokens.ts` (+ test) — `generateToken()`
- Create: `apps/web/src/data/user/members.ts` — member + invitation queries/actions
- Create: `apps/web/src/app/(app-pages)/members/page.tsx` + `members-client.tsx`
- Create: `apps/web/src/app/(app-pages)/invite/[token]/page.tsx` + `accept-invite-client.tsx`
- Create: `apps/web/src/app/(app-pages)/settings/page.tsx` + `workspace-settings-form.tsx`; add `updateWorkspaceAction` to `apps/web/src/data/user/workspaces.ts`
- Modify: `apps/web/src/supabase-clients/middleware.ts` — add `/invite` is NOT protected (public accept entry; but it requires login to accept — keep `/members` protected, leave `/invite` accessible and handle auth in the page)
- Modify: `apps/web/src/app/(app-pages)/app-sidebar-client.tsx` — add "Members" link

> Note: `/invite/[token]` must be reachable by a logged-out invitee so they can be sent to login and back. Do not add `/invite` to `protectedPages`; the page itself redirects to `/login?next=/invite/<token>` when there is no session.

---

## Task 1: `workspace_invitations` table + RLS

**Files:**
- Create: `apps/database/supabase/migrations/<ts>_create_workspace_invitations.sql`
- Test: `apps/database/supabase/tests/invitations_test.sql`

- [ ] **Step 1: Write the failing test**

Create `apps/database/supabase/tests/invitations_test.sql`:

```sql
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

SELECT plan(4);

SELECT has_table('public', 'workspace_invitations', 'workspace_invitations table exists');
SELECT col_type_is('public', 'workspace_invitations', 'token', 'text', 'token is text');

-- Seed an owner + workspace
INSERT INTO auth.users (id, email) VALUES
  ('88888888-8888-8888-8888-888888888888', 'admin@p.com'),
  ('99999999-9999-9999-9999-999999999999', 'outsider@p.com');
INSERT INTO public.workspaces (id, name, slug, owner_id) VALUES
  ('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3', 'WS I', 'ws-i', '88888888-8888-8888-8888-888888888888');
INSERT INTO public.workspace_members (workspace_id, user_id, role) VALUES
  ('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3', '88888888-8888-8888-8888-888888888888', 'owner');

-- Admin can create an invitation
SET LOCAL role authenticated;
SET LOCAL request.jwt.claim.sub = '88888888-8888-8888-8888-888888888888';
SELECT lives_ok(
  $$ INSERT INTO public.workspace_invitations (workspace_id, email, role, token, expires_at)
     VALUES ('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3', 'new@p.com', 'member', 'inv_test', now() + interval '7 days') $$,
  'admin can create an invitation'
);

-- A non-member cannot see invitations
SET LOCAL request.jwt.claim.sub = '99999999-9999-9999-9999-999999999999';
SELECT results_eq(
  'SELECT count(*) FROM public.workspace_invitations',
  ARRAY[0::bigint],
  'non-member cannot read invitations'
);

SELECT * FROM finish();
ROLLBACK;
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/database && supabase test db`
Expected: FAIL — `relation "public.workspace_invitations" does not exist`.

- [ ] **Step 3: Create the migration**

Run: `cd apps/database && supabase migration new create_workspace_invitations`
Paste:

```sql
CREATE TABLE IF NOT EXISTS public.workspace_invitations (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  token text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked')),
  invited_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_workspace_invitations_workspace_id ON public.workspace_invitations (workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_invitations_token ON public.workspace_invitations (token);

CREATE TRIGGER set_updated_at_workspace_invitations
  BEFORE UPDATE ON public.workspace_invitations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.workspace_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY invitations_select ON public.workspace_invitations
  FOR SELECT USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));
CREATE POLICY invitations_insert ON public.workspace_invitations
  FOR INSERT WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));
CREATE POLICY invitations_update ON public.workspace_invitations
  FOR UPDATE USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']))
  WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));
CREATE POLICY invitations_delete ON public.workspace_invitations
  FOR DELETE USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));
```

- [ ] **Step 4: Apply and run the test**

Run: `cd apps/database && supabase db reset && supabase test db`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/database/supabase/migrations apps/database/supabase/tests/invitations_test.sql
git commit -m "feat(db): add workspace_invitations with admin-only RLS"
```

---

## Task 2: `accept_invitation` + `get_invitation_preview` RPCs

**Files:**
- Create: `apps/database/supabase/migrations/<ts>_create_invitation_rpcs.sql`
- Test: `apps/database/supabase/tests/invitations_test.sql` (extend)

- [ ] **Step 1: Extend the test**

Change `SELECT plan(4);` to `SELECT plan(6);`. Add before `SELECT * FROM finish();`:

```sql
-- Outsider accepts the pending invitation created earlier (token 'inv_test')
SET LOCAL request.jwt.claim.sub = '99999999-9999-9999-9999-999999999999';
SELECT lives_ok(
  $$ SELECT public.accept_invitation('inv_test') $$,
  'invitee can accept a valid invitation'
);
SELECT results_eq(
  $$ SELECT count(*) FROM public.workspace_members
     WHERE workspace_id = 'f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3'
       AND user_id = '99999999-9999-9999-9999-999999999999' $$,
  ARRAY[1::bigint],
  'accepting an invitation creates a membership'
);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/database && supabase test db`
Expected: FAIL — function `accept_invitation` does not exist.

- [ ] **Step 3: Create the migration**

Run: `cd apps/database && supabase migration new create_invitation_rpcs`
Paste:

```sql
CREATE OR REPLACE FUNCTION public.accept_invitation(p_token text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_inv public.workspace_invitations;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_inv
  FROM public.workspace_invitations
  WHERE token = p_token AND status = 'pending' AND expires_at > now();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation invalid or expired';
  END IF;

  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (v_inv.workspace_id, v_user_id, v_inv.role)
  ON CONFLICT (workspace_id, user_id) DO NOTHING;

  UPDATE public.workspace_invitations SET status = 'accepted' WHERE id = v_inv.id;
  RETURN v_inv.workspace_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_invitation_preview(p_token text)
RETURNS TABLE (workspace_name text, role text, valid boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
STABLE
AS $$
BEGIN
  RETURN QUERY
    SELECT w.name,
           i.role,
           (i.status = 'pending' AND i.expires_at > now()) AS valid
    FROM public.workspace_invitations i
    JOIN public.workspaces w ON w.id = i.workspace_id
    WHERE i.token = p_token
    LIMIT 1;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.accept_invitation(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.accept_invitation(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_invitation_preview(text) TO authenticated;
```

- [ ] **Step 4: Apply and run the test**

Run: `cd apps/database && supabase db reset && supabase test db`
Expected: PASS (6 tests).

- [ ] **Step 5: Regenerate types + commit**

```bash
cd apps/database && supabase gen types typescript --local > ../web/src/lib/database.types.ts
cd ../..
git add apps/database/supabase/migrations apps/database/supabase/tests/invitations_test.sql apps/web/src/lib/database.types.ts
git commit -m "feat(db): add accept_invitation and preview rpcs"
```

---

## Task 3: Token generator

**Files:**
- Create: `apps/web/src/utils/tokens.ts`
- Test: `apps/web/src/utils/__tests__/tokens.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/utils/__tests__/tokens.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { generateToken } from '../tokens';

describe('generateToken', () => {
  it('uses the given prefix', () => {
    expect(generateToken('inv').startsWith('inv_')).toBe(true);
  });
  it('produces url-safe, unique values', () => {
    const a = generateToken('inv');
    const b = generateToken('inv');
    expect(a).toMatch(/^inv_[A-Za-z0-9_-]+$/);
    expect(a).not.toBe(b);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && pnpm vitest run src/utils/__tests__/tokens.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

Create `apps/web/src/utils/tokens.ts`:

```ts
/** Generates a random url-safe token like `inv_xxx`. */
export function generateToken(prefix: string): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  const base64Url = btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `${prefix}_${base64Url}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/web && pnpm vitest run src/utils/__tests__/tokens.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/utils/tokens.ts apps/web/src/utils/__tests__/tokens.test.ts
git commit -m "feat(web): add url-safe token generator"
```

---

## Task 4: Members data layer

**Files:**
- Create: `apps/web/src/data/user/members.ts`

- [ ] **Step 1: Implement**

Create `apps/web/src/data/user/members.ts`:

```ts
'use server';

import { authActionClient } from '@/lib/safe-action';
import { requireCurrentWorkspace } from '@/data/user/workspaces';
import { createSupabaseClient } from '@/supabase-clients/server';
import { generateToken } from '@/utils/tokens';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function getMembers() {
  const membership = await requireCurrentWorkspace();
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.rpc('get_workspace_members', {
    p_workspace_id: membership.workspace!.id,
  });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPendingInvitations() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('workspace_invitations')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'member']),
});
export const createInvitationAction = authActionClient
  .schema(inviteSchema)
  .action(async ({ parsedInput, ctx }) => {
    const membership = await requireCurrentWorkspace();
    const supabase = await createSupabaseClient();
    const token = generateToken('inv');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase.from('workspace_invitations').insert({
      workspace_id: membership.workspace!.id,
      email: parsedInput.email,
      role: parsedInput.role,
      token,
      invited_by: ctx.userId,
      expires_at: expiresAt,
    });
    if (error) throw new Error(error.message);
    revalidatePath('/members');
    return { token };
  });

const revokeSchema = z.object({ invitationId: z.string().uuid() });
export const revokeInvitationAction = authActionClient
  .schema(revokeSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createSupabaseClient();
    const { error } = await supabase
      .from('workspace_invitations')
      .update({ status: 'revoked' })
      .eq('id', parsedInput.invitationId);
    if (error) throw new Error(error.message);
    revalidatePath('/members');
    return { success: true };
  });

const updateRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['owner', 'admin', 'member']),
});
export const updateMemberRoleAction = authActionClient
  .schema(updateRoleSchema)
  .action(async ({ parsedInput }) => {
    const membership = await requireCurrentWorkspace();
    const supabase = await createSupabaseClient();
    const workspaceId = membership.workspace!.id;

    // Guard: never leave the workspace without an owner.
    if (parsedInput.role !== 'owner') {
      const { data: owners } = await supabase
        .from('workspace_members')
        .select('user_id')
        .eq('workspace_id', workspaceId)
        .eq('role', 'owner');
      if ((owners ?? []).length === 1 && owners![0].user_id === parsedInput.userId) {
        throw new Error('A workspace must have at least one owner');
      }
    }

    const { error } = await supabase
      .from('workspace_members')
      .update({ role: parsedInput.role })
      .eq('workspace_id', workspaceId)
      .eq('user_id', parsedInput.userId);
    if (error) throw new Error(error.message);
    revalidatePath('/members');
    return { success: true };
  });

const removeMemberSchema = z.object({ userId: z.string().uuid() });
export const removeMemberAction = authActionClient
  .schema(removeMemberSchema)
  .action(async ({ parsedInput }) => {
    const membership = await requireCurrentWorkspace();
    const supabase = await createSupabaseClient();
    const workspaceId = membership.workspace!.id;

    const { data: owners } = await supabase
      .from('workspace_members')
      .select('user_id')
      .eq('workspace_id', workspaceId)
      .eq('role', 'owner');
    if ((owners ?? []).some((o) => o.user_id === parsedInput.userId) && (owners ?? []).length === 1) {
      throw new Error('Cannot remove the last owner');
    }

    const { error } = await supabase
      .from('workspace_members')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('user_id', parsedInput.userId);
    if (error) throw new Error(error.message);
    revalidatePath('/members');
    return { success: true };
  });

const acceptSchema = z.object({ token: z.string().min(1) });
export const acceptInvitationAction = authActionClient
  .schema(acceptSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase.rpc('accept_invitation', {
      p_token: parsedInput.token,
    });
    if (error) throw new Error(error.message);
    revalidatePath('/', 'layout');
    return { workspaceId: data as string };
  });
```

- [ ] **Step 2: Typecheck + commit**

Run: `cd apps/web && pnpm tsc --noEmit` → clean.

```bash
git add apps/web/src/data/user/members.ts
git commit -m "feat(web): add members and invitations data layer"
```

---

## Task 5: Members page

**Files:**
- Create: `apps/web/src/app/(app-pages)/members/page.tsx`
- Create: `apps/web/src/app/(app-pages)/members/members-client.tsx`
- Modify: `apps/web/src/app/(app-pages)/app-sidebar-client.tsx`

- [ ] **Step 1: Server page**

Create `apps/web/src/app/(app-pages)/members/page.tsx`:

```tsx
import { requireCurrentWorkspace } from '@/data/user/workspaces';
import { getMembers, getPendingInvitations } from '@/data/user/members';
import { headers } from 'next/headers';
import { MembersClient } from './members-client';

export default async function MembersPage() {
  const membership = await requireCurrentWorkspace();
  const [members, invitations] = await Promise.all([
    getMembers(),
    getPendingInvitations(),
  ]);
  const headerList = await headers();
  const host = headerList.get('host') ?? 'localhost:3000';
  const origin = `${host.startsWith('localhost') ? 'http' : 'https'}://${host}`;
  const canManage = membership.role === 'owner' || membership.role === 'admin';

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Members</h1>
      <MembersClient
        members={members}
        invitations={invitations}
        origin={origin}
        canManage={canManage}
      />
    </div>
  );
}
```

- [ ] **Step 2: Client**

Create `apps/web/src/app/(app-pages)/members/members-client.tsx`:

```tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  createInvitationAction,
  removeMemberAction,
  revokeInvitationAction,
  updateMemberRoleAction,
} from '@/data/user/members';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Member = { user_id: string; email: string; role: string };
type Invitation = { id: string; email: string; role: string; token: string };

export function MembersClient({
  members,
  invitations,
  origin,
  canManage,
}: {
  members: Member[];
  invitations: Invitation[];
  origin: string;
  canManage: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');

  const refresh = () => router.refresh();
  const invite = useAction(createInvitationAction, {
    onSuccess: ({ data }) => {
      if (data?.token) {
        navigator.clipboard.writeText(`${origin}/invite/${data.token}`);
        toast.success('Invite link copied to clipboard');
      }
      setEmail('');
      refresh();
    },
    onError: ({ error }) => toast.error(error.serverError ?? 'Failed'),
  });
  const revoke = useAction(revokeInvitationAction, { onSuccess: refresh });
  const updateRole = useAction(updateMemberRoleAction, {
    onSuccess: refresh,
    onError: ({ error }) => toast.error(error.serverError ?? 'Failed'),
  });
  const remove = useAction(removeMemberAction, {
    onSuccess: refresh,
    onError: ({ error }) => toast.error(error.serverError ?? 'Failed'),
  });

  return (
    <div className="space-y-6">
      {canManage && (
        <Card>
          <CardHeader><CardTitle>Invite a teammate</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap items-end gap-2">
            <Input
              placeholder="teammate@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-xs"
            />
            <Select value={role} onValueChange={(v) => setRole(v as 'admin' | 'member')}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button
              disabled={invite.status === 'executing' || !email.includes('@')}
              onClick={() => invite.execute({ email, role })}
            >
              Generate invite link
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Current members</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {members.map((m) => (
            <div key={m.user_id} className="flex items-center justify-between gap-2">
              <span>{m.email}</span>
              {canManage ? (
                <div className="flex items-center gap-2">
                  <Select
                    value={m.role}
                    onValueChange={(v) =>
                      updateRole.execute({
                        userId: m.user_id,
                        role: v as 'owner' | 'admin' | 'member',
                      })
                    }
                  >
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove.execute({ userId: m.user_id })}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">{m.role}</span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {canManage && invitations.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Pending invitations</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {invitations.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between gap-2">
                <span>{inv.email} ({inv.role})</span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`${origin}/invite/${inv.token}`);
                      toast.success('Invite link copied');
                    }}
                  >
                    Copy link
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => revoke.execute({ invitationId: inv.id })}
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Sidebar link**

In `app-sidebar-client.tsx`, add `Users` to the `lucide-react` import and add a Members entry to the `navigationItems` array:

```tsx
import { ChevronUp, FolderKanban, Home, Inbox, Lock, LogOut, Settings, Users } from "lucide-react";

// add to navigationItems (after Projects):
  { title: 'Members', url: '/members', icon: Users },
```

- [ ] **Step 4: Verify + commit**

Run `pnpm web#dev` → `/members` shows current members; generating an invite copies a link; revoking works; role change + remove respect the last-owner guard.

```bash
git add apps/web/src/app/'(app-pages)'/members apps/web/src/app/'(app-pages)'/app-sidebar-client.tsx
git commit -m "feat(web): add members management and invite-by-link UI"
```

---

## Task 6: Invite acceptance page

**Files:**
- Create: `apps/web/src/app/(app-pages)/invite/[token]/page.tsx`
- Create: `apps/web/src/app/(app-pages)/invite/[token]/accept-invite-client.tsx`

> This route lives in `(app-pages)` for layout, but `/invite` is intentionally NOT in `protectedPages`. The page checks the session itself and redirects logged-out users to login with a `next` back to the invite.

- [ ] **Step 1: Server page**

Create `apps/web/src/app/(app-pages)/invite/[token]/page.tsx`:

```tsx
import { getCachedIsUserLoggedIn } from '@/rsc-data/supabase';
import { createSupabaseClient } from '@/supabase-clients/server';
import { redirect } from 'next/navigation';
import { AcceptInviteClient } from './accept-invite-client';

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const isLoggedIn = await getCachedIsUserLoggedIn().catch(() => false);
  if (!isLoggedIn) {
    redirect(`/login?next=${encodeURIComponent(`/invite/${token}`)}`);
  }

  const supabase = await createSupabaseClient();
  const { data } = await supabase.rpc('get_invitation_preview', { p_token: token });
  const preview = data?.[0] ?? null;

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <AcceptInviteClient token={token} preview={preview} />
    </div>
  );
}
```

- [ ] **Step 2: Client**

Create `apps/web/src/app/(app-pages)/invite/[token]/accept-invite-client.tsx`:

```tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { acceptInvitationAction } from '@/data/user/members';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Preview = { workspace_name: string; role: string; valid: boolean } | null;

export function AcceptInviteClient({ token, preview }: { token: string; preview: Preview }) {
  const router = useRouter();
  const accept = useAction(acceptInvitationAction, {
    onSuccess: () => {
      toast.success('Joined workspace');
      router.push('/inbox');
      router.refresh();
    },
    onError: ({ error }) => toast.error(error.serverError ?? 'Could not accept invite'),
  });

  if (!preview || !preview.valid) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Invitation unavailable</CardTitle>
          <CardDescription>This invite link is invalid, expired, or already used.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Join {preview.workspace_name}</CardTitle>
        <CardDescription>You were invited as {preview.role}.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          disabled={accept.status === 'executing'}
          onClick={() => accept.execute({ token })}
        >
          Accept invitation
        </Button>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Verify**

1. As an admin, generate an invite link on `/members`.
2. Open the link in a separate browser/profile logged in as a different user → see the workspace name → Accept → land on `/inbox` as a member.
3. Revoked/expired tokens show "Invitation unavailable".

Run `pnpm typecheck && pnpm lint`.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/'(app-pages)'/invite
git commit -m "feat(web): add invite acceptance page"
```

---

## Task 7: Workspace settings page (rename)

**Files:**
- Modify: `apps/web/src/data/user/workspaces.ts` — add `updateWorkspaceAction`
- Create: `apps/web/src/app/(app-pages)/settings/page.tsx`
- Create: `apps/web/src/app/(app-pages)/settings/workspace-settings-form.tsx`
- Modify: `apps/web/src/app/(app-pages)/app-sidebar-client.tsx` — add "Settings" link

- [ ] **Step 1: Add the rename action**

Append to `apps/web/src/data/user/workspaces.ts` (this file is already `'use server'`):

```ts
const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(80),
});

export const updateWorkspaceAction = authActionClient
  .schema(updateWorkspaceSchema)
  .action(async ({ parsedInput }) => {
    const membership = await requireCurrentWorkspace();
    const supabase = await createSupabaseClient();
    const { error } = await supabase
      .from('workspaces')
      .update({ name: parsedInput.name })
      .eq('id', membership.workspace!.id);
    if (error) {
      throw new Error(error.message);
    }
    revalidatePath('/', 'layout');
    return { success: true };
  });
```

> The RLS `workspaces_update` policy already restricts this to `owner`/`admin`; a non-admin call simply updates 0 rows.

- [ ] **Step 2: Server page**

Create `apps/web/src/app/(app-pages)/settings/page.tsx`:

```tsx
import { requireCurrentWorkspace } from '@/data/user/workspaces';
import { WorkspaceSettingsForm } from './workspace-settings-form';

export default async function SettingsPage() {
  const membership = await requireCurrentWorkspace();
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-xl">
      <h1 className="text-2xl font-semibold">Workspace settings</h1>
      <WorkspaceSettingsForm
        name={membership.workspace!.name}
        slug={membership.workspace!.slug}
      />
    </div>
  );
}
```

- [ ] **Step 3: Settings form**

Create `apps/web/src/app/(app-pages)/settings/workspace-settings-form.tsx`:

```tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateWorkspaceAction } from '@/data/user/workspaces';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function WorkspaceSettingsForm({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(name);
  const { execute, status } = useAction(updateWorkspaceAction, {
    onSuccess: () => {
      toast.success('Workspace updated');
      router.refresh();
    },
    onError: ({ error }) => toast.error(error.serverError ?? 'Failed'),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>General</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Workspace name</Label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input value={slug} disabled />
        </div>
        <Button
          disabled={status === 'executing' || value.trim().length === 0}
          onClick={() => execute({ name: value })}
        >
          Save
        </Button>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Sidebar link**

In `app-sidebar-client.tsx`, the `Settings` icon is already imported (used in the footer). Add a Settings entry to the `navigationItems` array:

```tsx
// add to navigationItems (after Members):
  { title: 'Settings', url: '/settings', icon: Settings },
```

- [ ] **Step 5: Verify + commit**

Run `pnpm web#dev` → `/settings` renames the workspace (visible after refresh). `pnpm typecheck && pnpm lint`.

```bash
git add apps/web/src/data/user/workspaces.ts apps/web/src/app/'(app-pages)'/settings apps/web/src/app/'(app-pages)'/app-sidebar-client.tsx
git commit -m "feat(web): add workspace settings page"
```

---

## Self-check (end of milestone)

- [ ] `cd apps/database && supabase test db` → invitation tests pass (admin creates; non-member can't read; invitee accepts).
- [ ] `pnpm --filter web test` → token tests pass.
- [ ] `pnpm typecheck && pnpm lint` → clean.
- [ ] A second user can join via invite link; roles can be changed/removed without orphaning ownership.
- [ ] `/settings` renames the workspace (owner/admin only).
