# Milestone 7 — Hardening & Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Production-harden the ingestion path (rate limiting + body-size guard), remove the `private_items` demo, lock in the widget build ordering, and add an end-to-end ingest test.

**Architecture:** A small pluggable in-memory token-bucket limiter guards `/api/ingest`. The legacy `private_items` reference feature is fully removed and its routes/queries deleted. `apps/web` declares a workspace dependency on `@nextbase/widget` so Turbo builds and copies `widget.js` before the web build. Playwright covers the anonymous ingest happy path against a seeded project.

**Tech Stack:** Next.js route handlers, Vitest, Playwright, Turborepo, Supabase seed.

**Prereq:** M1–M6 complete. **Read:** `2026-06-24-ybug-clone-overview.md`.

---

## File Structure

- Create: `apps/web/src/utils/widget/rate-limit.ts` (+ test) — `tokenBucket()`
- Modify: `apps/web/src/app/api/ingest/route.ts` — apply rate limit + body-size guard
- Delete: `apps/web/src/data/user/privateItems.ts`, `apps/web/src/data/anon/privateItems.ts`, the `private-items` / `private-item` route folders, and the demo `dashboard` CRUD pieces
- Modify: `apps/web/src/supabase-clients/middleware.ts` — drop legacy protected routes
- Modify: `apps/web/src/app/(app-pages)/dashboard/page.tsx` — redirect to `/inbox`
- Create: `apps/database/supabase/migrations/<ts>_drop_private_items.sql`
- Modify: `apps/database/supabase/seed.sql` — seed an e2e project
- Modify: `apps/web/package.json` — add `@nextbase/widget` workspace dep
- Create: `apps/web/e2e/ingest.spec.ts`

---

## Task 1: Token-bucket rate limiter

**Files:**
- Create: `apps/web/src/utils/widget/rate-limit.ts`
- Test: `apps/web/src/utils/widget/__tests__/rate-limit.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/utils/widget/__tests__/rate-limit.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createRateLimiter } from '../rate-limit';

describe('createRateLimiter', () => {
  it('allows up to the limit within the window', () => {
    let now = 1000;
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000, now: () => now });
    expect(limiter.check('k').allowed).toBe(true);
    expect(limiter.check('k').allowed).toBe(true);
    expect(limiter.check('k').allowed).toBe(true);
    expect(limiter.check('k').allowed).toBe(false);
  });
  it('refills after the window elapses', () => {
    let now = 1000;
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => now });
    expect(limiter.check('k').allowed).toBe(true);
    expect(limiter.check('k').allowed).toBe(false);
    now += 1001;
    expect(limiter.check('k').allowed).toBe(true);
  });
  it('tracks keys independently', () => {
    let now = 1000;
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => now });
    expect(limiter.check('a').allowed).toBe(true);
    expect(limiter.check('b').allowed).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/web && pnpm vitest run src/utils/widget/__tests__/rate-limit.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

Create `apps/web/src/utils/widget/rate-limit.ts`:

```ts
interface Bucket {
  count: number;
  resetAt: number;
}

export interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  now?: () => number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

/**
 * Simple in-memory fixed-window limiter. Sufficient for a single-instance MVP;
 * swap the store for Upstash/Redis when running multiple instances.
 */
export function createRateLimiter(options: RateLimiterOptions) {
  const now = options.now ?? Date.now;
  const buckets = new Map<string, Bucket>();

  return {
    check(key: string): RateLimitResult {
      const current = now();
      const bucket = buckets.get(key);
      if (!bucket || current >= bucket.resetAt) {
        buckets.set(key, { count: 1, resetAt: current + options.windowMs });
        return { allowed: true, remaining: options.limit - 1 };
      }
      if (bucket.count >= options.limit) {
        return { allowed: false, remaining: 0 };
      }
      bucket.count += 1;
      return { allowed: true, remaining: options.limit - bucket.count };
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/web && pnpm vitest run src/utils/widget/__tests__/rate-limit.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/utils/widget/rate-limit.ts apps/web/src/utils/widget/__tests__/rate-limit.test.ts
git commit -m "feat(web): add in-memory token-bucket rate limiter"
```

---

## Task 2: Apply rate limit + body-size guard to `/api/ingest`

**Files:**
- Modify: `apps/web/src/app/api/ingest/route.ts`

- [ ] **Step 1: Add a module-level limiter and guards**

In `apps/web/src/app/api/ingest/route.ts`, add near the top (after imports):

```ts
import { createRateLimiter } from '@/utils/widget/rate-limit';

const MAX_BODY_BYTES = 100 * 1024; // 100 KB JSON cap (image goes via signed URL, not here)
const ingestLimiter = createRateLimiter({ limit: 20, windowMs: 60_000 });

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}
```

- [ ] **Step 2: Enforce body size and rate limit at the start of `POST`**

In the `POST` handler, immediately after computing `const headers = corsHeaders(origin);`, insert:

```ts
  const contentLength = Number(req.headers.get('content-length') ?? '0');
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: 'Payload too large', code: 'payload_too_large' },
      { status: 413, headers }
    );
  }
