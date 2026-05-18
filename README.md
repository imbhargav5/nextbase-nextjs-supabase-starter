# NextBase — Production Next.js + Supabase Boilerplate

> The production-grade Next.js 16 + Supabase foundation your team would have built in three months — shipped to you on day one.

NextBase is a premium, license-protected boilerplate engineered for teams who would rather ship a product than re-derive the same authentication, RLS, monorepo, and caching architecture from scratch. It is the opinionated, tested, and continuously maintained starting point we wish existed when we shipped our last five SaaS products.

- **Demo:** _[live demo URL]_
- **Documentation:** _[docs URL]_
- **Changelog:** see [`CHANGELOG.md`](./CHANGELOG.md)
- **License:** Commercial — see [License & Usage](#license--usage)

> **Ready to skip three months of plumbing?** Purchase a license to get repository access, lifetime updates within your purchased version, and onboarding documentation. **[→ Get Access](#final-cta)**

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
NextBase deploys to any Node 22+ host. Vercel is the path of least resistance:
- Set the same env vars as production secrets.
- Point your custom domain at the deployment.
- Configure the Supabase project's allowed redirect URLs (`<your-domain>/auth/callback`).

---

## Production features

NextBase is engineered with the assumption that someone is paying you on the other side of the request.

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

**NextBase is for you if:**
- You're a founder, indie hacker, or small team shipping a SaaS on Next.js + Supabase and you want to compress months of plumbing into a weekend of customization.
- You're a senior engineer who wants a credible starting point you can audit line-by-line, not a black-box CLI generator.
- You've already shipped on Supabase and want a reference architecture for RLS, SSR cookies, and Cache Components that you can trust.
- You bill clients for outcomes, not hours, and reusing a strong foundation across projects is a margin lever.

**NextBase is _not_ for you if:**
- You need a no-code or visual builder.
- You're learning React or TypeScript for the first time — this codebase assumes professional fluency.
- You want a non-Supabase stack (Firebase, Clerk + Postgres, etc.). Use a starter built for that combination.
- You expect a fully bespoke implementation of your specific feature set as part of the purchase.

---

## Comparison

| | Build from scratch | Free starter | **NextBase** |
|---|---|---|---|
| Days to first authenticated route | 5–10 | 1–2 | **< 1 hour** |
| SSR-correct Supabase auth | Often broken on first try | Sometimes | **Yes** |
| RLS policies with tests | Rare | No | **Yes** |
| Typed server actions + Zod | Manual | Inconsistent | **Yes** |
| Cache Components strategy | DIY | No | **Yes, documented** |
| Monorepo with Turbo + Changesets | Weeks of setup | No | **Yes** |
| Local Supabase + remote parity | Manual | Partial | **Yes** |
| E2E + unit test scaffolding | Manual | Partial | **Yes** |
| Documented upgrade path | None | None | **Yes** |
| Ongoing maintenance & updates | You | Community drift | **Maintained** |

---

## Included vs not included

**Included with your license:**
- Full source code for the monorepo (`apps/web`, `apps/database`, `packages/*`).
- All future updates within your purchased major version, distributed via the licensed repository.
- Setup guides, architecture documentation, and the Cache Components playbook under `docs/`.
- Starter components, route groups, and reference CRUD flow (private items) you can rename and extend.
- Production-ready Auth, Database, Middleware, and CI scaffolding.
- Pre-configured shadcn/ui component library on Radix.

**Not included:**
- Custom feature development for your specific product.
- Hosting, Supabase, or any third-party service costs (Vercel, Supabase, email providers, analytics, observability).
- Done-for-you implementation, customization, or branding.
- Guaranteed data migration from your existing codebase.
- Unlimited 1:1 consulting, pair programming, or live debugging sessions.
- White-glove DevOps, SRE, or production incident response.

---

## License & usage

NextBase ships under a **commercial use license**. Purchase grants a per-team license — see your license terms email for the precise seat count.

**You MAY:**
- Use NextBase as the foundation for **unlimited commercial end products** owned by your licensed team or organization.
- Modify, extend, fork, and customize the source freely inside your licensed organization.
- Use NextBase for **client work**, provided each delivered product is shipped to a single end client and the source is not separately redistributed.
- Deploy commercially to any infrastructure (Vercel, AWS, your own metal — your call).
- Build internal tooling, micro-SaaS, agencies' product suites, and SaaS products with it.

**You MAY NOT:**
- Redistribute the source code, in whole or in part, publicly or privately, to anyone outside your licensed team.
- Resell, relicense, or sublicense NextBase or a derivative whose primary value is NextBase itself.
- Publish the source to a public repository, gist, paste service, or training dataset.
- Create a competing boilerplate, starter, or template product derived from NextBase.
- Transfer the license, repository access, or seats outside your purchased team/organization without written approval.
- Share your repository access credentials.

**Ownership & IP.** NextBase is provided **AS IS**, without warranty of any kind, express or implied, including merchantability, fitness for a particular purpose, and noninfringement. You retain full ownership of the products **you build with** NextBase. The NextBase source itself, its architecture, and its documentation remain the intellectual property of the maintainers. No part of this codebase grants you trademark or branding rights.

By using NextBase you accept these terms. The complete legal text lives in [`LICENSE`](./LICENSE).

---

## Support policy

Support is **best-effort**, scoped to the boilerplate itself, and offered via the channels listed in your purchase confirmation.

**Support includes:**
- Installation and initial setup clarification on a stock NextBase checkout.
- Bug reports against unmodified NextBase code with a reproducible scenario.
- Questions about documented features and conventions.
- Environment variable and Supabase configuration guidance.
- Investigation of reproducible issues with a minimal repro.
- Guidance on upgrading between NextBase versions within your purchased major version.

**Support does _not_ include:**
- Building custom features, business logic, or product-specific UI on your behalf.
- Debugging code that has been heavily modified, refactored, or migrated away from NextBase patterns.
- DevOps, infrastructure, hosting, DNS, or third-party vendor administration.
- Teaching React, TypeScript, SQL, or general web development fundamentals.
- Emergency or SLA-backed response times.
- Resolving outages caused by Supabase, Vercel, or other third parties.
- Migrating your existing codebase onto NextBase.
- Full codebase reviews, audits, or architecture consulting.

**No guaranteed response times.** We respond as fast as we reasonably can, in the order requests arrive, during regular working hours. Excessive, abusive, or extractive requests (free consulting, demand for custom work, mass repeat questions) may be declined. Be specific, be respectful, share a repro — and you'll get help.

---

## Roadmap

NextBase is actively maintained. Recent direction and what's next:

- ✅ Migrate to Next.js 16 + Cache Components.
- ✅ Switch to `oxlint` / `oxfmt` for sub-second lint feedback on large repos.
- ✅ Changesets-driven release automation with automated "Version Packages" PRs.
- ✅ Playwright + Vitest scaffolding wired into Turbo pipelines.
- 🔜 Expanded RLS test coverage with pgTAP examples per pattern (ownership, team-scoped, role-based).
- 🔜 Built-in subscription billing recipe (Stripe Checkout + webhooks + entitlements).
- 🔜 Teams & invitations reference implementation on top of the current ownership model.
- 🔜 Email transactional pipeline reference (Resend / Postmark) wired to Supabase Auth events.
- 🔜 Optional Drizzle adapter for teams that prefer code-first migrations alongside Supabase's SQL.

Maintenance promise: NextBase tracks Next.js minor releases, Supabase SDK breaking changes, and Node LTS upgrades. You will get a clean upgrade path within your purchased major version.

---

## FAQ

**Q: Can I use NextBase for client projects?**
A: Yes. Each delivered client project counts as one end product. You may not, however, deliver the raw boilerplate as a redistributable artifact.

**Q: Is this open source?**
A: No. NextBase is source-available under a commercial license. You get the full source; you don't get redistribution rights.

**Q: Why Supabase instead of Clerk + Postgres / Auth.js / Firebase?**
A: Supabase gives you Auth, Postgres, RLS, and Storage from one vendor with a real SQL surface, real migrations, and real RLS — without the ergonomics tax of stitching three SDKs together. NextBase is opinionated about that choice.

**Q: Does it support edge runtime?**
A: The middleware is edge-compatible. Server actions and RSCs run on the Node runtime by default, which is the right choice for Supabase SSR cookies and most app logic.

**Q: Can I rip out shadcn / Tailwind / TanStack Query?**
A: Yes, it's your codebase. Support is best-effort once you've replaced significant subsystems.

**Q: Will it scale?**
A: The architecture — Postgres + RLS + Next.js + Vercel/Node — runs production SaaS at well into seven-figure ARR. The bottleneck is rarely the boilerplate; it's the schema and query patterns you build on top, which is exactly what NextBase makes explicit.

**Q: Do I get updates?**
A: Yes — all updates within your purchased major version are included for the lifetime of that major.

**Q: Can I see the code before buying?**
A: Schedule a walkthrough via the demo link at the top — we'll show you the auth flow, RLS layer, and server-action layer end-to-end.

---

## Final CTA

You can spend the next three months re-deriving an auth flow that survives a refresh, an RLS policy that survives review, and a monorepo that survives a teammate — or you can start shipping product on Monday.

NextBase is the foundation senior engineers wish they'd started with on the last five projects. The license is one-time. The repo is yours. The roadmap keeps moving forward.

**[→ Get a license](#)** &nbsp;·&nbsp; **[Book a walkthrough](#)** &nbsp;·&nbsp; **[Read the docs](./docs)**
