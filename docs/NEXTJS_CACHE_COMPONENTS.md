# Next.js Cache Components Guide

This guide explains the Next.js 15+ caching features used in this project, including the `"use cache"` directive, React's `cache()` function, and cache invalidation strategies.

## Table of Contents

- [Overview](#overview)
- [Configuration](#configuration)
- [The "use cache" Directive](#the-use-cache-directive)
- [Static vs Dynamic Rendering](#static-vs-dynamic-rendering)
- [Component Tree Architecture](#component-tree-architecture)
- [React cache() Function](#react-cache-function)
- [Cache Invalidation with revalidatePath()](#cache-invalidation-with-revalidatepath)
- [When to Use What](#when-to-use-what)
- [Best Practices](#best-practices)
- [Examples from This Codebase](#examples-from-this-codebase)

---

## Overview

Next.js 15+ introduces powerful caching primitives that allow you to optimize your application's performance:

1. **`"use cache"`** - Directive to cache entire Server Components
2. **`cache()` from React** - Request memoization for expensive operations
3. **`revalidatePath()`** - On-demand cache invalidation

These features work together to provide a comprehensive caching strategy that reduces server load and improves response times.

---

## Configuration

Enable cache components in your `next.config.ts`:

```typescript
import { NextConfig } from "next";

const config: NextConfig = {
  cacheComponents: true,  // Enable Server Component caching
  // ... other config
};

export default config;
```

This configuration enables Next.js to automatically cache Server Components that use the `"use cache"` directive.

---

## The "use cache" Directive

### What It Does

The `"use cache"` directive marks a Server Component or async function for caching. The component's output is cached and reused across requests until invalidated.

### Basic Syntax

```typescript
async function MyComponent() {
  'use cache';

  return (
    <div>
      {/* Static or rarely changing content */}
    </div>
  );
}
```

### When to Use "use cache"

**Ideal Use Cases:**

1. **Static UI Components** - Navigation, headers, footers, breadcrumbs
2. **Expensive Computations** - Components with heavy rendering logic
3. **Shared Layouts** - UI that's identical across user sessions
4. **Configuration-based UI** - Components that render based on app config

**Examples in This Codebase:**

```typescript
// src/app/.../dashboard/page.tsx
async function Heading() {
  'use cache';
  return (
    <>
      <T.H1>Dashboard</T.H1>
      <Link href="/dashboard/new">
        <Button>
          <PlusCircle /> New Private Item
        </Button>
      </Link>
    </>
  );
}
```

```typescript
// src/app/.../@heading/dashboard/page.tsx
export default async function DashboardHeading() {
  'use cache'
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">
              <Home /> <span>Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Dashboard</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

```typescript
// src/app/.../app-sidebar.tsx
async function SidebarHeaderContent() {
  'use cache'
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <Link href="/">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Home className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Nextbase</span>
                <span className="truncate text-xs text-muted-foreground">
                  Open Source
                </span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
```

### When NOT to Use "use cache"

- **User-specific content** - Personalized data, user profiles
- **Real-time data** - Live feeds, stock prices
- **Session-dependent UI** - Components that change based on auth state
- **Dynamic routes with unique params** - Content that varies per request

---

## Static vs Dynamic Rendering

Understanding how `"use cache"` interacts with static and dynamic rendering is crucial for optimal performance.

### Static Prerendering

When `"use cache"` is applied to a layout or page, the route segment is **prerendered at build time**. This enables:

- **Instant loading** - Cached content served immediately
- **Reduced server load** - No computation needed per request
- **CDN edge caching** - Content can be distributed globally

```typescript
// This entire page is statically prerendered
export default async function StaticPage() {
  'use cache';

  return (
    <div>
      <h1>Static Content</h1>
      <p>This is prerendered at build time</p>
    </div>
  );
}
```

### Dynamic Content Restrictions

**Critical Constraint**: `"use cache"` cannot be used with runtime data:

- `cookies()` - Session/auth cookies
- `headers()` - Request headers
- `searchParams` - URL query parameters
- Dynamic route parameters with runtime values

If **any nested child** in a cached route uses Dynamic APIs, the entire route **opts out of prerendering**.

```typescript
// BAD - This breaks caching for entire route
export default async function Page() {
  'use cache';

  const cookieStore = await cookies();  // Dynamic API breaks cache
  const session = cookieStore.get('session');

  return <div>This won't be cached</div>;
}
```

### The Solution: Separate Sub-Trees

The key insight is that cached components and dynamic components must exist as **separate branches** in the component tree, not as parent-child relationships.

**Wrong Approach (Nesting)**:
```typescript
// BAD - Dynamic parent with cached child
async function DynamicParent() {
  const user = await getUser();  // Dynamic - auth check

  return (
    <div>
      <UserHeader user={user} />
      <CachedSidebar />  {/* This cannot be cached! */}
    </div>
  );
}

async function CachedSidebar() {
  'use cache';  // Won't work - parent is dynamic
  return <nav>...</nav>;
}
```

**Correct Approach (Sibling Trees)**:
```typescript
// GOOD - Parallel rendering at layout level with Suspense
import { Suspense } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <StaticSidebar />      {/* Cached sub-tree */}
      <Suspense fallback={<MainContentSkeleton />}>
        <DynamicContent>       {/* Dynamic sub-tree wrapped in Suspense */}
          {children}
        </DynamicContent>
      </Suspense>
    </div>
  );
}

// Cached branch - loads instantly
async function StaticSidebar() {
  'use cache';
  return (
    <aside>
      <Logo />
      <Navigation />
    </aside>
  );
}

// Dynamic branch - renders per request, wrapped in Suspense
async function DynamicContent({ children }: { children: ReactNode }) {
  const user = await getUser();
  return (
    <main>
      <UserHeader user={user} />
      {children}
    </main>
  );
}
```

### Compositional Patterns with Slots

**Key Insight**: Non-serializable values (like children) are **passed through** cached components without affecting the cache entry.

```typescript
async function CachedWrapper({ children }: { children: ReactNode }) {
  'use cache';

  return (
    <div className="cached-layout">
      <StaticHeader />
      <div className="content">
        {children}  {/* Dynamic content injected here */}
      </div>
      <StaticFooter />
    </div>
  );
}

// Usage - children can be dynamic, wrapped in Suspense
export default function Page() {
  return (
    <CachedWrapper>
      <Suspense fallback={<UserContentSkeleton />}>
        <DynamicUserContent />  {/* This is dynamic, but wrapper is cached */}
      </Suspense>
    </CachedWrapper>
  );
}
```

This pattern allows:
- The wrapper's JSX structure to be cached
- Dynamic content to be injected at render time
- Parts of the page to load instantly while dynamic sections render
- **Suspense provides loading states** for the dynamic portions

---

## Component Tree Architecture

### Parallel Slots with Next.js

Next.js parallel routes (`@folder`) are perfect for mixing cached and dynamic content:

```
app/
├── layout.tsx                    # Main layout
├── page.tsx                      # Dynamic content
├── @sidebar/
│   └── page.tsx                  # Cached sidebar
└── @heading/
    └── page.tsx                  # Cached heading
```

**Layout Implementation**:
```typescript
// app/layout.tsx
import { Suspense } from 'react';

export default function Layout({
  children,
  sidebar,
  heading,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  heading: ReactNode;
}) {
  return (
    <div>
      {heading}     {/* Cached - loads instantly */}
      <div className="flex">
        {sidebar}    {/* Cached - loads instantly */}
        <main>
          <Suspense fallback={<PageSkeleton />}>
            {children} {/* Dynamic - wrap in Suspense */}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
```

**Cached Slot**:
```typescript
// app/@heading/page.tsx
export default async function Heading() {
  'use cache';
  return <h1>Dashboard</h1>;  // Instant
}
```

**Dynamic Content**:
```typescript
// app/page.tsx
export default async function Page() {
  const data = await fetchUserData();  // Dynamic
  return <UserDashboard data={data} />;
}
```

### Benefits of This Architecture

1. **Partial Page Caching** - Static parts load instantly from cache
2. **Progressive Loading** - Users see cached content immediately
3. **Reduced TTFB** - Time to First Byte decreases for cached sections
4. **Better UX** - Perceived performance improves significantly

### Real-World Example: Dashboard Page

```
┌─────────────────────────────────────────┐
│  HEADER (cached)  - Loads instantly     │
├──────────┬──────────────────────────────┤
│          │                              │
│ SIDEBAR  │    MAIN CONTENT              │
│ (cached) │    (dynamic)                 │
│          │                              │
│ - Logo   │    Loading user data...      │
│ - Nav    │                              │
│ - Links  │    [User-specific content]   │
│          │                              │
└──────────┴──────────────────────────────┘
```

**Implementation**:
```typescript
// Layout with cached and dynamic sections
import { Suspense } from 'react';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <CachedHeader />           {/* Instant */}
      <div className="flex">
        <CachedSidebar />        {/* Instant */}
        <Suspense fallback={<MainSkeleton />}>
          <DynamicMainContent>     {/* Per-request, wrapped in Suspense */}
            {children}
          </DynamicMainContent>
        </Suspense>
      </div>
    </div>
  );
}

async function CachedHeader() {
  'use cache';
  return (
    <header>
      <Logo />
      <AppTitle>My Dashboard</AppTitle>
    </header>
  );
}

async function CachedSidebar() {
  'use cache';
  return (
    <aside>
      <NavMenu items={staticNavItems} />
    </aside>
  );
}

async function DynamicMainContent({ children }: { children: ReactNode }) {
  const isLoggedIn = await getCachedIsUserLoggedIn();
  if (!isLoggedIn) {
    redirect('/login');
  }
  return <main>{children}</main>;
}
```

### Supabase-Specific Patterns

When using Supabase with cached components:

```typescript
// WRONG - getClaims in cached component
async function CachedUserNav() {
  'use cache';
  const claims = await getCachedLoggedInUserClaims();  // Dynamic!
  return <nav>User: {claims.sub}</nav>;  // Won't be cached
}

// RIGHT - Keep user data in dynamic tree, wrapped in Suspense
export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <CachedAppBranding />        {/* No auth - cached */}
      <Suspense fallback={<UserSectionSkeleton />}>
        <DynamicUserSection>         {/* Auth here - dynamic, wrapped in Suspense */}
          {children}
        </DynamicUserSection>
      </Suspense>
    </div>
  );
}

async function CachedAppBranding() {
  'use cache';
  return (
    <div>
      <Logo />
      <AppName>Nextbase</AppName>
    </div>
  );
}

async function DynamicUserSection({ children }: { children: ReactNode }) {
  const claims = await getCachedLoggedInUserClaims();
  return (
    <div>
      <UserAvatar userId={claims.sub} />
      {children}
    </div>
  );
}
```

### Streaming and Suspense Integration

**Critical Rule: Always wrap dynamic content in Suspense boundaries.**

When mixing cached and dynamic content, Suspense is **required** for:
- Progressive rendering (users see cached content immediately)
- Graceful loading states
- Error boundary isolation
- Proper streaming behavior

```typescript
export default function Page() {
  return (
    <div>
      <CachedHeader />  {/* Renders immediately */}

      <Suspense fallback={<Loading />}>
        <DynamicContent />  {/* Streams when ready */}
      </Suspense>

      <CachedFooter />  {/* Renders immediately */}
    </div>
  );
}
```

**Why Suspense is Required:**

1. **Without Suspense** - Entire page waits for slowest component
2. **With Suspense** - Cached parts render immediately, dynamic parts stream in

```typescript
// BAD - No Suspense, blocks rendering
export default function Page() {
  return (
    <div>
      <CachedSidebar />      {/* Waits for DynamicMain! */}
      <DynamicMain />        {/* Slow fetch blocks everything */}
    </div>
  );
}

// GOOD - Suspense enables streaming
export default function Page() {
  return (
    <div>
      <CachedSidebar />      {/* Renders immediately */}
      <Suspense fallback={<Skeleton />}>
        <DynamicMain />      {/* Streams independently */}
      </Suspense>
    </div>
  );
}
```

**Nested Suspense for Granular Loading:**

```typescript
export default function Dashboard() {
  return (
    <div>
      <CachedNavigation />  {/* Instant */}

      <Suspense fallback={<MainSkeleton />}>
        <AuthenticatedLayout>  {/* Auth check */}
          <Suspense fallback={<ProfileSkeleton />}>
            <UserProfile />  {/* User data fetch */}
          </Suspense>

          <Suspense fallback={<ActivitySkeleton />}>
            <RecentActivity />  {/* Activity fetch */}
          </Suspense>
        </AuthenticatedLayout>
      </Suspense>

      <CachedFooter />  {/* Instant */}
    </div>
  );
}
```

Users see cached sections instantly while dynamic content streams in progressively.

---

## React cache() Function

### What It Does

React's `cache()` function memoizes the result of an async function for the duration of a single request. This prevents duplicate calls to the same function during a single render pass.

### Basic Syntax

```typescript
import { cache } from 'react';

export const getCachedData = cache(async () => {
  // Expensive operation
  const result = await fetchSomeData();
  return result;
});
```

### When to Use cache()

**Ideal Use Cases:**

1. **Authentication Checks** - Verify user session once per request
2. **Database Queries** - Fetch user data, permissions
3. **External API Calls** - Third-party service requests
4. **Configuration Loading** - App settings, feature flags

**Examples in This Codebase:**

```typescript
// src/rsc-data/supabase.ts
import { cache } from 'react';

// Full user verification (makes server call)
export const getCachedLoggedInVerifiedSupabaseUser = cache(async () => {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return data;
});

// Fast claims extraction (no server call)
export const getCachedLoggedInUserClaims = cache(async () => {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error) {
    throw error;
  }
  if (!data?.claims) {
    throw new Error('No claims found');
  }
  return data.claims;
});

// Login status check using claims
export const getCachedIsUserLoggedIn = cache(async () => {
  const claims = await getCachedLoggedInUserClaims();
  return claims.sub !== null;
});

// Extract user ID from claims
export const getCachedLoggedInUserId = cache(async () => {
  const claims = await getCachedLoggedInUserClaims();
  return claims.sub;
});
```

### Key Difference: cache() vs "use cache"

| Feature | `cache()` | `"use cache"` |
|---------|-----------|---------------|
| **Scope** | Single request | Across requests |
| **Purpose** | Request deduplication | Response caching |
| **Duration** | Until request completes | Until invalidated |
| **Use Case** | Data fetching | Component rendering |

---

## Cache Invalidation with revalidatePath()

### What It Does

`revalidatePath()` invalidates cached data for a specific path, forcing Next.js to regenerate the page or layout on the next request.

### Basic Syntax

```typescript
import { revalidatePath } from 'next/cache';

// Revalidate a specific page
revalidatePath('/dashboard');

// Revalidate a layout (affects all nested routes)
revalidatePath('/', 'layout');

// Revalidate with specific type
revalidatePath('/blog/[slug]', 'page');
```

### When to Use revalidatePath()

**Ideal Use Cases:**

1. **After Data Mutations** - Create, update, delete operations
2. **Authentication Changes** - Login, logout, session updates
3. **User Actions** - Form submissions, settings changes
4. **Content Updates** - Publishing, unpublishing content

**Examples in This Codebase:**

```typescript
// src/data/auth/sign-out.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signOutAction() {
  const supabase = await createSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout');  // Invalidate entire app layout
  redirect('/login');
}
```

```typescript
// src/data/user/privateItems.ts
'use server';

import { revalidatePath } from 'next/cache';

export const insertPrivateItemAction = authActionClient
  .schema(insertPrivateItemSchema)
  .action(async ({ parsedInput, ctx }) => {
    const supabaseClient = await createSupabaseClient();

    const data = await runEffectInAction(
      insertPrivateItemEffect(supabaseClient, {
        ...parsedInput,
        owner_id: ctx.userId,
      })
    );

    revalidatePath('/');  // Invalidate to show new item
    return data.id;
  });

export const deletePrivateItemAction = authActionClient
  .schema(deletePrivateItemSchema)
  .action(async ({ parsedInput }) => {
    const supabaseClient = await createSupabaseClient();
    const { error } = await supabaseClient
      .from('private_items')
      .delete()
      .eq('id', parsedInput.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/');  // Invalidate to remove deleted item
    redirect('/private-items');
  });
```

```typescript
// src/app/.../auth/callback/route.ts
export async function GET(request: Request) {
  // ... exchange code for session ...

  revalidatePath('/', 'layout');  // Refresh after OAuth login

  return NextResponse.redirect(redirectTo);
}
```

---

## When to Use What

### Decision Matrix

| Scenario | Solution | Why |
|----------|----------|-----|
| Static navigation/breadcrumbs | `"use cache"` | Same for all users, rarely changes |
| User authentication check | `cache()` | Deduplicate within single request |
| After form submission | `revalidatePath()` | Update UI to reflect changes |
| Sidebar branding/logo | `"use cache"` | Static content across all pages |
| Fetch user profile | `cache()` | May be called multiple times per request |
| After logout | `revalidatePath('/', 'layout')` | Clear all auth-related caches |
| Page header with title | `"use cache"` | Static per route |
| Real-time notifications | None | Data changes too frequently |

### Common Patterns

**Pattern 1: Cached Static Component**
```typescript
async function AppLogo() {
  'use cache';
  return <img src="/logo.svg" alt="App Logo" />;
}
```

**Pattern 2: Request-Memoized Data Fetching**
```typescript
export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
});
```

**Pattern 3: Invalidate After Mutation**
```typescript
export async function updateProfileAction(data: ProfileData) {
  'use server';

  await updateProfile(data);
  revalidatePath('/profile');
  return { success: true };
}
```

**Pattern 4: Combine cache() with "use cache"**
```typescript
// Data fetching with request deduplication
export const getAppConfig = cache(async () => {
  return await fetchConfig();
});

// UI rendering with cross-request caching
async function ConfiguredHeader() {
  'use cache';
  const config = await getAppConfig();
  return <header>{config.siteName}</header>;
}
```

---

## Best Practices

### Do's

1. **Use `"use cache"` for UI that's identical across users**
   - Navigation menus, footers, breadcrumbs
   - Static marketing content
   - App branding elements

2. **Use `cache()` for expensive operations called multiple times**
   - Authentication checks
   - Permission lookups
   - Database queries

3. **Always invalidate after mutations**
   - Call `revalidatePath()` in Server Actions
   - Match the path to what changed

4. **Layer your caching strategy**
   - Request level: `cache()`
   - Response level: `"use cache"`
   - Invalidation: `revalidatePath()`

5. **Keep cached components pure**
   - No user-specific data inside `"use cache"`
   - Avoid dynamic values that change per request

6. **Always wrap dynamic content in Suspense**
   - Required for streaming and progressive rendering
   - Provides loading states for users
   - Prevents cached content from being blocked by slow dynamic fetches
   ```typescript
   <CachedHeader />
   <Suspense fallback={<Loading />}>
     <DynamicContent />
   </Suspense>
   ```

### Don'ts

1. **Don't cache user-specific content**
   ```typescript
   // BAD - user data in cached component
   async function UserGreeting() {
     'use cache';
     const user = await getUser();
     return <h1>Hello, {user.name}</h1>;
   }
   ```

2. **Don't forget to invalidate**
   ```typescript
   // BAD - no invalidation after mutation
   export async function deleteItem(id: string) {
     'use server';
     await db.delete(id);
     // Missing: revalidatePath('/items');
   }
   ```

3. **Don't over-cache dynamic content**
   ```typescript
   // BAD - timestamp will be stale
   async function Timestamp() {
     'use cache';
     return <span>{new Date().toISOString()}</span>;
   }
   ```

4. **Don't nest "use cache" inside user-specific wrappers**
   ```typescript
   // BAD - cached content depends on user context
   async function UserDashboard() {
     const user = await getUser();
     return <CachedComponent userId={user.id} />;
   }
   ```

5. **Don't mix cached and dynamic content without Suspense**
   ```typescript
   // BAD - dynamic content blocks cached content from rendering
   export default function Page() {
     return (
       <div>
         <CachedSidebar />       {/* Has to wait! */}
         <DynamicUserContent />  {/* Blocks everything */}
       </div>
     );
   }

   // GOOD - Suspense enables independent rendering
   export default function Page() {
     return (
       <div>
         <CachedSidebar />       {/* Renders immediately */}
         <Suspense fallback={<Loading />}>
           <DynamicUserContent />  {/* Streams independently */}
         </Suspense>
       </div>
     );
   }
   ```

---

## Examples from This Codebase

### 1. Breadcrumb Navigation (Cached)

**Location:** `src/app/.../@heading/dashboard/page.tsx`

```typescript
export default async function DashboardHeading() {
  'use cache'
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">
              <Home /> <span>Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Dashboard</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

**Why cached?** Breadcrumbs are identical for all users viewing the dashboard.

---

### 2. Authentication Data (Request Memoized)

**Location:** `src/rsc-data/supabase.ts`

```typescript
export const getCachedLoggedInUserClaims = cache(async () => {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error) {
    throw error;
  }
  if (!data?.claims) {
    throw new Error('No claims found');
  }
  return data.claims;
});

export const getCachedIsUserLoggedIn = cache(async () => {
  const claims = await getCachedLoggedInUserClaims();
  return claims.sub !== null;
});
```

**Why request-memoized?** Multiple components may check auth status in a single request.

---

### 3. Post-Mutation Invalidation

**Location:** `src/data/user/privateItems.ts`

```typescript
export const insertPrivateItemAction = authActionClient
  .schema(insertPrivateItemSchema)
  .action(async ({ parsedInput, ctx }) => {
    const data = await runEffectInAction(
      insertPrivateItemEffect(supabaseClient, {
        ...parsedInput,
        owner_id: ctx.userId,
      })
    );

    revalidatePath('/');  // Invalidate cache
    return data.id;
  });
```

**Why invalidate?** New item should appear immediately in lists.

---

## Advanced: Future Enhancements

The following features are available in Next.js 15+ but not yet used in this codebase:

### cacheTag() and revalidateTag()

```typescript
import { cacheTag, revalidateTag } from 'next/cache';

async function BlogPost({ id }: { id: string }) {
  'use cache';
  cacheTag(`post-${id}`);

  const post = await fetchPost(id);
  return <article>{post.content}</article>;
}

// Later, invalidate specific post
export async function updatePost(id: string, data: PostData) {
  'use server';
  await db.updatePost(id, data);
  revalidateTag(`post-${id}`);  // Only invalidate this post
}
```

### cacheLife()

```typescript
import { cacheLife } from 'next/cache';

async function FeaturedProducts() {
  'use cache';
  cacheLife('hours');  // Cache for hours instead of default

  const products = await fetchFeaturedProducts();
  return <ProductGrid products={products} />;
}
```

---

## Summary

- **`"use cache"`** - Cache entire Server Components across requests
- **`cache()`** - Deduplicate expensive operations within a single request
- **`revalidatePath()`** - Invalidate caches after mutations

Use these tools together to create a performant, responsive application that balances caching benefits with data freshness.