```

Then, after the payload is parsed and validated (right after `const payload = parsed.data;`), insert:

```ts
  const limit = ingestLimiter.check(`${payload.projectKey}:${clientIp(req)}`);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', code: 'rate_limited' },
      { status: 429, headers }
    );
  }
```

- [ ] **Step 3: Typecheck + manual verification**

Run: `cd apps/web && pnpm tsc --noEmit` → clean.

Run `pnpm web#dev`, then fire 25 quick requests and confirm later ones return 429:

```bash
for i in $(seq 1 25); do \
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/ingest \
  -H 'content-type: application/json' -H 'origin: http://localhost:3000' \
  -d '{"projectKey":"pk_e2e","type":"bug","description":"x","reporterName":null,"reporterEmail":null,"pageUrl":"http://localhost:3000/","browser":"Chrome","os":"macOS","screenSize":"1x1"}'; \
done
```
Expected: a mix of `200` then `429` once the per-key/IP limit is hit. (Requires the seeded `pk_e2e` project from Task 5.)

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/api/ingest/route.ts
git commit -m "feat(web): rate-limit and size-guard the ingest endpoint"
```

---

## Task 3: Lock in widget build ordering

**Files:**
- Modify: `apps/web/package.json`

- [ ] **Step 1: Declare the workspace dependency**

In `apps/web/package.json`, add to `devDependencies`:

```json
    "@nextbase/widget": "workspace:*",
```

This makes Turbo's `^build` build `@nextbase/widget` before `web`, so its `closeBundle` copies `widget.js` into `apps/web/public/` before the Next build runs.

- [ ] **Step 2: Install + verify build order**

Run from repo root:
```bash
pnpm install
pnpm build
```
Expected: `@nextbase/widget#build` runs before `web#build`; `apps/web/public/widget.js` exists after the build.

- [ ] **Step 3: Commit**

```bash
git add apps/web/package.json pnpm-lock.yaml
git commit -m "chore(web): build widget bundle before web build"
```

---

## Task 4: Seed an e2e project

**Files:**
- Modify: `apps/database/supabase/seed.sql`

- [ ] **Step 1: Append seed data**

Append to `apps/database/supabase/seed.sql`:

```sql
-- E2E fixture: a workspace + active project keyed for local ingest tests.
INSERT INTO auth.users (id, email)
VALUES ('e2e00000-0000-0000-0000-000000000001', 'e2e-owner@test.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.workspaces (id, name, slug, owner_id)
VALUES ('e2e00000-0000-0000-0000-0000000000a1', 'E2E Workspace', 'e2e-workspace', 'e2e00000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.workspace_members (workspace_id, user_id, role)
VALUES ('e2e00000-0000-0000-0000-0000000000a1', 'e2e00000-0000-0000-0000-000000000001', 'owner')
ON CONFLICT (workspace_id, user_id) DO NOTHING;

INSERT INTO public.projects (id, workspace_id, name, public_key, allowed_domains, is_active)
VALUES (
  'e2e00000-0000-0000-0000-0000000000b1',
  'e2e00000-0000-0000-0000-0000000000a1',
  'E2E Project',
  'pk_e2e',
  ARRAY['localhost', '127.0.0.1'],
  true
)
ON CONFLICT (id) DO NOTHING;
```

- [ ] **Step 2: Apply + verify**

