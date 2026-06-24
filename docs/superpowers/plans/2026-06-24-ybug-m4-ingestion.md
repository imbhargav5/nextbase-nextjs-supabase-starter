# Milestone 4 — Ingestion API & Storage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Accept anonymous feedback from the widget: validate the project key + request origin, insert a `feedback_reports` row via the service role, and return a one-time signed Storage upload URL the widget uses to PUT the flattened screenshot. This closes the end-to-end loop.

**Architecture:** `feedback_reports` table with strict RLS (members read/triage; no anon policy at all). A private `screenshots` Storage bucket. A `POST /api/ingest` route handler using the service-role client, with origin validation reusing M2's `isOriginAllowed` and a pure, tested CORS-header helper and Zod payload schema.

**Tech Stack:** Supabase + RLS + Storage, pgTAP, Next.js route handlers, Zod, Vitest.

**Prereq:** M3 complete (widget already POSTs to `/api/ingest`). **Read:** `2026-06-24-ybug-clone-overview.md`.

---

## File Structure

- Create: `apps/database/supabase/migrations/<ts>_create_feedback_reports.sql`
- Create: `apps/database/supabase/migrations/<ts>_create_screenshots_bucket.sql`
- Create: `apps/database/supabase/tests/feedback_reports_test.sql`
- Create: `apps/web/src/utils/zod-schemas/ingest.ts` (+ test) — `ingestPayloadSchema`
- Create: `apps/web/src/utils/widget/cors.ts` (+ test) — `corsHeaders()`
- Create: `apps/web/src/app/api/ingest/route.ts`
- Create: `apps/web/src/data/user/screenshots.ts` — `getSignedScreenshotUrl()`

> **Contract:** `ingestPayloadSchema` field names MUST match the M3 widget payload (`projectKey`, `type`, `description`, `reporterName`, `reporterEmail`, `pageUrl`, `browser`, `os`, `screenSize`).

---

## Task 1: `feedback_reports` table + strict RLS

**Files:**

- Create: `apps/database/supabase/migrations/<ts>_create_feedback_reports.sql`
- Test: `apps/database/supabase/tests/feedback_reports_test.sql`

- [ ] **Step 1: Write the failing test**

Create `apps/database/supabase/tests/feedback_reports_test.sql`:

```sql
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

SELECT plan(7);

SELECT has_table('public', 'feedback_reports', 'feedback_reports table exists');
SELECT col_type_is('public', 'feedback_reports', 'status', 'text', 'status is text');
SELECT col_type_is('public', 'feedback_reports', 'type', 'text', 'type is text');
SELECT is(
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.feedback_reports'::regclass),
  true,
  'RLS enabled on feedback_reports'
);

-- Seed
INSERT INTO auth.users (id, email) VALUES
  ('55555555-5555-5555-5555-555555555555', 'm@p.com'),
  ('66666666-6666-6666-6666-666666666666', 'other@p.com');
INSERT INTO public.workspaces (id, name, slug, owner_id) VALUES
  ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'WS M', 'ws-m', '55555555-5555-5555-5555-555555555555'),
  ('d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1', 'WS O', 'ws-o', '66666666-6666-6666-6666-666666666666');
INSERT INTO public.workspace_members (workspace_id, user_id, role) VALUES
  ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', '55555555-5555-5555-5555-555555555555', 'owner'),
  ('d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1', '66666666-6666-6666-6666-666666666666', 'owner');
INSERT INTO public.projects (id, workspace_id, name, public_key) VALUES
  ('e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Proj M', 'pk_m'),
  ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1', 'Proj O', 'pk_o');
INSERT INTO public.feedback_reports (project_id, workspace_id, type, description) VALUES
  ('e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'bug', 'M report'),
  ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1', 'bug', 'O report');

-- Anonymous role must not read any reports
SET LOCAL role anon;
SELECT results_eq(
  'SELECT count(*) FROM public.feedback_reports',
  ARRAY[0::bigint],
  'anon cannot read feedback_reports'
);

-- Member reads only their workspace's reports
SET LOCAL role authenticated;
SET LOCAL request.jwt.claim.sub = '55555555-5555-5555-5555-555555555555';
SELECT results_eq(
  'SELECT count(*) FROM public.feedback_reports',
  ARRAY[1::bigint],
  'member sees only their workspace reports'
);

SELECT * FROM finish();
ROLLBACK;
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/database && supabase test db`
Expected: FAIL — `relation "public.feedback_reports" does not exist`.

- [ ] **Step 3: Create the migration**

