# Ybug Clone — Implementation Plan Overview

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement these plans task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a launchable multi-tenant Ybug clone (visual feedback + bug reporting) on the NextBase Next.js 16 + Supabase starter.

**Source spec:** `docs/superpowers/specs/2026-06-24-ybug-clone-mvp-design.md`

This MVP is split into 7 sequential milestone plans. Each produces working, testable software and builds on the previous one. Implement in order.

| #   | Plan file                                  | Produces                                                                          |
| --- | ------------------------------------------ | --------------------------------------------------------------------------------- |
| 1   | `2026-06-24-ybug-m1-tenancy-foundation.md` | Workspaces, members, RLS helpers, onboarding; service-role client                 |
| 2   | `2026-06-24-ybug-m2-projects.md`           | Projects CRUD, public keys, allowed-domains, install snippet, `widget-config` API |
| 3   | `2026-06-24-ybug-m3-widget.md`             | `packages/widget`: capture → annotate → form (served at `/widget.js`)             |
| 4   | `2026-06-24-ybug-m4-ingestion.md`          | `/api/ingest`, signed Storage uploads — closes the end-to-end loop                |
| 5   | `2026-06-24-ybug-m5-inbox.md`              | Feedback inbox + report detail (status, assignee, comments, labels, filters)      |
| 6   | `2026-06-24-ybug-m6-members.md`            | Member management + invite-by-link                                                |
| 7   | `2026-06-24-ybug-m7-hardening.md`          | Rate limiting, CORS hardening, E2E, polish                                        |

---

## Shared conventions (apply to every plan)

These are referenced by all milestone plans. Read once.

### Commands

- **Start local stack:** `pnpm database#start` (from repo root)
- **New migration file:** `cd apps/database && supabase migration new <name>` → creates `apps/database/supabase/migrations/<timestamp>_<name>.sql`; paste the SQL into that file.
- **Apply migrations locally:** `cd apps/database && supabase db reset` (re-runs all migrations + `seed.sql` on the local DB). Use this after adding/editing a migration.
- **Regenerate DB types (canonical command used in every plan):**
  ```bash
  cd apps/database && supabase gen types typescript --local > ../web/src/lib/database.types.ts
  ```
  The web app imports these via `@/lib/database.types`.
- **Run DB (pgTAP) tests:** `cd apps/database && supabase test db`
- **Run web unit tests:** `pnpm --filter web test` (Vitest, root `src`)
- **Run a single web test:** `cd apps/web && pnpm vitest run src/path/to/file.test.ts`
- **Run E2E:** `pnpm --filter web test:e2e`
- **Typecheck / lint:** `pnpm typecheck` / `pnpm lint`

### Database conventions

- Every table: `id uuid primary key default extensions.uuid_generate_v4()`, `created_at timestamptz not null default timezone('utc', now())`, `updated_at timestamptz not null default timezone('utc', now())`.
- `updated_at` is maintained by the existing `public.set_updated_at()` trigger function (created in `20251109011059_create_blog_posts.sql`). Add a trigger per table:
  ```sql
  CREATE TRIGGER set_updated_at_<table>
    BEFORE UPDATE ON public.<table>
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  ```
- All app tables have `ENABLE ROW LEVEL SECURITY`.

### Canonical table & enum names (do not rename across plans)

- Tables: `workspaces`, `workspace_members`, `workspace_invitations`, `projects`, `feedback_reports`, `feedback_comments`, `labels`, `feedback_report_labels`.
- `workspace_members.role`: `'owner' | 'admin' | 'member'`.
- `workspace_invitations.status`: `'pending' | 'accepted' | 'revoked'`.
- `feedback_reports.type`: `'bug' | 'idea' | 'question'`.
- `feedback_reports.status`: `'new' | 'in_progress' | 'done'`.

### Canonical RLS helper functions (created in M1, used everywhere)

- `public.is_workspace_member(p_workspace_id uuid) returns boolean`
- `public.current_workspace_role(p_workspace_id uuid) returns text`
- `public.has_workspace_role(p_workspace_id uuid, p_roles text[]) returns boolean`
- `public.create_workspace(p_name text, p_slug text) returns uuid` (SECURITY DEFINER bootstrap)

All are `SECURITY DEFINER` with `SET search_path = public, extensions` and key off `auth.uid()`.

### Canonical app modules (created across plans, do not rename)

- `apps/web/src/supabase-clients/service-role.ts` → `createServiceRoleClient()` (M1)
- `apps/web/src/data/user/workspaces.ts` (M1)
- `apps/web/src/data/user/projects.ts` (M2)
- `apps/web/src/data/user/feedback.ts` (M5)
- `apps/web/src/data/user/members.ts` (M6)
- `apps/web/src/utils/widget/domain-match.ts` → `isOriginAllowed(origin, allowedDomains)` (M2)
- `apps/web/src/utils/zod-schemas/ingest.ts` → `ingestPayloadSchema` (M4)
- `packages/widget/*` (M3)

### Commit discipline

Commit after each task's tests pass (the final step of every task). Use Conventional Commits (`feat:`, `test:`, `chore:`). Never commit `.oneignore`.

### Definition of done per milestone

- New unit tests + pgTAP tests pass.
- `pnpm typecheck` and `pnpm lint` clean.
- Types regenerated and committed when the schema changed.