Run: `cd apps/database && supabase db reset`
Then:
```bash
curl -s -X POST http://localhost:3000/api/ingest -H 'content-type: application/json' \
  -H 'origin: http://localhost:3000' \
  -d '{"projectKey":"pk_e2e","type":"bug","description":"seeded","reporterName":null,"reporterEmail":null,"pageUrl":"http://localhost:3000/","browser":"Chrome","os":"macOS","screenSize":"1x1"}'
```
Expected: JSON with `reportId` and `uploadUrl`. (Run `pnpm web#dev` first.)

- [ ] **Step 3: Commit**

```bash
git add apps/database/supabase/seed.sql
git commit -m "test(db): seed an e2e project for ingest tests"
```

---

## Task 5: Playwright E2E for the ingest happy path

**Files:**
- Create: `apps/web/e2e/ingest.spec.ts`

- [ ] **Step 1: Write the test**

Create `apps/web/e2e/ingest.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

const VALID_PAYLOAD = {
  projectKey: 'pk_e2e',
  type: 'bug',
  description: 'E2E submitted feedback',
  reporterName: null,
  reporterEmail: null,
  pageUrl: 'http://localhost:3000/',
  browser: 'Chrome',
  os: 'macOS',
  screenSize: '1440x900',
};

test('accepts a valid report from an allowed origin', async ({ request }) => {
  const res = await request.post('/api/ingest', {
    headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
    data: VALID_PAYLOAD,
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.reportId).toBeTruthy();
  expect(body.uploadUrl).toContain('screenshots');
});

test('rejects a foreign origin', async ({ request }) => {
  const res = await request.post('/api/ingest', {
    headers: { 'content-type': 'application/json', origin: 'https://evil.com' },
    data: { ...VALID_PAYLOAD, pageUrl: 'https://evil.com/' },
  });
  expect(res.status()).toBe(403);
});

test('rejects an unknown project key', async ({ request }) => {
  const res = await request.post('/api/ingest', {
    headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
    data: { ...VALID_PAYLOAD, projectKey: 'pk_nope' },
  });
  expect(res.status()).toBe(401);
});
```

- [ ] **Step 2: Run the test**

Ensure the local stack is running (`pnpm database#start`) and the project is seeded (Task 4). Then:

