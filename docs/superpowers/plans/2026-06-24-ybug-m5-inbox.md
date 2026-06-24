# Milestone 5 — Feedback Inbox & Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the feedback inbox (list + filters + search) and the report detail view (annotated screenshot, metadata, status, assignee, internal comments, labels).

**Architecture:** New `labels`, `feedback_report_labels`, and `feedback_comments` tables under workspace-scoped RLS. A `get_workspace_members` SECURITY DEFINER RPC exposes member identities (email) for the assignee dropdown without a separate profiles table. Reads are server components under RLS; mutations use `authActionClient`. Screenshots render via short-lived signed URLs (M4 helper).

**Tech Stack:** Supabase + RLS, pgTAP, Next.js server components + `next-safe-action`, shadcn/ui, Vitest.

**Prereq:** M4 complete. **Read:** `2026-06-24-ybug-clone-overview.md`.

---

## File Structure

- Create: `apps/database/supabase/migrations/<ts>_create_labels_comments.sql`
- Create: `apps/database/supabase/migrations/<ts>_create_get_workspace_members.sql`
- Create: `apps/database/supabase/tests/feedback_detail_test.sql`
- Create: `apps/web/src/data/user/feedback-filters.ts` — pure `normalizeFeedbackFilters()` + filter types (NOT a `'use server'` module)
- Create: `apps/web/src/data/user/feedback.ts` — queries + actions (`'use server'`)
- Create: `apps/web/src/app/(app-pages)/inbox/page.tsx` + `inbox-filters.tsx` + `inbox-list.tsx`
- Create: `apps/web/src/app/(app-pages)/inbox/[reportId]/page.tsx` + `report-detail-client.tsx`
- Modify: `apps/web/src/app/(app-pages)/onboarding/page.tsx` + `OnboardingForm.tsx` — land on `/inbox`
- Modify: `apps/web/src/app/(app-pages)/app-sidebar-client.tsx` — add "Inbox" link

---

## Task 1: `labels`, `feedback_report_labels`, `feedback_comments`

**Files:**

- Create: `apps/database/supabase/migrations/<ts>_create_labels_comments.sql`
- Test: `apps/database/supabase/tests/feedback_detail_test.sql`

- [ ] **Step 1: Write the failing test**

Create `apps/database/supabase/tests/feedback_detail_test.sql`:

```sql
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

SELECT plan(5);

SELECT has_table('public', 'labels', 'labels table exists');
SELECT has_table('public', 'feedback_report_labels', 'feedback_report_labels table exists');
SELECT has_table('public', 'feedback_comments', 'feedback_comments table exists');

-- Seed one workspace with a member and a report
INSERT INTO auth.users (id, email) VALUES
  ('77777777-7777-7777-7777-777777777777', 'lead@p.com');
INSERT INTO public.workspaces (id, name, slug, owner_id) VALUES
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', 'WS L', 'ws-l', '77777777-7777-7777-7777-777777777777');
INSERT INTO public.workspace_members (workspace_id, user_id, role) VALUES
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', '77777777-7777-7777-7777-777777777777', 'owner');
INSERT INTO public.projects (id, workspace_id, name, public_key) VALUES
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', 'P', 'pk_l');
INSERT INTO public.feedback_reports (id, project_id, workspace_id, type, description) VALUES
  ('b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b3', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', 'bug', 'r');

SET LOCAL role authenticated;
SET LOCAL request.jwt.claim.sub = '77777777-7777-7777-7777-777777777777';

-- A member can add a comment to a report in their workspace
SELECT lives_ok(
  $$ INSERT INTO public.feedback_comments (report_id, author_id, body)
     VALUES ('b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b3', '77777777-7777-7777-7777-777777777777', 'looking into it') $$,
  'member can comment on a report in their workspace'
);

-- A member can create a label in their workspace
SELECT lives_ok(
  $$ INSERT INTO public.labels (workspace_id, name) VALUES ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', 'urgent') $$,
  'member can create a label'
);

SELECT * FROM finish();
ROLLBACK;
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/database && supabase test db`
Expected: FAIL — `relation "public.labels" does not exist`.

- [ ] **Step 3: Create the migration**

