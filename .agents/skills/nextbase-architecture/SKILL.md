---
name: nextbase-architecture
description: Use for NextBase architecture decisions, adding or moving routes, components, data access, packages, or shared modules, and deciding server/client or trust boundaries in this repository.
---

# NextBase Architecture

Use this repository's existing structure as the source of truth. Inspect neighboring files before creating a new pattern.

## Repository Map

- `apps/web` is the Next.js application.
- `apps/database` owns the local Supabase project, declarative schemas, generated migrations, and pgTap tests.
- Root commands delegate work through Turborepo. Put package-specific commands in the owning package, then expose them through `turbo.json` when the whole repository needs them.
- Shared packages belong under `packages` only when more than one app consumes them. Do not create a package to avoid a local import.

## Web Placement

- `src/app/(external-pages)`: public marketing and informational routes.
- `src/app/(auth-pages)`: sign-in, sign-up, password, and auth callback routes.
- `src/app/(app-pages)`: authenticated application routes.
- `src/components/ui`: shadcn primitives owned by this repository.
- `src/components`: product-level composition around those primitives.
- `src/data/anon`: reads that do not require an authenticated action context. The name does not waive RLS.
- `src/data/auth`: authentication actions.
- `src/data/user`: authenticated mutations and user-scoped queries.
- `src/rsc-data`: request-memoized server reads used by React Server Components.
- `src/supabase-clients`: browser, server, and middleware Supabase client factories.
- `src/lib`: shared application infrastructure; `src/utils`: focused helpers and adapters.

## Boundaries

1. Default to Server Components. Add `'use client'` only to the smallest interactive leaf.
2. Keep secrets, cookie access, database clients, and authenticated data access on the server. Mark server-only infrastructure with `import 'server-only'` where appropriate.
3. Treat route protection and hidden UI as navigation conveniences, not authorization. RLS and server-side ownership checks are the trust boundary.
4. Validate every mutation at the server action boundary. Never accept an owner or user ID from form input when it is available from authenticated context.
5. Use aliases from the existing TypeScript and shadcn configuration. Do not reach across packages with relative imports.
6. Preserve route-group intent. Route groups organize layouts and access patterns without changing public URLs.

## Change Workflow

1. Inspect the closest route, data module, component, and package scripts.
2. Choose the owning layer before writing code.
3. Reuse an existing client, action client, schema, component, or task rather than introducing a parallel abstraction.
4. Verify the narrow package first, then the relevant root task: `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` as risk requires.
5. For schema, auth, cache, UI, or testing work, also load the matching NextBase overlay and relevant maintainer skill.