Run: `cd apps/database && supabase migration new create_feedback_reports`
Paste:

```sql
CREATE TABLE IF NOT EXISTS public.feedback_reports (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'bug' CHECK (type IN ('bug', 'idea', 'question')),
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'done')),
  assignee_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  reporter_name text,
  reporter_email text,
  screenshot_path text,
  page_url text,
  browser text,
  os text,
  screen_size text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_feedback_reports_workspace_id ON public.feedback_reports (workspace_id);
CREATE INDEX IF NOT EXISTS idx_feedback_reports_project_id ON public.feedback_reports (project_id);
CREATE INDEX IF NOT EXISTS idx_feedback_reports_status ON public.feedback_reports (status);

CREATE TRIGGER set_updated_at_feedback_reports
  BEFORE UPDATE ON public.feedback_reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.feedback_reports ENABLE ROW LEVEL SECURITY;

-- No INSERT policy: anonymous inserts come only from /api/ingest via the service role.
CREATE POLICY feedback_reports_select ON public.feedback_reports
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY feedback_reports_update ON public.feedback_reports
  FOR UPDATE USING (public.is_workspace_member(workspace_id))
  WITH CHECK (public.is_workspace_member(workspace_id));
CREATE POLICY feedback_reports_delete ON public.feedback_reports
  FOR DELETE USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));
```

- [ ] **Step 4: Apply and run the test**

Run: `cd apps/database && supabase db reset && supabase test db`
Expected: PASS (7 tests).

- [ ] **Step 5: Regenerate types + commit**

```bash
cd apps/database && supabase gen types typescript --local > ../web/src/lib/database.types.ts
cd ../..
git add apps/database/supabase/migrations apps/database/supabase/tests/feedback_reports_test.sql apps/web/src/lib/database.types.ts
git commit -m "feat(db): add feedback_reports with strict RLS"
```

---

## Task 2: `screenshots` Storage bucket

**Files:**

- Create: `apps/database/supabase/migrations/<ts>_create_screenshots_bucket.sql`

- [ ] **Step 1: Create the migration**

Run: `cd apps/database && supabase migration new create_screenshots_bucket`
Paste:

```sql
-- Private bucket; all access via service-role-minted signed URLs.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'screenshots',
  'screenshots',
  false,
  5242880, -- 5 MB
  ARRAY['image/png', 'image/webp', 'image/jpeg']
)
ON CONFLICT (id) DO NOTHING;
```

- [ ] **Step 2: Apply**

Run: `cd apps/database && supabase db reset`
Then verify the bucket exists:

```bash
cd apps/database && supabase test db
```

(Existing tests still pass; bucket creation does not affect them.) Optionally confirm via Studio at `http://localhost:54323` → Storage → `screenshots` exists and is private.

- [ ] **Step 3: Commit**

```bash
git add apps/database/supabase/migrations
git commit -m "feat(db): add private screenshots storage bucket"
```

---

## Task 3: Ingest payload schema

**Files:**

- Create: `apps/web/src/utils/zod-schemas/ingest.ts`
- Test: `apps/web/src/utils/zod-schemas/__tests__/ingest.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/utils/zod-schemas/__tests__/ingest.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ingestPayloadSchema } from "../ingest";

const valid = {
  projectKey: "pk_x",
  type: "bug",
  description: "Broken button",
  reporterName: "Ada",
  reporterEmail: "ada@x.com",
  pageUrl: "https://site.com/p",
  browser: "Chrome",
  os: "macOS",
  screenSize: "1440x900",
};

describe("ingestPayloadSchema", () => {
  it("accepts a valid payload", () => {
    expect(ingestPayloadSchema.safeParse(valid).success).toBe(true);
  });
  it("accepts null reporter fields", () => {
    const result = ingestPayloadSchema.safeParse({
      ...valid,
      reporterName: null,
      reporterEmail: null,
    });
    expect(result.success).toBe(true);
  });
  it("rejects an unknown type", () => {
    expect(
      ingestPayloadSchema.safeParse({ ...valid, type: "spam" }).success
    ).toBe(false);
  });
  it("rejects an empty description", () => {
    expect(
      ingestPayloadSchema.safeParse({ ...valid, description: "" }).success
    ).toBe(false);
  });
  it("rejects an invalid email", () => {
    expect(
      ingestPayloadSchema.safeParse({ ...valid, reporterEmail: "not-an-email" })
        .success
    ).toBe(false);
  });
  it("rejects a non-url pageUrl", () => {
    expect(
      ingestPayloadSchema.safeParse({ ...valid, pageUrl: "nope" }).success
    ).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && pnpm vitest run src/utils/zod-schemas/__tests__/ingest.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

Create `apps/web/src/utils/zod-schemas/ingest.ts`:

```ts
import { z } from "zod";