Run: `cd apps/database && supabase migration new create_labels_comments`
Paste:

```sql
CREATE TABLE IF NOT EXISTS public.labels (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#999999',
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (workspace_id, name)
);

CREATE TABLE IF NOT EXISTS public.feedback_report_labels (
  report_id uuid NOT NULL REFERENCES public.feedback_reports (id) ON DELETE CASCADE,
  label_id uuid NOT NULL REFERENCES public.labels (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  PRIMARY KEY (report_id, label_id)
);

CREATE TABLE IF NOT EXISTS public.feedback_comments (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  report_id uuid NOT NULL REFERENCES public.feedback_reports (id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_labels_workspace_id ON public.labels (workspace_id);
CREATE INDEX IF NOT EXISTS idx_feedback_comments_report_id ON public.feedback_comments (report_id);

CREATE TRIGGER set_updated_at_labels
  BEFORE UPDATE ON public.labels
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at_feedback_comments
  BEFORE UPDATE ON public.feedback_comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_report_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_comments ENABLE ROW LEVEL SECURITY;

-- labels: any member of the workspace may manage
CREATE POLICY labels_select ON public.labels
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY labels_insert ON public.labels
  FOR INSERT WITH CHECK (public.is_workspace_member(workspace_id));
CREATE POLICY labels_update ON public.labels
  FOR UPDATE USING (public.is_workspace_member(workspace_id))
  WITH CHECK (public.is_workspace_member(workspace_id));
CREATE POLICY labels_delete ON public.labels
  FOR DELETE USING (public.is_workspace_member(workspace_id));

-- report<->label join: gated by membership of the report's workspace
CREATE POLICY frl_select ON public.feedback_report_labels
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.feedback_reports r
    WHERE r.id = report_id AND public.is_workspace_member(r.workspace_id)
  ));
CREATE POLICY frl_insert ON public.feedback_report_labels
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.feedback_reports r
    WHERE r.id = report_id AND public.is_workspace_member(r.workspace_id)
  ));
CREATE POLICY frl_delete ON public.feedback_report_labels
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.feedback_reports r
    WHERE r.id = report_id AND public.is_workspace_member(r.workspace_id)
  ));

-- comments: members read; author writes their own
CREATE POLICY feedback_comments_select ON public.feedback_comments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.feedback_reports r
    WHERE r.id = report_id AND public.is_workspace_member(r.workspace_id)
  ));
CREATE POLICY feedback_comments_insert ON public.feedback_comments
  FOR INSERT WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.feedback_reports r
      WHERE r.id = report_id AND public.is_workspace_member(r.workspace_id)
    )
  );
CREATE POLICY feedback_comments_delete ON public.feedback_comments
  FOR DELETE USING (author_id = auth.uid());
```

- [ ] **Step 4: Apply and run the test**

