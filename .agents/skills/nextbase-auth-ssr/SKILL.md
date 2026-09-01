---
name: nextbase-auth-ssr
description: Use for NextBase Supabase SSR authentication, browser/server/middleware clients, cookie propagation, protected routes, auth callbacks, redirects, getClaims, getUser, or session handling.
---

# NextBase Auth SSR

Load the vendored `supabase` skill as well. Verify current Supabase SSR guidance before changing auth behavior.

## Existing Client Boundaries

- Browser code uses `createClient()` from `src/supabase-clients/client.ts`.
- Server Components, actions, and route handlers use `createSupabaseClient()` from `src/supabase-clients/server.ts`.
- `src/supabase-clients/middleware.ts` owns request/response cookie refresh. Preserve the complete `getAll`/`setAll` propagation to both the request and response.
- `src/proxy.ts` owns route matching and delegates session refresh. Keep API and static-asset exclusions deliberate.

Only the publishable key may be used in browser-visible code. Never expose a secret or `service_role` key.

## Verification Choice

- Use `getUser()` when the request boundary must revalidate the user with Supabase, especially middleware/proxy route protection and sensitive re-verification.
- Use `getClaims()` for locally verified claims and authenticated IDs inside already protected server work when its guarantees are sufficient.
- Do not authorize from `getSession()` alone. A locally stored session is not a fresh authorization check.
- Use the request-memoized helpers in `src/rsc-data/supabase.ts` instead of repeating auth calls during one render.

## Middleware and Protected Routes

1. Do not insert unrelated work between `createServerClient()` and the auth verification call in middleware.
2. Match actual public URL segments, including nested routes. Test both the route root and a representative child route.
3. Redirect anonymous users to `/login` while preserving cookies set on the Supabase response.
4. Do not treat the protected-route list as data authorization; RLS remains mandatory.

## Callback Safety

1. Exchange the code or verify the OTP before redirecting.
2. Accept a `next` destination only when it is a same-origin relative path beginning with one `/` and not `//`. Reject encoded or decoded absolute URLs and protocol-relative URLs.
3. Construct the final destination from an approved path and the request origin. Never pass arbitrary user input directly to `new URL()`.
4. Send failed verification to `/auth/auth-code-error` and avoid logging tokens or cookie values.
5. Revalidate only after auth state changes successfully.

## Verification

Cover anonymous redirect, authenticated access, cookie refresh, callback success, callback failure, and malicious `next` values. Use the real local Supabase stack for auth integration tests.
