---
name: nextbase-safe-actions-data
description: Use for NextBase server actions, next-safe-action clients or hooks, forms, Zod validation, authenticated mutations, RLS ownership, data-layer placement, invalidation, redirects, or the optional Effect bridge.
---

# NextBase Safe Actions and Data

Load the relevant vendored `safe-action-*` skill for API details and the `supabase` skill for database behavior.

## Action Boundary

- Use `actionClient` from `src/lib/safe-action.ts` for unauthenticated flows such as sign-in and password recovery.
- Use `authActionClient` for authenticated work. It supplies `ctx.userId`; do not accept the owner ID from input.
- Keep action modules server-only and place auth actions in `src/data/auth`, user-scoped actions in `src/data/user`, and reusable server reads in the closest existing data layer.
- Define a Zod schema at the action boundary. Client form validation improves feedback but does not replace server validation.

## Mutation Workflow

1. Parse and validate with the action schema.
2. Derive identity and ownership from `ctx`, never from untrusted input.
3. Execute through the server Supabase client so cookies and RLS apply.
4. Check and surface database errors without leaking secrets or internal policy details.
5. Invalidate the narrow path or cache tag affected by the successful mutation.
6. Redirect only after the mutation and invalidation succeed.

RLS is the final authorization boundary. An action-level owner filter is defense in depth, not a replacement for an RLS policy.

## Client Forms

- Keep the form as the smallest possible Client Component.
- Use the maintainer hook appropriate to the UX (`useAction`, optimistic action, or state action) and its status/callback API instead of duplicating loading and error state.
- Use shadcn form controls and accessible labels. Preserve progressive enhancement where the flow requires it.
- Stable field errors come from validation results; unexpected server failures belong in a form-level error.

## Effect Bridge

`src/utils/effect-bridge.ts` and the Effect query helpers are optional adapters for typed effectful code. Reuse them where an adjacent action already uses Effect or where typed error composition materially helps. Do not introduce Effect for a simple one-call mutation.

## Verification

Test valid input, invalid input, anonymous calls, authenticated ownership, RLS denial, database failure, invalidation, and redirect behavior at the narrowest suitable layer.
