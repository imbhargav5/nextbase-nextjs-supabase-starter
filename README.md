# NextBase Starter — Open Source Next.js + Supabase Boilerplate

> A production-grade Next.js 16 + Supabase foundation. Free, MIT-licensed, and ready to clone.

NextBase Starter is the open-source baseline of the [NextBase](https://usenextbase.com) family — an opinionated, tested starting point for SaaS teams building on Next.js 16 and Supabase. It bundles the auth, RLS, monorepo, and caching patterns that you would otherwise spend weeks deriving from scratch.

- **Demo:** _[live demo URL]_
- **Documentation:** _[docs URL]_
- **Changelog:** see [`CHANGELOG.md`](./CHANGELOG.md)
- **License:** MIT — see [`LICENSE`](./LICENSE)

> **Need more than the starter?** Stripe billing, teams & orgs, RBAC admin, transactional emails, multi-tenancy, AI starter kits — all built on the same patterns — ship as **premium NextBase kits**. **[→ See the premium kits at usenextbase.com](https://usenextbase.com)**

---

## Why this exists

Every SaaS team writes the same code in the first sprint and the same code in the first incident:

- A "simple" Supabase auth integration that quietly breaks SSR cookies after a refresh, then again after a deploy.
- An RLS policy that looked right in review and silently leaked a row in production.
- A server-action layer that was supposed to be type-safe but ended up being three subtly different patterns across the codebase.
- A monorepo that started clean and devolved into a tangle of relative imports and untyped envs.
- A "we'll add caching later" that turns into a `revalidatePath` archaeology dig six months in.

NextBase compresses all of that prior art into a maintained, opinionated starter. You inherit decisions that have already failed in production somewhere else, so they don't have to fail in yours.

---

## Features

### Authentication
- **Supabase Auth, SSR-correct.** `@supabase/ssr` clients for browser, server components, server actions, and middleware — wired so cookies survive every render boundary in Next.js 16.
- **Multiple sign-in methods out of the box:** email + password, passwordless magic link, and OAuth (Google, GitHub, Twitter — add more in minutes).
- **Hardened middleware.** A single source of truth for protected routes (`/dashboard`, `/private-item`, `/private-items`, …) using `path-to-regexp` matching and `supabase.auth.getUser()` re-verification on every request.
- **Battle-tested flows.** Sign-up, sign-in, sign-out, email confirmation, forgot-password, update-password, and OAuth callback / code-error pages — all implemented as Server Actions and tested.

### Database, Permissions & Multi-Tenancy
- **Supabase Postgres with Row Level Security from day one.** Every user-owned table ships with `SELECT`/`INSERT`/`UPDATE`/`DELETE` policies keyed off `auth.uid()`.
- **Versioned migrations.** Real timestamped SQL migrations under `apps/database/supabase/migrations` — not a hand-edited single file.
- **Generated database types.** `pnpm gen-types` (remote) and `pnpm gen-types-local` (local) regenerate `database.types.ts` so every query is end-to-end typed.
- **pgTAP-ready test harness.** A test scaffold under `apps/database/supabase/tests` for asserting RLS policies, triggers, and constraints.
- **`updated_at` triggers** standardized via a single `public.set_updated_at()` function — applied per-table, not duplicated.

### Server Actions, Validation & Data Layer
- **`next-safe-action` everywhere.** All mutating endpoints are Zod-validated, typed end-to-end, and ship with two pre-built clients:
  - `actionClient` — base client with development-time perf + payload logging middleware.
  - `authActionClient` — extends the base client and injects `ctx.userId` for the current user, refusing unauthenticated calls.
- **Clean data-access separation.** Queries are partitioned by trust boundary:
  - `src/data/anon/*` — anonymous, public reads
  - `src/data/auth/*` — authentication flows (sign-in, sign-up, sign-out)
  - `src/data/user/*` — authenticated user data (RLS-enforced)
  - `src/rsc-data/*` — React Server Component data fetchers
- **Optional `effect-ts` integration.** Composable `Effect`-based query helpers and typed Supabase error mapping under `src/utils/effect-*` for teams that want railway-oriented data flow without leaking it into every file.

### Caching, Performance & UX
- **Next.js 16 Cache Components (`cacheComponents: true`).** Static-by-default rendering with surgical `"use cache"` boundaries, plus a written guide ([`docs/NEXTJS_CACHE_COMPONENTS.md`](./docs/NEXTJS_CACHE_COMPONENTS.md)) explaining exactly when and how to use each primitive.
- **Suspense-first data fetching** via `createSuspenseResource` and TanStack Query — clean loading boundaries, no waterfall fetches.
- **Turbopack dev server** for sub-second HMR on real-world component trees.
- **Optimized `next/image` remote patterns** preconfigured for Supabase Storage and Unsplash.

### UI & Developer Experience
- **shadcn/ui pre-installed** with the full Radix primitive set (40+ components: dialogs, command palettes, sidebars, sheets, toasts, hover cards, OTP input, …) — ready to copy, paste, and customize.
- **Tailwind CSS v4** via `@tailwindcss/postcss`, including `@tailwindcss/forms` and `@tailwindcss/typography`.
- **Framer Motion**, **Embla Carousel**, **cmdk**, **input-otp**, **Lucide icons**, **date-fns**, **React Hot Toast** — the entire baseline UI toolkit you would have installed in week one.
- **Strict TypeScript** with shared `packages/typescript-config`, `oxlint` + `oxfmt` (Oxc-based, ~50× faster than ESLint+Prettier), and centralized Zod schemas in `src/utils/zod-schemas`.
- **Tested.** Vitest + Testing Library for unit, Playwright for E2E — both already wired into Turbo pipelines.

### Infrastructure, Observability & Releases
- **Turborepo monorepo** (`apps/*`, `packages/*`) with `pnpm` workspaces and pipelined `build`, `lint`, `test`, `typecheck`, `gen-types`, `test:e2e` tasks.
- **Local Supabase stack** lifecycle scripts: `pnpm database#start | stop | status`.
- **Changesets-based release automation.** Every shippable change ships with a changeset; an automated "Version Packages" PR rolls them into a single bumped release, syncs `apps/web` versions, and cuts a GitHub release.
- **GitHub Actions starter workflows** (Playwright + coverage) included.
- **SEO baked in:** `next-seo`, `next-sitemap` postbuild, JSON-LD and Open Graph helpers.

---

## Screenshots

> _Replace these placeholders with your branded captures once you customize the marketing surfaces._

| | |
|---|---|
| **Landing & marketing** — the `(external-pages)` route group, including the home page and `/about`, ready to be replaced with your positioning. | _[screenshot]_ |
| **Authentication** — login / sign-up / magic-link / forgot-password screens with provider buttons (Google, GitHub, Twitter). | _[screenshot]_ |
| **Dashboard** — the authenticated `(app-pages)` shell with sidebar, breadcrumbs, and a CRUD reference page. | _[screenshot]_ |
| **Private items CRUD** — RLS-protected list, detail (`/private-item/[id]`), and create-new flows demonstrating the full data path. | _[screenshot]_ |

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Cache Components, Turbopack) |
| UI runtime | React 19 |
| Language | TypeScript (strict) |
| Database & Auth | Supabase (Postgres, RLS, Auth, Storage) |
| Auth SSR | `@supabase/ssr` |
| Server Actions | `next-safe-action` + Zod |
| Effects (optional) | `effect` + `@effect/platform` |
| Data fetching | TanStack Query + React Suspense |
| UI primitives | shadcn/ui on Radix UI |
| Styling | Tailwind CSS v4 (PostCSS) + Tailwind Forms / Typography |
| Forms | React Hook Form + Zod resolvers |
| Animation | Framer Motion |
| Lint / Format | oxlint + oxfmt |
| Unit / Integration tests | Vitest + Testing Library + jsdom |
| E2E tests | Playwright |
| Monorepo | Turborepo + pnpm workspaces |
| Releases | Changesets |
| SEO | `next-seo`, `next-sitemap` |

---

## Architecture overview

NextBase is a Turborepo with two apps and shared config packages.

```
nextbase-nextjs-supabase-starter/
├── apps/
│   ├── web/                            # Next.js 16 application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (external-pages)/   # Public marketing routes
│   │   │   │   ├── (auth-pages)/       # login, sign-up, forgot-password,
│   │   │   │   │                       # update-password, auth/callback,
│   │   │   │   │                       # auth/confirm, auth/auth-code-error
│   │   │   │   ├── (app-pages)/        # Authenticated app shell:
│   │   │   │   │                       # dashboard, private-items,
│   │   │   │   │                       # private-item/[privateItemId]
│   │   │   │   └── layout.tsx
│   │   │   ├── components/             # shadcn/ui + auth components
│   │   │   ├── data/
│   │   │   │   ├── anon/               # Public, anonymous data access
│   │   │   │   ├── auth/               # Auth flows (server actions)
│   │   │   │   └── user/               # Authenticated, RLS-scoped queries
│   │   │   ├── rsc-data/               # RSC-only fetchers
│   │   │   ├── supabase-clients/       # browser / server / middleware
│   │   │   ├── lib/                    # safe-action clients, utils
│   │   │   ├── utils/                  # zod schemas, helpers, effect bridge
│   │   │   ├── hooks/
│   │   │   ├── contexts/
│   │   │   └── styles/
│   │   ├── e2e/                        # Playwright specs
│   │   ├── playwright.config.ts
│   │   ├── vitest.config.ts
│   │   └── next.config.ts              # cacheComponents enabled
│   └── database/
│       └── supabase/
│           ├── migrations/             # Timestamped SQL migrations
│           ├── tests/                  # pgTAP-style RLS / schema tests
│           ├── seed.sql
│           └── config.toml
├── packages/
│   └── typescript-config/              # Shared tsconfig presets
├── docs/                               # Architecture & caching guides
├── scripts/                            # Release & env sync scripts
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

### Auth flow
1. **Middleware** (`src/supabase-clients/middleware.ts`) instantiates a server Supabase client, calls `auth.getUser()` to re-verify the session, and redirects unauthenticated visitors away from protected route prefixes.
2. **Server components** call `createSupabaseClient()` to read data under the user's RLS context.
3. **Server actions** use `authActionClient` from `lib/safe-action.ts`, which short-circuits unauthenticated callers and injects `ctx.userId`.
4. **OAuth & email confirmation** complete at `/auth/callback` and `/auth/confirm`, with `/auth/auth-code-error` for failures.

### Permissions model
Authorization is enforced **at the database layer** via Postgres RLS — not in handler code. Every user-owned table has explicit `SELECT`/`INSERT`/`UPDATE`/`DELETE` policies that compare `auth.uid()` to ownership columns. Service-role access is gated separately. This means a forgotten check in a route handler cannot exfiltrate data; the database refuses the read.

### Caching strategy
With `cacheComponents` enabled, route segments are static by default. Static UI (sidebars, breadcrumbs, headings, marketing) is marked `"use cache"`. Personalized data leaves caching off and uses Suspense. Cache invalidation happens via `revalidatePath()` from server actions. The full mental model is documented in [`docs/NEXTJS_CACHE_COMPONENTS.md`](./docs/NEXTJS_CACHE_COMPONENTS.md).

### Server / client boundary
- `lib/safe-action.ts` and all `data/*` modules are `'use server'` or `import 'server-only'`. They never leak into a client bundle.
- Client interactivity is co-located: `ClientPage.tsx`, `*-client.tsx`, and explicit `'use client'` directives.
- Browser Supabase access uses `supabase-clients/client.ts`; server uses `supabase-clients/server.ts` (cookies wired via `next/headers`).

---

## Quick start

### 1. Install
```bash
pnpm install
```

### 2. Configure environment
Copy the examples and fill in your Supabase project details:
```bash
cp .env.local.example apps/web/.env.local
cp .env.development.local.example apps/web/.env.development.local
```

Required variables:
```
SUPABASE_PROJECT_REF=<your-project-ref>
NEXT_PUBLIC_SUPABASE_URL=<https://<ref>.supabase.co | http://localhost:54321>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable / anon key>
```

### 3. Provision the database

**Option A — Local stack (recommended for development):**
```bash
pnpm database#start
pnpm gen-types-local
```

**Option B — Hosted Supabase project:**
```bash
pnpm supabase link --project-ref $SUPABASE_PROJECT_REF
pnpm supabase db push
pnpm gen-types
```

### 4. Run the app
```bash
pnpm dev
# → http://localhost:3000
```

### 5. Test
```bash
pnpm test          # Vitest unit / integration
pnpm test:e2e      # Playwright end-to-end
pnpm typecheck     # tsc --noEmit across the monorepo
pnpm lint          # oxlint
```

### 6. Deploy
The recommended production target is **Vercel** (Next.js app) + **Supabase Cloud** (Postgres, Auth, Storage). See the full [**Production deployment**](#production-deployment) section below for env vars, migrations, build settings, domains, and post-deploy checks.

---

## Production deployment

This is a Turborepo monorepo: a Next.js 16 app (`apps/web`) backed by a Supabase project (`apps/database`). The two pieces deploy to two managed platforms.

| Concern | Production choice | Why |
|---|---|---|
| Database / Auth / Storage | **Supabase Cloud** | The whole data + auth + RLS + storage model is Supabase-native; managed Postgres, connection pooling, and the Auth GoTrue server come as one project. |
| Frontend + SSR + Server Actions | **Vercel** | First-class Next.js 16 support (App Router, Cache Components/PPR, Turbopack, Node runtime for Supabase SSR cookies), zero-config Turborepo monorepo detection. |

> The app is a standard Node Next.js server (`next build` + `next start`), so any Node 24+ host works (Netlify, Fly.io, Render, a container). Vercel is the path of least resistance; the steps below note where a generic host differs.

### 1. Provision the database (Supabase Cloud)

1. Create a project at [supabase.com](https://supabase.com/dashboard). Pick a region close to your Vercel deployment region to minimize SSR latency.
2. Grab the values you'll need from **Project Settings → API**:
   - Project ref (the `<ref>` in `https://<ref>.supabase.co`)
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable / anon key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (this is the *only* Supabase key the client should ever see)
3. Link the local CLI to the hosted project and push migrations:
   ```bash
   pnpm supabase link --project-ref <ref>
   pnpm supabase db push          # applies apps/database/supabase/migrations in order
   pnpm gen-types                 # regenerate database.types.ts against the linked project
   ```
   `db push` replays the timestamped SQL migrations under `apps/database/supabase/migrations`, including every RLS policy and the `set_updated_at` trigger. **Do not** hand-edit tables in the dashboard — add a new migration and push, so prod and the repo never drift.
4. `seed.sql` is local-only sample data. Do **not** seed it into production.

### 2. Configure Supabase Auth for your domain

In **Authentication → URL Configuration**:
- **Site URL**: `https://<your-domain>`
- **Redirect URLs** (exact-match allow-list — the OAuth/email callbacks `/auth/callback` and `/auth/confirm` will silently fail if these are missing):
  ```
  https://<your-domain>/**
  https://<preview-branch-domains>/**   # if you use Vercel preview deployments
  ```

For each OAuth provider you enable (Google, GitHub, Twitter are wired in the UI), create an OAuth app with the provider, set the callback to `https://<ref>.supabase.co/auth/v1/callback`, and paste the client ID/secret into **Authentication → Providers**. Local provider config lives in `apps/database/supabase/config.toml` for reference, but production providers are configured in the dashboard.

### 3. Deploy the web app (Vercel)

Import the repo into Vercel and set:

| Setting | Value |
|---|---|
| Framework preset | Next.js |
| Root directory | `apps/web` (enable **"Include files outside the root directory"** so the workspace + `pnpm-lock.yaml` resolve) |
| Install command | `pnpm install` (auto-detected from `pnpm-lock.yaml`) |
| Build command | `next build` (Vercel runs it inside `apps/web`; `postbuild` runs `next-sitemap`). To build through Turbo from the repo root instead, use `turbo run build --filter=web`. |
| Output | `.next` (default) |
| Node version | **24.x** (the repo pins `>=24` via `.nvmrc` / `package.json engines`; set it in Project Settings → Node.js Version) |

Vercel respects the pinned `packageManager` (`pnpm@11.x`) and Turbo remote caching automatically.

### 4. Environment variables (Vercel → Settings → Environment Variables)

Set these for **Production** (and Preview, pointing at a staging Supabase project if you have one):

| Variable | Example | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` | Public; baked into the client bundle at build time. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` | Public anon/publishable key. Safe for the browser; RLS is what protects data. |
| `SUPABASE_PROJECT_REF` | `<ref>` | Used by type-gen / CLI tooling. |

`NEXT_PUBLIC_*` vars are inlined at **build** time — after changing them you must **redeploy**, not just restart. Never put the Supabase **secret** (`service_role`) key in a `NEXT_PUBLIC_*` var or any client-reachable code.

Also update `apps/web/next-sitemap.config.cjs` (`siteUrl`, currently the `my-awesome-saas.com` placeholder) to your production domain so `sitemap.xml` / `robots.txt` are generated correctly by the `postbuild` step.

### 5. Domains & runtime

- Add your custom domain in Vercel and point DNS as instructed; the generated cert is automatic.
- After the domain is live, go back and update Supabase **Site URL** + **Redirect URLs** (step 2) to the final domain.
- Runtime: Server Actions and RSCs run on the **Node runtime** (correct for Supabase SSR cookies); the middleware (`apps/web/src/proxy.ts`) is edge-compatible. No extra runtime config is required.

### 6. Webhooks, crons & background jobs

This starter ships **no** cron jobs, queues, webhook handlers, or AI/external API integrations — there is nothing extra to provision. If you add them later: Supabase scheduled tasks (`pg_cron`) and Edge Functions live in the Supabase project; inbound webhooks should be added as Next.js Route Handlers under `apps/web/src/app/api/*` (note `proxy.ts` deliberately skips `/api/*` from auth middleware, so verify signatures inside the handler).

### 7. Post-deploy checklist

- [ ] `https://<your-domain>/` renders (marketing home).
- [ ] Sign up → confirm email → sign in works; `/dashboard` is reachable only when authenticated (anonymous hits 307-redirect to `/login`).
- [ ] Each enabled OAuth provider round-trips through `/auth/callback`.
- [ ] A CRUD action on `/private-items` persists and is row-scoped to the user (RLS enforced).
- [ ] `https://<your-domain>/sitemap.xml` and `/robots.txt` resolve with the real domain.
- [ ] No `service_role` key appears in the client bundle (check Network/Sources).

### 8. Common production failures

| Symptom | Cause | Fix |
|---|---|---|
| `Your project's URL and Key are required to create a Supabase client!` (every route 500s) | `NEXT_PUBLIC_SUPABASE_*` not set, or set after build without redeploy | Set both vars and **redeploy**. |
| OAuth / magic-link returns to `/auth/auth-code-error` | Callback domain not in Supabase **Redirect URLs** allow-list | Add `https://<domain>/**` (and preview domains) in Auth → URL Configuration. |
| Tables/policies missing in prod, queries fail or leak | Migrations never pushed, or schema hand-edited in dashboard | Run `pnpm supabase db push`; manage all schema as migrations. |
| Build fails on install / lockfile or `engines` error | Wrong Node, or root dir excludes the workspace | Set Node 24.x; root `apps/web` with "include files outside root directory". |
| `sitemap.xml` points at `my-awesome-saas.com` | `next-sitemap.config.cjs` `siteUrl` placeholder | Set it to the production domain and redeploy. |
| Stale content after a deploy | Cache Components static segments cached | Invalidate via `revalidatePath()` in the relevant Server Action (see [`docs/NEXTJS_CACHE_COMPONENTS.md`](./docs/NEXTJS_CACHE_COMPONENTS.md)). |
| DB connection exhaustion under load | Direct Postgres connections | Use Supabase's pooled connection string (port `6543`) for any non-Supabase-SDK Postgres access. |

---

## Production features

NextBase Starter is engineered with the assumption that someone is paying you on the other side of the request.

- **Defense in depth.** RLS at the DB, middleware at the edge, `authActionClient` at the action boundary — three independent checks before any mutation reaches user data.
- **No client-side service role.** The publishable/anon key is the only Supabase credential the client ever sees. Privileged operations belong in server actions.
- **Type-safe boundaries.** Every server action is Zod-validated. Every query is typed against the generated `database.types.ts`. Drift between schema and code surfaces at build time, not in production.
- **Idempotent auth callbacks.** `/auth/callback` and `/auth/confirm` tolerate replays, expired codes, and double-submits — with explicit `/auth/auth-code-error` redirection on failure.
- **Webhook-ready posture.** Server actions, route handlers, and the safe-action middleware stack are structured for adding webhook validation and idempotency keys without re-plumbing the data layer.
- **Logging hooks.** A development-time logging middleware is wired into `actionClient`; swap it for your observability vendor (Datadog, Sentry, Axiom, Highlight) without touching individual actions.
- **Reproducible builds.** Pinned `pnpm` version via `packageManager`, pinned Node via `.nvmrc` / `.node-version`, Turbo task caching, and Changesets-driven release PRs.
- **SEO production-ready.** Sitemap generated on build (`next-sitemap`), Open Graph + JSON-LD helpers via `next-seo`.

---

## Target audience

**NextBase Starter is for you if:**
- You're a founder, indie hacker, or small team shipping a SaaS on Next.js + Supabase and you want to compress weeks of plumbing into a weekend of customization.
- You're a senior engineer who wants a credible starting point you can audit line-by-line, not a black-box CLI generator.
- You've already shipped on Supabase and want a reference architecture for RLS, SSR cookies, and Cache Components that you can trust.
- You're prototyping or building an MVP and want the auth + DB layer working in an hour.

**NextBase Starter is _not_ for you if:**
- You need a no-code or visual builder.
- You're learning React or TypeScript for the first time — this codebase assumes professional fluency.
- You want a non-Supabase stack (Firebase, Clerk + Postgres, etc.). Use a starter built for that combination.

> Looking for Stripe billing, teams/orgs, RBAC admin, transactional email, multi-tenancy, or AI starter kits? Those are first-class in the [premium NextBase kits](https://usenextbase.com) — see [Need more out of the box?](#need-more-out-of-the-box) below.

---

## Comparison

| | Build from scratch | **NextBase Starter (this repo)** | [Premium NextBase kits](https://usenextbase.com) |
|---|---|---|---|
| License | — | MIT, free | Commercial |
| Days to first authenticated route | 5–10 | **< 1 hour** | < 1 hour |
| SSR-correct Supabase auth | Often broken on first try | **Yes** | Yes |
| RLS-by-default migrations | Rare | **Yes** | Yes |
| Typed server actions + Zod | Manual | **Yes** | Yes |
| Cache Components strategy | DIY | **Yes, documented** | Yes, documented |
| Monorepo with Turbo + Changesets | Weeks of setup | **Yes** | Yes |
| Stripe billing (subscriptions + webhooks) | DIY | No | **Yes** |
| Teams & organizations | DIY | No | **Yes** |
| RBAC + admin panel | DIY | No | **Yes** |
| Transactional emails (React Email) | DIY | No | **Yes** |
| Multi-tenancy patterns | DIY | No | **Yes** |
| AI starter kits (chatbot, RAG, agents) | DIY | No | **Yes (select kits)** |

---

## License

NextBase Starter is released under the **MIT License**. You may use, modify, and distribute it freely — commercial use included — subject to the terms in [`LICENSE`](./LICENSE).

The code is provided **as is**, without warranty of any kind. See the [`LICENSE`](./LICENSE) file for the full text.

---

## Contributing

Contributions are welcome — bug reports, fixes, docs, and pattern improvements.

- Open an issue or PR on GitHub.
- If your change is user-visible, add a changeset with `pnpm changeset`. Merged changesets are rolled into an automated "Version Packages" PR and cut a GitHub release when that PR lands on `main`.
- Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` before submitting.

See [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) for common setup issues.

---

## Roadmap

NextBase Starter is actively maintained. Recent direction and what's next:

- ✅ Migrate to Next.js 16 + Cache Components.
- ✅ Switch to `oxlint` / `oxfmt` for sub-second lint feedback on large repos.
- ✅ Changesets-driven release automation with automated "Version Packages" PRs.
- ✅ Playwright + Vitest scaffolding wired into Turbo pipelines.
- 🔜 Expanded RLS examples and pgTAP test patterns.
- 🔜 Documentation refresh covering the full Cache Components mental model end-to-end.

Maintenance promise: the starter tracks Next.js minor releases, Supabase SDK breaking changes, and Node LTS upgrades. The richer feature kits (billing, teams, admin, email, AI) are maintained on the same cadence inside the [premium NextBase kits](https://usenextbase.com).

---

## Need more out of the box?

This starter is the open-source foundation. The [premium NextBase kits](https://usenextbase.com) ship everything a real SaaS needs on top of it — same architectural DNA, same patterns, dramatically more shipped.

### SaaS essentials
- **Stripe billing.** Subscriptions, one-time payments, customer portal, usage-based metering, and webhook handling — implemented, idempotent, and tested.
- **Teams & organizations.** Org creation, invitations, role assignment, team-scoped data, and team-aware RLS policies.
- **RBAC & admin panel.** Role-based permissions and an admin dashboard for managing users, orgs, and subscriptions.
- **Transactional emails.** React Email templates for auth, billing, and invitation flows, wired to providers like Resend or Postmark.
- **Multi-tenancy patterns.** Schema- and row-level tenant isolation documented and enforced via RLS.
- **Audit logs.** Append-only audit trails for sensitive actions, ready to wire into your admin views.
- **Profiles, onboarding & settings UI.** Production-grade user/profile management screens you'd otherwise build twice.
- **Internationalization (i18n) variants.** App Router-native localization with translated routes and content.
- **Enterprise-grade features.** SSO-friendly auth patterns, role hierarchies, and tooling for teams operating at scale.


### Database & stack variants
- **Drizzle, Prisma, and PlanetScale variants** — for teams that prefer code-first schemas or MySQL/Vitess infrastructure alongside (or instead of) Supabase.

### AI & specialized kits
- **AI chatbot kit** — conversation UI, streaming responses, message history.
- **Vision / image kit** — image understanding and generation flows.
- **Speech-to-text kit** — transcription pipelines wired to Whisper-class models.
- **Video generator kit** — pipelines for generative video.
- **Headshot generator kit** — fine-tune and generate user-personalized images.
- **Browser agent kit** — agentic web browsing and automation.
- **Note-taker kit** — capture, structure, and search long-form notes.
- **Workflow orchestrator kit** — multi-step agent and workflow runner.
- **Shopify / e-commerce variant** — storefront and product flows on the same architecture.

These are not separate codebases you have to context-switch into — they share this starter's conventions for server actions, RLS, Cache Components, and the monorepo layout. The mental model transfers directly.

**[→ Explore the premium NextBase kits at usenextbase.com](https://usenextbase.com)**

---

## FAQ

**Q: Is this really free?**
A: Yes. The starter is MIT-licensed. Use it for personal projects, client work, internal tools, or commercial products. No purchase required.

**Q: What's the difference between this and the premium kits?**
A: This starter covers the foundation — Supabase auth, RLS, server actions, Cache Components, monorepo, tests. The [premium kits](https://usenextbase.com) add the features SaaS products actually need on top: Stripe billing, teams, RBAC + admin, transactional emails, multi-tenancy, and AI starters.

**Q: Can I use the starter for client work?**
A: Yes — MIT permits commercial and client use. Attribution is appreciated but not required.

**Q: Why Supabase instead of Clerk + Postgres / Auth.js / Firebase?**
A: Supabase gives you Auth, Postgres, RLS, and Storage from one vendor with a real SQL surface, real migrations, and real RLS — without the ergonomics tax of stitching three SDKs together. NextBase is opinionated about that choice.

**Q: Does it support edge runtime?**
A: The middleware is edge-compatible. Server actions and RSCs run on the Node runtime by default, which is the right choice for Supabase SSR cookies and most app logic.

**Q: Can I rip out shadcn / Tailwind / TanStack Query?**
A: Yes, it's your codebase. Replace what you don't want — the architecture doesn't depend on any one of them.

**Q: Will it scale?**
A: The architecture — Postgres + RLS + Next.js + Vercel/Node — runs production SaaS at well into seven-figure ARR. The bottleneck is rarely the boilerplate; it's the schema and query patterns you build on top, which is exactly what NextBase makes explicit.

**Q: How do I report a bug or ask a question?**
A: Open a GitHub issue with a reproducible scenario. PRs welcome.

---

## Final CTA

Clone the starter, ship your MVP, and come back for the premium kits when you need real billing, teams, or admin tooling.

**[→ Clone the starter](#quick-start)** &nbsp;·&nbsp; **[Explore premium NextBase kits](https://usenextbase.com)** &nbsp;·&nbsp; **[Read the docs](./docs)**
