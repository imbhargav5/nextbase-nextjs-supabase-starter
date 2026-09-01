---
name: nextbase-testing
description: Use for choosing, writing, or running NextBase Vitest, Testing Library, Playwright, smoke, integration, or end-to-end tests and for deciding the required local verification commands.
---

# NextBase Testing

## Choose the Narrowest Honest Test

| Behavior                                                         | Test layer                                  |
| ---------------------------------------------------------------- | ------------------------------------------- |
| Pure utilities, schemas, action helpers, and error mapping       | Vitest                                      |
| React rendering and user interaction isolated from navigation    | Testing Library with Vitest                 |
| Auth, redirects, routing, browser state, and complete user flows | Playwright                                  |
| Schema, constraints, policies, and RLS                           | `pnpm --dir apps/database test-db`          |
| Fast page availability and obvious UI regressions                | Browser smoke check plus console inspection |

Do not replace an integration test with mocks when cookie propagation, RLS, navigation, or framework behavior is the subject under test.

## Environment

- Follow `./setup.sh` and the root `AGENTS.md` for local setup.
- Keep environment files at the repository root. Never overwrite an existing `.env.local` or `.env.development.local`.
- Start local Supabase and sync its generated keys before auth, database, or E2E work.
- Use the repository's pinned Node and pnpm versions rather than changing toolchains inside a test.

## Test Design

- Select by accessible role, name, label, or an explicit stable test ID. Avoid marketing copy, generated class names, and positional selectors.
- Give each test unique data and clean it up. Do not depend on execution order.
- Assert user-visible outcomes and durable state, not implementation details.
- Capture the failing regression before fixing it when practical.
- For smoke checks, verify the expected HTTP status, the key interactive landmark, and browser console errors; a listening port alone is not success.

## Verification Ladder

Run the smallest relevant command first, then expand in proportion to risk:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

Database changes also require `pnpm --dir apps/database test-db`. Report any skipped layer and the concrete external prerequisite that blocked it.
