---
name: nextbase-cache-components
description: Use for NextBase Cache Components, Partial Prefetching, use cache, React request memoization, Suspense placement, route prerendering, or separating shared cached data from personalized Supabase data.
---

# NextBase Cache Components

Load `next-cache-components-optimizer` for current Next.js mechanics and `vercel-react-best-practices` for React performance guidance.

This project enables `cacheComponents` and `partialPrefetching` in `apps/web/next.config.ts`.

## Classify Data First

- Shared, public, deterministic data may be persisted with `'use cache'` when it does not read cookies, headers, session state, or user-specific inputs.
- Personalized or authorization-sensitive data must stay dynamic and must not enter a shared cache scope.
- React `cache()` in `src/rsc-data` deduplicates work during one server render. It is not a persistent cross-request cache.

Never create an anonymous Supabase client merely to make personalized data cacheable. A different client does not change the data's privacy classification.

## Composition Pattern

1. Keep the route shell and shared headings cacheable when safe.
2. Move cookie, claim, search-param, and personalized reads into a dynamic child.
3. Put a focused `<Suspense>` boundary directly around that dynamic child.
4. Use a stable fallback with the same broad geometry as the resolved UI.
5. Start independent reads before awaiting them and avoid serial waterfalls.

Keep `'use cache'` at the narrowest scope with an explicit, reviewable data contract. Do not hide runtime APIs behind helpers called from a cached scope.

## Invalidation

After a successful mutation, invalidate the exact path or tag that owns the stale shared data. Personalized dynamic reads normally refresh through navigation or re-render and should not be placed in a shared tag to force reuse.

## Verification

Run the Next.js build to catch prerender/runtime boundary errors. Exercise a cold navigation, a prefetched navigation, an anonymous request, and two distinct authenticated users to prove no personalized data crosses requests.