export const ingestPayloadSchema = z.object({
  projectKey: z.string().min(1).max(120),
  type: z.enum(["bug", "idea", "question"]),
  description: z.string().min(1).max(5000),
  reporterName: z.string().max(120).nullable().optional(),
  reporterEmail: z.string().email().max(200).nullable().optional(),
  pageUrl: z.string().url().max(2000),
  browser: z.string().max(60),
  os: z.string().max(60),
  screenSize: z.string().max(20),
});

export type IngestPayload = z.infer<typeof ingestPayloadSchema>;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/web && pnpm vitest run src/utils/zod-schemas/__tests__/ingest.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/utils/zod-schemas/ingest.ts apps/web/src/utils/zod-schemas/__tests__/ingest.test.ts
git commit -m "feat(web): add ingest payload zod schema"
```

---

## Task 4: CORS headers helper

**Files:**

- Create: `apps/web/src/utils/widget/cors.ts`
- Test: `apps/web/src/utils/widget/__tests__/cors.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/utils/widget/__tests__/cors.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { corsHeaders } from '../cors';

describe('corsHeaders', () => {
  it('reflects a present origin', () => {
    const headers = corsHeaders('https://site.com');
    expect(headers['Access-Control-Allow-Origin']).toBe('https://site.com');
    expect(headers['Vary']).toBe('Origin');
  });
  it('omits allow-origin when origin is null', () => {
    const headers = corsHeaders(null);
    expect(headers['Access-Control-Allow-Origin']).toBeUndefined();
  });
  it('always allows POST and OPTIONS', () => {
    expect(corsHeaders('https://x').['Access-Control-Allow-Methods']).toContain('POST');
  });
});
```

> If the optional-chaining-with-index syntax above is rejected by the linter, write the third test as:
>
> ```ts
> it("always allows POST and OPTIONS", () => {
>   const headers = corsHeaders("https://x");
>   expect(headers["Access-Control-Allow-Methods"]).toContain("POST");
> });
> ```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && pnpm vitest run src/utils/widget/__tests__/cors.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

Create `apps/web/src/utils/widget/cors.ts`:

```ts
/**
 * Builds CORS headers for the public ingest endpoints. Reflects the caller's
 * origin when present (never uses `*` for the mutating endpoint). The actual
 * allow/deny decision is enforced in the route via isOriginAllowed.
 */
export function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    Vary: "Origin",
  };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/web && pnpm vitest run src/utils/widget/__tests__/cors.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/utils/widget/cors.ts apps/web/src/utils/widget/__tests__/cors.test.ts