Run: `pnpm --filter web test:e2e -- ingest.spec.ts`
Expected: 3 passed. (Playwright's `webServer` config starts the app; confirm `playwright.config.ts` `use.baseURL` is `http://localhost:3000`. If E2E previously rate-limited, the limit is 20/min — three requests are fine.)

- [ ] **Step 3: Commit**

```bash
git add apps/web/e2e/ingest.spec.ts
git commit -m "test(web): add e2e coverage for ingest happy/rejection paths"
```

---

## Task 6: Remove the `private_items` demo

**Files:**
- Delete: `apps/web/src/app/(app-pages)/private-items/`, `apps/web/src/app/(app-pages)/private-item/`, `apps/web/src/data/user/privateItems.ts`, `apps/web/src/data/anon/privateItems.ts`
- Modify: `apps/web/src/app/(app-pages)/dashboard/page.tsx`, `apps/web/src/app/(app-pages)/ClientPage.tsx` (and any demo components under `dashboard/`), `apps/web/src/supabase-clients/middleware.ts`, `apps/web/src/utils/effect-supabase-queries.ts`
- Create: `apps/database/supabase/migrations/<ts>_drop_private_items.sql`

- [ ] **Step 1: Find every reference**

Run (using ripgrep): search the web app for `private_items`, `privateItem`, and `PrivateItem`:

Run: `cd apps/web && rg -l "private_items|privateItem|PrivateItem" src`
Record the list of files. Expected hits include the demo routes, `data/*/privateItems.ts`, `ClientPage.tsx`, dashboard sections, `effect-supabase-queries.ts`, and `middleware.ts`.

- [ ] **Step 2: Delete the demo routes and queries**

Delete these paths:
- `apps/web/src/app/(app-pages)/private-items/`
- `apps/web/src/app/(app-pages)/private-item/`
- `apps/web/src/app/(app-pages)/PrivateItemsList.tsx`
- `apps/web/src/data/user/privateItems.ts`
- `apps/web/src/data/anon/privateItems.ts`

- [ ] **Step 3: Repurpose `/dashboard` as a redirect**

Replace `apps/web/src/app/(app-pages)/dashboard/page.tsx` with:

```tsx
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  redirect('/inbox');
}
```

Delete the demo-only files in that folder that referenced private items (e.g. `dashboard/ClientPage.tsx`, `dashboard/dashboard-private-items-section.tsx`, `dashboard/dashboard-list-skeleton.tsx`, `dashboard/new/`, and `(app-pages)/ClientPage.tsx`) — confirm each via the rg output from Step 1 and remove only those that exist and reference the demo.

- [ ] **Step 4: Remove the private-items effect helper**

In `apps/web/src/utils/effect-supabase-queries.ts`, remove the `insertPrivateItemEffect` export (and any `private_items`-typed helpers). If the file becomes empty, delete it. Remove its imports from any remaining file.

- [ ] **Step 5: Clean middleware**

In `apps/web/src/supabase-clients/middleware.ts`, remove `'/private-item'`, `'/private-items'`, `'/items'`, `'/item'` from `protectedPages`, leaving:

```ts
  const protectedPages = [
    '/dashboard',
    '/onboarding',
    '/projects',
    '/inbox',
    '/members',
    '/settings',
  ];
```

- [ ] **Step 5b: Remove stale sidebar nav entries**

In `apps/web/src/app/(app-pages)/app-sidebar-client.tsx`, remove the `Dashboard` and `Private Items` entries from `navigationItems` (drop the now-unused `Home` and `Lock` imports), leaving Inbox / Projects / Members / Settings:

```tsx
const navigationItems: { title: string; url: string; icon: React.ElementType }[] = [
  { title: 'Inbox', url: '/inbox', icon: Inbox },
  { title: 'Projects', url: '/projects', icon: FolderKanban },
  { title: 'Members', url: '/members', icon: Users },
  { title: 'Settings', url: '/settings', icon: Settings },
];
```

- [ ] **Step 6: Drop the tables**

Run: `cd apps/database && supabase migration new drop_private_items`
Paste:

```sql
DROP TABLE IF EXISTS public.private_items CASCADE;
DROP TABLE IF EXISTS public.items CASCADE;
DROP FUNCTION IF EXISTS public.set_private_item_owner_id() CASCADE;
```

Also remove the now-obsolete `private_items` assertions from `apps/database/supabase/tests/database_test.sql` (delete the tests that reference `private_items`, and lower the `plan(N)` count accordingly), or delete that test file if it only covered the demo.

- [ ] **Step 7: Apply, regenerate types, typecheck**

```bash
cd apps/database && supabase db reset && supabase test db
cd apps/database && supabase gen types typescript --local > ../web/src/lib/database.types.ts
cd ../.. && pnpm typecheck && pnpm lint
```
Expected: DB tests pass; `private_items` no longer in `database.types.ts`; typecheck/lint clean (fix any dangling imports the compiler flags).

- [ ] **Step 8: Verify the app**

Run `pnpm web#dev` → `/dashboard` redirects to `/inbox`; no broken links remain in the sidebar.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: remove private_items demo and switch landing to inbox"
```

---

## Task 7: Final full verification

- [ ] **Step 1: Run the whole suite**

```bash
cd apps/database && supabase test db
cd ../.. && pnpm --filter web test
cd packages/widget && pnpm test
cd ../.. && pnpm typecheck && pnpm lint
pnpm --filter web test:e2e -- ingest.spec.ts
```
Expected: all green.

- [ ] **Step 2: Smoke-test the full product loop**

1. `pnpm database#start`, `pnpm build` (widget copied), `pnpm web#dev`.
2. Sign up → onboarding → create workspace → land on `/inbox`.
3. Create a project, add `localhost` to allowed domains, copy the snippet into `widget-test.html`.
4. Submit feedback from `widget-test.html` (capture → annotate → send).
5. See it in `/inbox`, open it, change status/assignee, add a label + comment.
6. Invite a teammate via link; accept it in another session.

- [ ] **Step 3: Commit any final fixes**

```bash
git add -A
git commit -m "chore: final hardening pass for ybug clone mvp"
```

---

## Self-check (end of milestone)

- [ ] Rate limiter + ingest guards covered by unit tests; 429/413 reachable manually.
- [ ] Widget bundle is built before the web build via the workspace dependency.
- [ ] Playwright ingest spec passes (200 / 403 / 401).
- [ ] `private_items` fully removed; `/dashboard` redirects to `/inbox`; typecheck/lint clean.
- [ ] Full manual product loop works end-to-end.
