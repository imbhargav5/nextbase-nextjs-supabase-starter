# Ybug Clone — MVP Design Spec

**Date:** 2026-06-24
**Status:** Approved (design); pending implementation plan
**Built on:** NextBase starter (Next.js 16 + Supabase + Turborepo monorepo)

---

## 1. Goal & Scope

Build a **launchable, multi-tenant SaaS** clone of [Ybug](https://ybug.io) — a visual
feedback and bug-reporting tool. Customers embed a small JavaScript widget on their
website; anonymous visitors click it, a screenshot of the page is captured and
annotated, they add a comment, and the report lands in a team dashboard where the
customer's team triages it.

### In scope for v1

1. **Core feedback loop** — widget button → client-side screenshot → annotate
   (pen / rectangle / arrow / blackout) → form (type + description + optional
   name/email) → submit → report appears in the dashboard.
2. **Feedback management** — statuses (`new` / `in_progress` / `done`), assignees,
   internal comments/replies, labels, filtering and search.
3. **Team collaboration** — one workspace per account, invite teammates,
   roles (`owner` / `admin` / `member`).
4. **Minimal auto-metadata** (folded into the core loop because it is essentially
   free and makes a screenshot actionable): page URL, browser, OS, screen size.

### Explicitly deferred (fast-follows, not v1)

- Full metadata / console & JS error-log capture.
- Widget customization beyond basic theme defaults (colors, position, language,
  configurable form fields).
- Integrations (Slack, Jira, GitHub, webhooks, email notifications).
- Billing / Stripe plans and usage gating.
- Transactional email (v1 invites use copyable links instead — see §3).

### Success criteria

- A new user can sign up, create a workspace and a project, copy an install snippet,
  paste it on a real third-party site, and receive an annotated feedback report in
  their inbox.
- A team can triage that report: change status, assign it, comment, and label it.
- Anonymous visitors never gain any access to Supabase or to other workspaces' data.

---

## 2. System Architecture

Three surfaces, one Supabase backend, all inside the existing monorepo.

```
┌─────────────────────────┐         ┌──────────────────────────────────────┐
│  Customer's website      │         │  Our Next.js app (apps/web)            │
│  (third-party domain)    │         │                                        │
│                          │         │  (external)  marketing + docs          │
│  <script src=".../       │         │  (auth)      login / sign-up           │
│   widget.js"             │         │  (app)       DASHBOARD (RLS-scoped):   │
│   data-project-key=...>  │         │              workspace, projects,      │
│        │                 │         │              feedback inbox, members   │
│        ▼                 │         │                                        │
│  Preact widget in        │         │  /widget.js     → serves the bundle    │
│  Shadow DOM:             │  HTTPS  │  /api/ingest    → public, service-role │
│  button → screenshot →   │ ──────▶ │  /api/widget-config → per-project cfg  │
│  annotate → form → send  │  CORS   │  (upload URL returned by /api/ingest)  │
└─────────────────────────┘         └───────────────────┬────────────────────┘
                                                         │
                                          ┌──────────────▼───────────────┐
                                          │  Supabase                      │
                                          │  • Postgres + RLS              │
                                          │  • Auth (dashboard users only) │
                                          │  • Storage (screenshots)       │
                                          └────────────────────────────────┘
```

### Key architectural decisions

- **Two trust zones.**
  - _Dashboard users_ authenticate via Supabase Auth and read/write through RLS
    keyed to workspace membership.
  - _Anonymous widget visitors_ never touch Supabase directly. They only call our
    own public API routes, which validate the project key + domain allowlist and
    then write using the **service role** server-side.
- **Widget is a separate build target** (`packages/widget`, Vite + Preact) emitted as
  a single file that `apps/web` serves at `/widget.js` on our own domain — no extra
  infra.
- **Reuse NextBase patterns** for everything authenticated: `next-safe-action`
  (`authActionClient`) for mutations, RLS-first data model, server components +
  Suspense for reads, shadcn/ui for the UI.
- **New cross-cutting addition:** a workspace/tenancy layer (the starter is
  single-user today via `private_items`).

### Screenshot capture approach (decided)

**Client-side DOM rasterization** — a JS library (`snapdom` / `modern-screenshot`,
with `html2canvas` as fallback) renders the current page's DOM to an image in the
visitor's browser. No permission prompt, instant, captures what the user sees.
Rejected alternatives: native `getDisplayMedia` (permission prompt every time, bad
UX) and server-side headless rendering (operational overhead too high for an MVP).

---

## 3. Data Model & RLS

All tables `snake_case`, with `created_at` + `updated_at` maintained by the existing
`public.set_updated_at()` trigger. The legacy `private_items` reference tables are
removed once the new flow works.

### Tenancy

- **`workspaces`** — `id`, `name`, `slug`, `owner_id` (→ `auth.users`).
- **`workspace_members`** — `workspace_id`, `user_id`, `role`
  (`owner` | `admin` | `member`); unique (`workspace_id`, `user_id`).
- **`workspace_invitations`** — `workspace_id`, `email`, `role`, `token`,
  `status` (`pending` | `accepted` | `revoked`), `expires_at`.
  **v1 uses copyable invite links** (no email provider yet); accepting a link while
  logged in inserts a `workspace_members` row.

### Projects

- **`projects`** — `id`, `workspace_id`, `name`, `public_key` (`pk_…`, unique +
  indexed), `allowed_domains` (`text[]`), `is_active`.

### Feedback

- **`feedback_reports`** — `id`, `project_id`, `workspace_id` (denormalized for RLS
  speed), `type` (`bug` | `idea` | `question`), `description`,
  `status` (`new` | `in_progress` | `done`; extensible), `assignee_id` (nullable →
  member), `reporter_name`, `reporter_email`, `screenshot_path` (Storage),
  `page_url`, `browser`, `os`, `screen_size`, `created_at`.
- **`feedback_comments`** — `id`, `report_id`, `author_id` (→ member), `body`.
- **`labels`** — `id`, `workspace_id`, `name`, `color`.
- **`feedback_report_labels`** — join table (`report_id`, `label_id`).

### RLS model

- A `SECURITY DEFINER` helper `is_workspace_member(ws uuid)` (and
  `has_workspace_role(ws uuid, role text)`) avoids recursive-policy pitfalls.
- Every workspace-scoped table has `SELECT` / `INSERT` / `UPDATE` / `DELETE` policies
  requiring membership; project/member-management and destructive actions
  additionally require `admin` / `owner`.
- **`feedback_reports` has no anon policy at all** — anonymous inserts come only from
  `/api/ingest` via the service role after key + domain validation, so RLS stays
  strict.
- Storage bucket **`screenshots`** is private: dashboard reads via short-lived signed
  download URLs minted server-side for members; the widget writes via a one-time
  signed upload URL minted by the ingest endpoint.

---

## 4. The Widget (`packages/widget`)

### Build & delivery

- New workspace package `packages/widget`, bundled with **Vite (library mode)** into a
  single IIFE `widget.js` (+ source map). Target ES2019 for broad browser support.
  Bundle budget: **< ~60KB gzipped**.
- `apps/web` serves it at **`/widget.js`** (long cache, immutable) on our own domain.
- **Install snippet** (copied from the dashboard):

  ```html
  <script
    async
    src="https://yourapp.com/widget.js"
    data-project-key="pk_live_abc123"
  ></script>
  ```

### Runtime flow (visitor's browser)

1. Boot: read `data-project-key`, call **`GET /api/widget-config?key=…`** → returns
   active flag + theme defaults. Bad/inactive key → widget silently no-ops.
2. Render a **launcher button** inside a **Shadow DOM** root (style isolation both
   directions; all widget CSS scoped to the shadow root).
3. On click → **capture**: rasterize the DOM to a canvas. Cross-origin images that
   would taint the canvas are detected and skipped/placeholdered so capture never
   hard-fails.
4. **Annotate**: screenshot shown on a `<canvas>` overlay with tools — pen,
   rectangle/highlight, arrow, **blackout**. Blackout draws opaque rectangles that are
   **flattened into the bitmap** (sensitive pixels never leave the browser).
5. **Form**: type (Bug / Idea / Question), description, optional name + email.
   Metadata (page URL, browser, OS, screen size) collected automatically from
   `navigator` / `window`.
6. **Submit**:
   - `POST /api/ingest` with the report JSON (no image yet) → server validates key +
     `Origin`, inserts `feedback_reports` (service role), responds with
     `{ reportId, uploadUrl }`.
   - Widget flattens annotations + screenshot to a single PNG/WebP and **PUTs it
     directly to Supabase Storage** via the signed URL (keeps large images off our
     server and under serverless body limits).
   - Success → confirmation state; failure → inline retry.

### Resilience guardrails

- All widget code wrapped so any error is swallowed/logged locally and **never breaks
  the host site**.
- Single global namespace; no leakage into host page globals.

---

## 5. Ingestion API & Security

Plain **Next.js Route Handlers** (not `next-safe-action`, since callers are anonymous
third-party sites), all using the Supabase **service-role** client server-side.

### Endpoints

- **`GET /api/widget-config`** — public. Input: `key`. Returns minimal, non-sensitive
  config (active flag, theme). Fails fast on bad keys.
- **`POST /api/ingest`** — public. Validates → inserts report → returns
  `{ reportId, uploadUrl }` where `uploadUrl` is a one-time signed Storage upload URL
  scoped to `screenshots/{workspace_id}/{report_id}.webp`.

### Security controls

- **Project key:** looked up on `projects.public_key`; inactive/unknown → `401`.
- **Domain allowlist:** request `Origin` must match the project's `allowed_domains`
  (supports subdomain/wildcard rules). Mismatch → `403`. The same list drives the
  **CORS** response headers (never `*`).
- **Validation:** Zod schema on the payload (type enum, length caps on
  description/name/email, URL sanity). Reject oversized/garbage early.
- **Rate limiting / abuse:** per-key + per-IP throttle on `/api/ingest`
  (token-bucket; pluggable, e.g. in-memory or Upstash) plus a max body size.
  Screenshot constrained by signed-URL content type + a Storage size cap.
- **Storage:** `screenshots` bucket private. Upload only via the one-time signed URL;
  dashboard views via short-lived signed download URLs minted server-side for members.
- **PII posture:** blackout flattened client-side; we store only what the visitor
  submitted. Reporter email is optional and free-text.

### Dashboard mutations

Status change, assign, comment, label, project/member CRUD, and invites all stay on
the **`authActionClient`** path — Zod-validated, `ctx.userId` injected, RLS-enforced,
`revalidatePath()` for cache busting. Anonymous writes go through one hardened
service-role choke point; everything authenticated keeps the starter's defense in
depth.

---

## 6. Dashboard

Inside the existing `(app-pages)` route group, replacing the `private-items` demo.

- **`/onboarding`** — first-run: name your workspace (auto-created on first login if
  none exists).
- **`/projects`** — list/create projects; each shows its install snippet,
  `allowed_domains` editor, and active toggle.
- **`/projects/[id]`** — project settings + its feedback.
- **`/inbox`** — the core: feedback list across the workspace with **filters**
  (project, type, status, assignee, label) and search; server-rendered + Suspense,
  paginated.
- **`/inbox/[reportId]`** — report detail: screenshot (signed URL) with annotations,
  metadata panel, status & assignee controls, labels, internal comment thread.
- **`/members`** — members list, role management, and **invite-by-link**
  generation/revocation (Owner/Admin only).
- **`/settings`** — workspace name/slug.

Reuses NextBase conventions: server components for reads (`rsc-data/*`),
`data/user/*` queries under RLS, `authActionClient` for every mutation, shadcn/ui,
`revalidatePath()` after writes.

---

## 7. Error Handling (cross-cutting)

- **Widget:** never throws into host; capture failures degrade gracefully; submit
  failures show inline retry.
- **Ingest API:** typed JSON error envelope (`{ error, code }`), correct status codes,
  CORS headers present on error responses too.
- **Dashboard:** `next-safe-action` validation errors surfaced in forms; signed-URL
  expiry handled by re-minting; `not-found` / empty states for inbox and projects.

---

## 8. Testing

- **Unit (Vitest):** key validation, domain/CORS matching, Zod schemas, annotation
  flatten/blackout, metadata parsing.
- **DB (pgTAP):** RLS — a member of workspace A cannot read workspace B's reports; the
  anon role cannot `SELECT` `feedback_reports`; role-gated mutations enforced.
- **E2E (Playwright):** dashboard CRUD (project → snippet → status/assign/comment) and
  an ingest happy-path hitting `/api/ingest` + signed upload, then seeing the report in
  the inbox. A test harness page hosts the widget for capture/annotate/submit.

---

## 9. Milestones (each independently shippable)

1. **Tenancy layer** — workspaces, members, RLS, onboarding; replaces `private_items`.
2. **Projects** — CRUD + install snippet + `widget-config`.
3. **Widget package** — capture → annotate → submit.
4. **Ingestion API + Storage** — signed uploads; the end-to-end loop closes here.
5. **Inbox + report detail** — status, assignee, comments, labels, filters.
6. **Members + invite-by-link.**
7. **Hardening** — rate limiting, tests, polish.

---

## 10. Open Questions / Future Considerations

- Email provider for invitations + new-feedback notifications (deferred; invite-links
  bridge v1).
- Widget theming/customization surface and configurable form fields.
- Integrations (Slack / Jira / GitHub / webhooks).
- Billing / plan gating.
- Full metadata + console/error-log capture and (optionally) session replay.