Run: `cd apps/database && supabase db reset && supabase test db`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/database/supabase/migrations apps/database/supabase/tests/feedback_detail_test.sql
git commit -m "feat(db): add labels, report-labels, and comments with RLS"
```

---

## Task 2: `get_workspace_members` RPC

**Files:**

- Create: `apps/database/supabase/migrations/<ts>_create_get_workspace_members.sql`
- Test: `apps/database/supabase/tests/feedback_detail_test.sql` (extend)

- [ ] **Step 1: Extend the test**

Change `SELECT plan(5);` to `SELECT plan(6);` and add before `SELECT * FROM finish();`:

```sql
SELECT results_eq(
  $$ SELECT count(*) FROM public.get_workspace_members('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2') $$,
  ARRAY[1::bigint],
  'get_workspace_members returns members for a workspace the caller belongs to'
);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/database && supabase test db`
Expected: FAIL — function `get_workspace_members` does not exist.

- [ ] **Step 3: Create the migration**

Run: `cd apps/database && supabase migration new create_get_workspace_members`
Paste:

```sql
CREATE OR REPLACE FUNCTION public.get_workspace_members(p_workspace_id uuid)
RETURNS TABLE (user_id uuid, email text, role text, created_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
STABLE
AS $$
BEGIN
  IF NOT public.is_workspace_member(p_workspace_id) THEN
    RETURN;
  END IF;
  RETURN QUERY
    SELECT m.user_id, u.email::text, m.role, m.created_at
    FROM public.workspace_members m
    JOIN auth.users u ON u.id = m.user_id
    WHERE m.workspace_id = p_workspace_id
    ORDER BY m.created_at ASC;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_workspace_members(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_workspace_members(uuid) TO authenticated;
```

- [ ] **Step 4: Apply and run the test**

Run: `cd apps/database && supabase db reset && supabase test db`
Expected: PASS (6 tests).

- [ ] **Step 5: Regenerate types + commit**

```bash
cd apps/database && supabase gen types typescript --local > ../web/src/lib/database.types.ts
cd ../..
git add apps/database/supabase/migrations apps/database/supabase/tests/feedback_detail_test.sql apps/web/src/lib/database.types.ts
git commit -m "feat(db): add get_workspace_members rpc and regenerate types"
```

---

## Task 3: Feedback data layer + filter helper

**Files:**

- Create: `apps/web/src/data/user/feedback-filters.ts` (pure module — NOT `'use server'`)
- Create: `apps/web/src/data/user/feedback.ts` (`'use server'`)
- Test: `apps/web/src/data/user/__tests__/feedback-filters.test.ts`

> Important: `normalizeFeedbackFilters` is a **synchronous** helper, so it CANNOT live in a `'use server'` file (Next.js requires every export of such a module to be an async server action). Keep it in the separate pure `feedback-filters.ts` module and import it into `feedback.ts`.

- [ ] **Step 1: Write the failing test (pure filter normaliser)**

Create `apps/web/src/data/user/__tests__/feedback-filters.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { normalizeFeedbackFilters } from "../feedback-filters";

describe("normalizeFeedbackFilters", () => {
  it('drops empty and "all" values', () => {
    expect(
      normalizeFeedbackFilters({
        status: "all",
        type: "",
        projectId: undefined,
        q: "  ",
      })
    ).toEqual({});
  });
  it("keeps valid status/type/project and trims search", () => {
    expect(
      normalizeFeedbackFilters({
        status: "new",
        type: "bug",
        projectId: "p1",
        q: "  crash ",
      })
    ).toEqual({ status: "new", type: "bug", projectId: "p1", q: "crash" });
  });
  it("ignores invalid status/type", () => {
    expect(normalizeFeedbackFilters({ status: "bogus", type: "nope" })).toEqual(
      {}
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && pnpm vitest run src/data/user/__tests__/feedback-filters.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3a: Create the pure filter module**

Create `apps/web/src/data/user/feedback-filters.ts`:

```ts
export const STATUSES = ["new", "in_progress", "done"] as const;
export const TYPES = ["bug", "idea", "question"] as const;

export interface FeedbackFiltersInput {
  status?: string;
  type?: string;
  projectId?: string;
  assigneeId?: string;
  q?: string;
}

export interface FeedbackFilters {
  status?: (typeof STATUSES)[number];
  type?: (typeof TYPES)[number];
  projectId?: string;
  assigneeId?: string;
  q?: string;
}

export function normalizeFeedbackFilters(
  input: FeedbackFiltersInput
): FeedbackFilters {
  const out: FeedbackFilters = {};
  if (input.status && (STATUSES as readonly string[]).includes(input.status)) {
    out.status = input.status as FeedbackFilters["status"];
  }
  if (input.type && (TYPES as readonly string[]).includes(input.type)) {
    out.type = input.type as FeedbackFilters["type"];
  }
  if (input.projectId && input.projectId !== "all")
    out.projectId = input.projectId;
  if (input.assigneeId && input.assigneeId !== "all")
    out.assigneeId = input.assigneeId;
  const q = (input.q ?? "").trim();
  if (q) out.q = q;
  return out;
}
```

- [ ] **Step 3b: Implement the data module**

Create `apps/web/src/data/user/feedback.ts`:

```ts
"use server";

import { authActionClient } from "@/lib/safe-action";
import { requireCurrentWorkspace } from "@/data/user/workspaces";
import { getSignedScreenshotUrl } from "@/data/user/screenshots";
import { createSupabaseClient } from "@/supabase-clients/server";
import {
  STATUSES,
  normalizeFeedbackFilters,
  type FeedbackFiltersInput,
} from "@/data/user/feedback-filters";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getFeedbackReports(rawFilters: FeedbackFiltersInput) {
  const filters = normalizeFeedbackFilters(rawFilters);
  const supabase = await createSupabaseClient();
  let query = supabase
    .from("feedback_reports")
    .select("*, project:projects(name)")
    .order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.type) query = query.eq("type", filters.type);
  if (filters.projectId) query = query.eq("project_id", filters.projectId);
  if (filters.assigneeId) query = query.eq("assignee_id", filters.assigneeId);
  if (filters.q) query = query.ilike("description", `%${filters.q}%`);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function getFeedbackReport(reportId: string) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("feedback_reports")
    .select(
      "*, project:projects(name), comments:feedback_comments(*), report_labels:feedback_report_labels(label:labels(*))"
    )
    .eq("id", reportId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const screenshotUrl = await getSignedScreenshotUrl(data.screenshot_path);
  return { ...data, screenshotUrl };
}

export async function getAssignableMembers() {
  const membership = await requireCurrentWorkspace();
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.rpc("get_workspace_members", {
    p_workspace_id: membership.workspace!.id,
  });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getLabels() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from("labels")
    .select("*")
    .order("name");
  if (error) throw new Error(error.message);
  return data;
}

const updateStatusSchema = z.object({
  reportId: z.string().uuid(),
  status: z.enum(STATUSES),
});
export const updateReportStatusAction = authActionClient
  .schema(updateStatusSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createSupabaseClient();
    const { error } = await supabase
      .from("feedback_reports")
      .update({ status: parsedInput.status })
      .eq("id", parsedInput.reportId);
    if (error) throw new Error(error.message);
    revalidatePath(`/inbox/${parsedInput.reportId}`);
    revalidatePath("/inbox");
    return { success: true };
  });

const assignSchema = z.object({
  reportId: z.string().uuid(),
  assigneeId: z.string().uuid().nullable(),
});
export const assignReportAction = authActionClient
  .schema(assignSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createSupabaseClient();
    const { error } = await supabase
      .from("feedback_reports")
      .update({ assignee_id: parsedInput.assigneeId })
      .eq("id", parsedInput.reportId);
    if (error) throw new Error(error.message);
    revalidatePath(`/inbox/${parsedInput.reportId}`);
    return { success: true };
  });

const addCommentSchema = z.object({
  reportId: z.string().uuid(),
  body: z.string().min(1).max(5000),
});
export const addCommentAction = authActionClient
  .schema(addCommentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const supabase = await createSupabaseClient();
    const { error } = await supabase.from("feedback_comments").insert({
      report_id: parsedInput.reportId,
      author_id: ctx.userId,
      body: parsedInput.body,
    });
    if (error) throw new Error(error.message);
    revalidatePath(`/inbox/${parsedInput.reportId}`);
    return { success: true };
  });

const createLabelSchema = z.object({
  name: z.string().min(1).max(40),
  color: z.string().optional(),
});
export const createLabelAction = authActionClient
  .schema(createLabelSchema)
  .action(async ({ parsedInput }) => {
    const membership = await requireCurrentWorkspace();
    const supabase = await createSupabaseClient();
    const { error } = await supabase.from("labels").insert({
      workspace_id: membership.workspace!.id,
      name: parsedInput.name,
      color: parsedInput.color ?? "#999999",
    });
    if (error) throw new Error(error.message);
    revalidatePath("/inbox");
    return { success: true };
  });

const toggleLabelSchema = z.object({
  reportId: z.string().uuid(),
  labelId: z.string().uuid(),
  attach: z.boolean(),
});
export const toggleReportLabelAction = authActionClient
  .schema(toggleLabelSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createSupabaseClient();
    if (parsedInput.attach) {
      const { error } = await supabase
        .from("feedback_report_labels")
        .insert({
          report_id: parsedInput.reportId,
          label_id: parsedInput.labelId,
        });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("feedback_report_labels")
        .delete()
        .eq("report_id", parsedInput.reportId)
        .eq("label_id", parsedInput.labelId);
      if (error) throw new Error(error.message);
    }
    revalidatePath(`/inbox/${parsedInput.reportId}`);
    return { success: true };
  });
```

- [ ] **Step 4: Run test + typecheck**

Run: `cd apps/web && pnpm vitest run src/data/user/__tests__/feedback-filters.test.ts` → PASS (3 tests).
Run: `cd apps/web && pnpm tsc --noEmit` → clean.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/data/user/feedback.ts apps/web/src/data/user/feedback-filters.ts apps/web/src/data/user/__tests__/feedback-filters.test.ts
git commit -m "feat(web): add feedback data layer (queries, actions, filters)"
```

---

> Scope note: v1 inbox filters ship **project, type, status, and description search**. The data layer (`normalizeFeedbackFilters` / `getFeedbackReports`) already supports an `assigneeId` filter, so an **assignee** filter control is a trivial fast-follow (pass `getAssignableMembers()` into `InboxFilters`). A **label** filter requires an additional join-based query and is an explicit fast-follow — not built in this milestone.

## Task 4: Inbox list page + filters

**Files:**

- Create: `apps/web/src/app/(app-pages)/inbox/page.tsx`
- Create: `apps/web/src/app/(app-pages)/inbox/inbox-filters.tsx`
- Create: `apps/web/src/app/(app-pages)/inbox/inbox-list.tsx`

- [ ] **Step 1: Server page (reads `searchParams` filters)**

Create `apps/web/src/app/(app-pages)/inbox/page.tsx`:

```tsx
import { requireCurrentWorkspace } from "@/data/user/workspaces";
import { getFeedbackReports } from "@/data/user/feedback";
import { getProjects } from "@/data/user/projects";
import { InboxFilters } from "./inbox-filters";
import { InboxList } from "./inbox-list";

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireCurrentWorkspace();
  const sp = await searchParams;
  const [reports, projects] = await Promise.all([
    getFeedbackReports({
      status: sp.status,
      type: sp.type,
      projectId: sp.projectId,
      q: sp.q,
    }),
    getProjects(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <h1 className="text-2xl font-semibold">Inbox</h1>
      <InboxFilters projects={projects} current={sp} />
      <InboxList reports={reports} />
    </div>
  );
}
```

- [ ] **Step 2: Filters (URL-driven)**

Create `apps/web/src/app/(app-pages)/inbox/inbox-filters.tsx`:

```tsx
"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/lib/database.types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export function InboxFilters({
  projects,
  current,
}: {
  projects: Project[];
  current: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Input
        placeholder="Search description…"
        defaultValue={current.q ?? ""}
        className="max-w-xs"
        onKeyDown={(e) => {
          if (e.key === "Enter")
            setParam("q", (e.target as HTMLInputElement).value);
        }}
      />
      <Select
        value={current.status ?? "all"}
        onValueChange={(v) => setParam("status", v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="in_progress">In progress</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={current.type ?? "all"}
        onValueChange={(v) => setParam("type", v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="bug">Bug</SelectItem>
          <SelectItem value="idea">Idea</SelectItem>
          <SelectItem value="question">Question</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={current.projectId ?? "all"}
        onValueChange={(v) => setParam("projectId", v)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All projects</SelectItem>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
```

- [ ] **Step 3: List**

Create `apps/web/src/app/(app-pages)/inbox/inbox-list.tsx`:

```tsx
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type ReportRow = {
  id: string;
  type: string;
  status: string;
  description: string;
  created_at: string;
  project: { name: string } | null;
};

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  new: "default",
  in_progress: "secondary",
  done: "outline",
};

export function InboxList({ reports }: { reports: ReportRow[] }) {
  if (reports.length === 0) {
    return <p className="text-muted-foreground">No feedback yet.</p>;
  }
  return (
    <div className="divide-y rounded-md border">
      {reports.map((r) => (
        <Link
          key={r.id}
          href={`/inbox/${r.id}`}
          className="flex items-center gap-3 p-3 hover:bg-muted/50"
        >
          <Badge variant={statusVariant[r.status] ?? "default"}>
            {r.status}
          </Badge>
          <Badge variant="outline">{r.type}</Badge>
          <span className="flex-1 truncate">
            {r.description || "(no description)"}
          </span>
          <span className="text-xs text-muted-foreground">
            {r.project?.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(r.created_at).toLocaleDateString()}
          </span>
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Verify**

Run `pnpm web#dev` → `/inbox` lists submitted reports; filtering by status/type/project and Enter-to-search update the URL and results. `pnpm typecheck && pnpm lint`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/'(app-pages)'/inbox/page.tsx apps/web/src/app/'(app-pages)'/inbox/inbox-filters.tsx apps/web/src/app/'(app-pages)'/inbox/inbox-list.tsx
git commit -m "feat(web): add feedback inbox list with filters"
```

---

## Task 5: Report detail page

**Files:**

- Create: `apps/web/src/app/(app-pages)/inbox/[reportId]/page.tsx`
- Create: `apps/web/src/app/(app-pages)/inbox/[reportId]/report-detail-client.tsx`

- [ ] **Step 1: Server page**

Create `apps/web/src/app/(app-pages)/inbox/[reportId]/page.tsx`:

```tsx
import { requireCurrentWorkspace } from "@/data/user/workspaces";
import {
  getAssignableMembers,
  getFeedbackReport,
  getLabels,
} from "@/data/user/feedback";
import { notFound } from "next/navigation";
import { ReportDetailClient } from "./report-detail-client";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  await requireCurrentWorkspace();
  const { reportId } = await params;
  const [report, members, labels] = await Promise.all([
    getFeedbackReport(reportId),
    getAssignableMembers(),
    getLabels(),
  ]);
  if (!report) notFound();

  return (
    <ReportDetailClient report={report} members={members} labels={labels} />
  );
}
```

- [ ] **Step 2: Client detail (status, assignee, labels, comments)**

Create `apps/web/src/app/(app-pages)/inbox/[reportId]/report-detail-client.tsx`:

```tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  addCommentAction,
  assignReportAction,
  toggleReportLabelAction,
  updateReportStatusAction,
} from "@/data/user/feedback";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// Shapes returned by getFeedbackReport / getAssignableMembers / getLabels.
type Detail = {
  id: string;
  type: string;
  status: "new" | "in_progress" | "done";
  description: string;
  reporter_name: string | null;
  reporter_email: string | null;
  page_url: string | null;
  browser: string | null;
  os: string | null;
  screen_size: string | null;
  assignee_id: string | null;
  screenshotUrl: string | null;
  comments: {
    id: string;
    body: string;
    created_at: string;
    author_id: string;
  }[];
  report_labels: {
    label: { id: string; name: string; color: string } | null;
  }[];
};
type Member = { user_id: string; email: string; role: string };
type Label = { id: string; name: string; color: string };

export function ReportDetailClient({
  report,
  members,
  labels,
}: {
  report: Detail;
  members: Member[];
  labels: Label[];
}) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const attachedIds = new Set(
    report.report_labels.map((rl) => rl.label?.id).filter(Boolean) as string[]
  );

  const refresh = () => router.refresh();
  const status = useAction(updateReportStatusAction, { onSuccess: refresh });
  const assign = useAction(assignReportAction, { onSuccess: refresh });
  const toggleLabel = useAction(toggleReportLabelAction, {
    onSuccess: refresh,
  });
  const addComment = useAction(addCommentAction, {
    onSuccess: () => {
      setComment("");
      refresh();
    },
    onError: ({ error }) => toast.error(error.serverError ?? "Failed"),
  });

  return (
    <div className="grid flex-1 gap-6 p-4 md:grid-cols-3 md:p-6">
      <div className="space-y-4 md:col-span-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{report.type}</Badge>
          <h1 className="text-xl font-semibold">Feedback</h1>
        </div>
        <p className="whitespace-pre-wrap">
          {report.description || "(no description)"}
        </p>
        {report.screenshotUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={report.screenshotUrl}
            alt="Annotated screenshot"
            className="rounded border"
          />
        ) : (
          <p className="text-muted-foreground">No screenshot.</p>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.comments
              .sort((a, b) => a.created_at.localeCompare(b.created_at))
              .map((c) => (
                <div key={c.id} className="rounded bg-muted p-2 text-sm">
                  <div className="text-xs text-muted-foreground">
                    {new Date(c.created_at).toLocaleString()}
                  </div>
                  <div className="whitespace-pre-wrap">{c.body}</div>
                </div>
              ))}
            <Textarea
              rows={3}
              placeholder="Add an internal comment…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              disabled={
                addComment.status === "executing" || comment.trim().length === 0
              }
              onClick={() =>
                addComment.execute({ reportId: report.id, body: comment })
              }
            >
              Comment
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={report.status}
              onValueChange={(v) =>
                status.execute({
                  reportId: report.id,
                  status: v as Detail["status"],
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignee</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={report.assignee_id ?? "unassigned"}
              onValueChange={(v) =>
                assign.execute({
                  reportId: report.id,
                  assigneeId: v === "unassigned" ? null : v,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.user_id} value={m.user_id}>
                    {m.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Labels</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {labels.length === 0 && (
              <span className="text-sm text-muted-foreground">
                No labels yet.
              </span>
            )}
            {labels.map((label) => {
              const attached = attachedIds.has(label.id);
              return (
                <button
                  key={label.id}
                  onClick={() =>
                    toggleLabel.execute({
                      reportId: report.id,
                      labelId: label.id,
                      attach: !attached,
                    })
                  }
                >
                  <Badge variant={attached ? "default" : "outline"}>
                    {label.name}
                  </Badge>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div>URL: {report.page_url ?? "—"}</div>
            <div>Browser: {report.browser ?? "—"}</div>
            <div>OS: {report.os ?? "—"}</div>
            <div>Screen: {report.screen_size ?? "—"}</div>
            <div>
              Reporter: {report.reporter_name ?? "—"}{" "}
              {report.reporter_email ? `(${report.reporter_email})` : ""}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run `pnpm web#dev` → open a report from `/inbox` → screenshot renders (signed URL), change status/assignee, toggle labels, add a comment; all persist after refresh. `pnpm typecheck && pnpm lint`.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/'(app-pages)'/inbox/'[reportId]'
git commit -m "feat(web): add report detail with status, assignee, labels, comments"
```

---

## Task 6: Make `/inbox` the post-login landing + sidebar link

**Files:**

- Modify: `apps/web/src/app/(app-pages)/onboarding/page.tsx`
- Modify: `apps/web/src/app/(app-pages)/onboarding/OnboardingForm.tsx`
- Modify: `apps/web/src/app/(app-pages)/app-sidebar-client.tsx`

- [ ] **Step 1: Redirect onboarding to `/inbox`**

In `onboarding/page.tsx`, change `redirect('/dashboard')` to `redirect('/inbox')`.
In `OnboardingForm.tsx`, change `router.push('/dashboard')` to `router.push('/inbox')`.

- [ ] **Step 2: Add an "Inbox" sidebar link**

In `app-sidebar-client.tsx`, add `Inbox` to the `lucide-react` import and add an entry to the `navigationItems` array above the Projects entry:

```tsx
import { ChevronUp, FolderKanban, Home, Inbox, Lock, LogOut, Settings } from "lucide-react";

const navigationItems: { title: string; url: string; icon: React.ElementType }[] = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Inbox', url: '/inbox', icon: Inbox },
  { title: 'Projects', url: '/projects', icon: FolderKanban },
  { title: 'Private Items', url: '/private-items', icon: Lock },
];
```

- [ ] **Step 3: Verify + commit**

Run `pnpm web#dev` → new users land on `/inbox` after onboarding; sidebar shows Inbox + Projects.

```bash
git add apps/web/src/app/'(app-pages)'/onboarding apps/web/src/app/'(app-pages)'/app-sidebar-client.tsx
git commit -m "feat(web): land on inbox and add inbox sidebar link"
```

---

## Self-check (end of milestone)

- [ ] `cd apps/database && supabase test db` → labels/comments/members tests pass.
- [ ] `pnpm --filter web test` → feedback filter tests pass.
- [ ] `pnpm typecheck && pnpm lint` → clean.
- [ ] Full triage works: list/filter feedback, open a report, view annotated screenshot, change status/assignee, add labels and comments.