git commit -m "feat(web): add cors headers helper for ingest"
```

---

## Task 5: `POST /api/ingest` route

**Files:**

- Create: `apps/web/src/app/api/ingest/route.ts`

- [ ] **Step 1: Implement the route**

Create `apps/web/src/app/api/ingest/route.ts`:

```ts
import { createServiceRoleClient } from "@/supabase-clients/service-role";
import { corsHeaders } from "@/utils/widget/cors";
import { isOriginAllowed } from "@/utils/widget/domain-match";
import { ingestPayloadSchema } from "@/utils/zod-schemas/ingest";
import { type NextRequest, NextResponse } from "next/server";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON", code: "invalid_json" },
      { status: 400, headers }
    );
  }

  const parsed = ingestPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", code: "invalid_payload" },
      { status: 422, headers }
    );
  }
  const payload = parsed.data;

  const supabase = createServiceRoleClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, workspace_id, is_active, allowed_domains")
    .eq("public_key", payload.projectKey)
    .maybeSingle();

  if (!project || !project.is_active) {
    return NextResponse.json(
      { error: "Invalid project key", code: "invalid_key" },
      { status: 401, headers }
    );
  }

  if (!isOriginAllowed(origin, project.allowed_domains)) {
    return NextResponse.json(
      { error: "Origin not allowed", code: "origin_not_allowed" },
      { status: 403, headers }
    );
  }

  const { data: report, error: insertError } = await supabase
    .from("feedback_reports")
    .insert({
      project_id: project.id,
      workspace_id: project.workspace_id,
      type: payload.type,
      description: payload.description,
      reporter_name: payload.reporterName ?? null,
      reporter_email: payload.reporterEmail ?? null,
      page_url: payload.pageUrl,
      browser: payload.browser,
      os: payload.os,
      screen_size: payload.screenSize,
    })
    .select("id")
    .single();

  if (insertError || !report) {
    return NextResponse.json(
      { error: "Could not save report", code: "insert_failed" },
      { status: 500, headers }
    );
  }

  const path = `${project.workspace_id}/${report.id}.png`;
  await supabase
    .from("feedback_reports")
    .update({ screenshot_path: path })
    .eq("id", report.id);

  const { data: signed, error: signError } = await supabase.storage
    .from("screenshots")
    .createSignedUploadUrl(path);

  if (signError || !signed) {
    return NextResponse.json(
      { error: "Could not create upload URL", code: "sign_failed" },
      { status: 500, headers }
    );
  }

  return NextResponse.json(
    { reportId: report.id, uploadUrl: signed.signedUrl },
    { headers }
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `cd apps/web && pnpm tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/api/ingest/route.ts
git commit -m "feat(web): add ingest route with origin validation and signed upload"
```

---

## Task 6: Signed screenshot download helper

**Files:**

- Create: `apps/web/src/data/user/screenshots.ts`

- [ ] **Step 1: Implement**

Create `apps/web/src/data/user/screenshots.ts`:

```ts
"use server";

import { createServiceRoleClient } from "@/supabase-clients/service-role";

/**
 * Mints a short-lived signed download URL for a screenshot.
 * SECURITY INVARIANT: callers must only pass a `path` taken from a
 * feedback_reports row the user already fetched under RLS — i.e. a report in
 * their own workspace. Never pass a user-supplied path directly.
 */
export async function getSignedScreenshotUrl(
  path: string | null,
  expiresIn = 3600
): Promise<string | null> {
  if (!path) return null;
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.storage
    .from("screenshots")
    .createSignedUrl(path, expiresIn);
  if (error || !data) return null;
  return data.signedUrl;
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `cd apps/web && pnpm tsc --noEmit` → clean.

```bash
git add apps/web/src/data/user/screenshots.ts
git commit -m "feat(web): add signed screenshot url helper"
```

---

## Task 7: End-to-end verification

- [ ] **Step 1: Run the full loop manually**

1. Rebuild the widget: `cd packages/widget && pnpm build`.
2. Start everything: `pnpm database#start` (if not running) and `pnpm web#dev`.
3. In the dashboard, ensure a project exists with `localhost` in its allowed domains; put its `public_key` into `apps/web/public/widget-test.html`.
4. Open `http://localhost:3000/widget-test.html`.
5. Click **Feedback** → annotate → fill description → **Send feedback**.
6. Expected: success state ("Thanks for your feedback!"). No errors in console.

- [ ] **Step 2: Verify persistence**

In Supabase Studio (`http://localhost:54323`):

- `feedback_reports` has a new row with your description, metadata, and a `screenshot_path` like `<workspace_id>/<report_id>.png`.
- Storage → `screenshots` contains the uploaded PNG at that path.

- [ ] **Step 3: Verify rejection paths**

```bash
# Bad key -> 401
curl -i -X POST http://localhost:3000/api/ingest -H 'content-type: application/json' \
  -H 'origin: http://localhost:3000' \
  -d '{"projectKey":"pk_does_not_exist","type":"bug","description":"x","reporterName":null,"reporterEmail":null,"pageUrl":"http://localhost:3000/","browser":"Chrome","os":"macOS","screenSize":"1x1"}'

# Disallowed origin -> 403 (use a real key but a foreign origin)
curl -i -X POST http://localhost:3000/api/ingest -H 'content-type: application/json' \
  -H 'origin: https://evil.com' \
  -d '{"projectKey":"<REAL_KEY>","type":"bug","description":"x","reporterName":null,"reporterEmail":null,"pageUrl":"https://evil.com/","browser":"Chrome","os":"macOS","screenSize":"1x1"}'
```

Expected: `401 invalid_key` and `403 origin_not_allowed` respectively.

- [ ] **Step 4: Commit any harness key changes**

```bash
git add apps/web/public/widget-test.html
git commit -m "test(widget): wire harness to a real project key for e2e"
```

---

## Self-check (end of milestone)

- [ ] `cd apps/database && supabase test db` → feedback_reports RLS tests pass (anon reads 0, member sees only own).
- [ ] `pnpm --filter web test` → ingest schema + cors tests pass.
- [ ] `pnpm typecheck && pnpm lint` → clean.
- [ ] Submitting from the widget creates a report row + uploads a screenshot; bad key/origin are rejected.
