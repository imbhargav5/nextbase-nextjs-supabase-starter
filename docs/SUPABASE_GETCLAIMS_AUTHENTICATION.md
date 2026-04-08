# Supabase getClaims() Authentication Guide

This guide explains how to use Supabase's `getClaims()` method for authentication instead of `getUser()`, saving network round trips while maintaining security.

## Table of Contents

- [Overview](#overview)
- [getClaims() vs getUser()](#getclaims-vs-getuser)
- [Implementation Patterns](#implementation-patterns)
- [Protecting Pages and Routes](#protecting-pages-and-routes)
- [Server Actions with Authentication](#server-actions-with-authentication)
- [Database-Level Security (RLS)](#database-level-security-rls)
- [Best Practices](#best-practices)
- [Examples from This Codebase](#examples-from-this-codebase)

---

## Overview

Supabase's `getClaims()` method extracts JWT claims directly from the session token without making a network request to verify with the Supabase server. This provides a significant performance improvement for authentication checks while maintaining security through Row Level Security (RLS) policies.

**Key Benefits:**

- **No network round trip** - Claims are extracted from the JWT locally
- **Faster response times** - Eliminates server verification latency
- **Secure** - JWT signature is still verified, RLS enforces authorization
- **Lightweight** - Returns only essential claims (sub, role, exp, etc.)

---

## getClaims() vs getUser()

### Comparison Table

| Feature | `getClaims()` | `getUser()` |
|---------|---------------|-------------|
| **Network Call** | No | Yes (verifies with server) |
| **Speed** | Fast (~0ms) | Slower (~50-200ms) |
| **Data Returned** | JWT claims only | Full User object |
| **Server Verification** | No (trusts JWT) | Yes (re-validates token) |
| **Use Case** | Quick auth checks | Full user data needed |
| **Security** | JWT + RLS | JWT + Server verification + RLS |

### What getClaims() Returns

```typescript
{
  sub: "user-uuid-here",           // User ID
  email: "user@example.com",       // User email
  role: "authenticated",           // User role
  aud: "authenticated",            // Audience
  exp: 1234567890,                 // Expiration timestamp
  iat: 1234567890,                 // Issued at timestamp
  // ... other standard JWT claims
}
```

### What getUser() Returns

```typescript
{
  user: {
    id: "user-uuid-here",
    email: "user@example.com",
    email_confirmed_at: "2024-01-01T00:00:00Z",
    phone: null,
    confirmed_at: "2024-01-01T00:00:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user_metadata: { ... },
    app_metadata: { ... },
    // ... full user profile
  }
}
```

---

## Implementation Patterns

### Basic getClaims() Usage

```typescript
// src/data/user/user.ts
import { createSupabaseClient } from '@/supabase-clients/server';

export async function getLoggedInUserId() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    throw new Error('User not logged in');
  }

  return data.claims.sub;  // Returns user ID
}
```

### Cached getClaims() with React cache()

```typescript
// src/rsc-data/supabase.ts
import { cache } from 'react';
import { createSupabaseClient } from '@/supabase-clients/server';

// Cache claims extraction for request deduplication
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

// Check if user is logged in (uses cached claims)
export const getCachedIsUserLoggedIn = cache(async () => {
  const claims = await getCachedLoggedInUserClaims();
  return claims.sub !== null;
});

// Get user ID from claims (uses cached claims)
export const getCachedLoggedInUserId = cache(async () => {
  const claims = await getCachedLoggedInUserClaims();
  return claims.sub;
});
```

---

## Protecting Pages and Routes

### Pattern 1: Layout-Level Protection

Protect all child routes by checking authentication in a layout:

```typescript
// src/app/(dynamic-pages)/(main-pages)/(logged-in-pages)/layout.tsx
import { redirect } from 'next/navigation';
import { getCachedIsUserLoggedIn } from '@/rsc-data/supabase';
import type { ReactNode } from 'react';

async function ChildrenWrapper({ children }: { children: ReactNode }) {
  const isLoggedIn = await getCachedIsUserLoggedIn();

  if (!isLoggedIn) {
    redirect('/login');
  }

  return <>{children}</>;
}

export default async function LoggedInLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </div>
  );
}
```

**Advantages:**
- Single check protects all nested routes
- Uses claims (fast, no network call)
- Leverages React's cache() for deduplication

### Pattern 2: Page-Level Protection

Check authentication at the page level:

```typescript
// src/app/(protected)/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getCachedIsUserLoggedIn, getCachedLoggedInUserId } from '@/rsc-data/supabase';

export default async function DashboardPage() {
  const isLoggedIn = await getCachedIsUserLoggedIn();

  if (!isLoggedIn) {
    redirect('/login');
  }

  const userId = await getCachedLoggedInUserId();

  // Fetch user-specific data
  const userData = await fetchUserData(userId);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, user {userId}</p>
    </div>
  );
}
```

### Pattern 3: Middleware Protection (with getUser())

For route-level protection before rendering, use middleware with getUser():

```typescript
// src/supabase-clients/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { match } from 'path-to-regexp';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const protectedPages = [
    '/dashboard',
    '/private-item',
    '/private-items',
    '/items',
    '/item',
  ];

  // Use getUser() in middleware for server verification
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect if user not authenticated and accessing protected route
  if (
    !user &&
    protectedPages.some((page) => {
      const matcher = match(page);
      return matcher(request.nextUrl.pathname);
    })
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

**Why getUser() in middleware?**
- Middleware runs on every request before rendering
- Server verification ensures token hasn't been revoked
- Provides first line of defense

**Why getClaims() in Server Components?**
- Component already passed middleware check
- Fast extraction for subsequent auth needs
- No redundant network calls

---

## Server Actions with Authentication

### Creating an Authenticated Action Client

```typescript
// src/lib/safe-action.ts
import { createSafeActionClient } from 'next-safe-action';
import { getLoggedInUserId } from '@/data/user/user';

// Base action client
const actionClient = createSafeActionClient();

// Authenticated action client - injects userId into context
export const authActionClient = actionClient.use(async ({ next }) => {
  const userId = await getLoggedInUserId();  // Uses getClaims()

  return await next({
    ctx: {
      userId,  // Available to all actions using this client
    },
  });
});
```

### Using the Authenticated Action Client

```typescript
// src/data/user/privateItems.ts
'use server';

import { authActionClient } from '@/lib/safe-action';
import { createSupabaseClient } from '@/supabase-clients/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const insertPrivateItemSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
});

export const insertPrivateItemAction = authActionClient
  .schema(insertPrivateItemSchema)
  .action(async ({ parsedInput, ctx }) => {
    const supabaseClient = await createSupabaseClient();

    // ctx.userId is automatically injected from getClaims()
    const { data, error } = await supabaseClient
      .from('private_items')
      .insert({
        ...parsedInput,
        owner_id: ctx.userId,  // Use extracted user ID
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/');
    return data.id;
  });

export const deletePrivateItemAction = authActionClient
  .schema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput, ctx }) => {
    const supabaseClient = await createSupabaseClient();

    // User can only delete their own items (enforced by RLS too)
    const { error } = await supabaseClient
      .from('private_items')
      .delete()
      .eq('id', parsedInput.id)
      .eq('owner_id', ctx.userId);  // Extra safety check

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/');
    return { success: true };
  });
```

**Benefits:**
- `ctx.userId` automatically available from claims
- No network call needed to get user ID
- Type-safe with schema validation
- Consistent authentication across all actions

---

## Database-Level Security (RLS)

Even with getClaims(), your data remains secure through Supabase's Row Level Security.

### How RLS Works with JWT Claims

When your server makes a database query, Supabase automatically:

1. Extracts the JWT from the request
2. Validates the signature
3. Makes claims available via `auth.uid()` and `auth.role()` in SQL
4. Enforces RLS policies based on these claims

### Example RLS Policies

```sql
-- Users can only select their own private items
CREATE POLICY select_own_policy ON public.private_items
FOR SELECT USING (auth.uid() = owner_id);

-- Users can only insert items for themselves
CREATE POLICY insert_own_policy ON public.private_items
FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Users can only update their own items
CREATE POLICY update_own_policy ON public.private_items
FOR UPDATE USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Users can only delete their own items
CREATE POLICY delete_own_policy ON public.private_items
FOR DELETE USING (auth.uid() = owner_id);
```

### Automatic Owner ID Assignment

```sql
-- Trigger to automatically set owner_id from JWT claims
CREATE OR REPLACE FUNCTION public.set_private_item_owner_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.owner_id IS NULL AND auth.uid() IS NOT NULL THEN
    NEW.owner_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_owner_id_trigger
  BEFORE INSERT ON public.private_items
  FOR EACH ROW
  EXECUTE FUNCTION public.set_private_item_owner_id();
```

**Security Flow:**

```
getClaims() extracts user ID (sub) from JWT
         ↓
Server Action uses userId from claims
         ↓
Database query includes owner_id = userId
         ↓
RLS policy checks: auth.uid() = owner_id
         ↓
auth.uid() extracted from same JWT
         ↓
✓ Query allowed / ✗ Query denied
```

---

## Best Practices

### Do's

1. **Use getClaims() for quick auth checks**
   ```typescript
   const { data } = await supabase.auth.getClaims();
   if (!data?.claims?.sub) {
     redirect('/login');
   }
   ```

2. **Cache claims with React cache()**
   ```typescript
   export const getCachedClaims = cache(async () => {
     const supabase = await createSupabaseClient();
     const { data } = await supabase.auth.getClaims();
     return data.claims;
   });
   ```

3. **Combine with RLS for defense in depth**
   - Application-level: Check auth with getClaims()
   - Database-level: Enforce with RLS policies

4. **Use getUser() when you need:**
   - Full user metadata
   - Email verification status
   - Phone number information
   - Server-verified token status

5. **Implement layered security**
   ```
   Middleware: getUser() for server verification
        ↓
   Layout: getClaims() for fast auth check
        ↓
   Server Action: getClaims() for user ID
        ↓
   Database: RLS policies for authorization
   ```

### Don'ts

1. **Don't use getClaims() for security-critical verification**
   ```typescript
   // BAD - for critical operations, use getUser()
   async function deleteAccount() {
     const claims = await getCachedLoggedInUserClaims();
     await deleteUserAccount(claims.sub);
   }

   // GOOD - verify with server for critical operations
   async function deleteAccount() {
     const { data } = await supabase.auth.getUser();
     if (!data.user) throw new Error('Not authenticated');
     await deleteUserAccount(data.user.id);
   }
   ```

2. **Don't trust claims alone for admin operations**
   ```typescript
   // BAD - claims can be cached/stale
   if (claims.role === 'admin') {
     // Do admin stuff
   }

   // GOOD - verify with server
   const { data } = await supabase.auth.getUser();
   if (data.user?.app_metadata?.role === 'admin') {
     // Do admin stuff
   }
   ```

3. **Don't skip RLS policies**
   ```typescript
   // BAD - trusting client-side userId without RLS
   await supabase.from('items').delete().eq('id', itemId);

   // GOOD - RLS ensures user can only delete their items
   await supabase.from('items').delete()
     .eq('id', itemId)
     .eq('owner_id', userId);  // RLS also checks this
   ```

4. **Don't expose sensitive claims to client**
   ```typescript
   // BAD - sending all claims to client
   return { claims: await getCachedLoggedInUserClaims() };

   // GOOD - only send necessary data
   const claims = await getCachedLoggedInUserClaims();
   return { userId: claims.sub };
   ```

---

## Examples from This Codebase

### 1. Claims-Based User ID Extraction

**Location:** `src/data/user/user.ts`

```typescript
export async function getLoggedInUserId() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    throw new Error('User not logged in');
  }

  return data.claims.sub;
}
```

**Used in:** Server Action middleware for authentication.

---

### 2. Cached Authentication Functions

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

export const getCachedLoggedInUserId = cache(async () => {
  const claims = await getCachedLoggedInUserClaims();
  return claims.sub;
});
```

**Used in:** Protected layouts, server components that need user info.

---

### 3. Layout-Level Protection

**Location:** `src/app/(dynamic-pages)/(main-pages)/(logged-in-pages)/layout.tsx`

```typescript
import { getCachedIsUserLoggedIn } from '@/rsc-data/supabase';
import { redirect } from 'next/navigation';

async function ChildrenWrapper({ children }: { children: ReactNode }) {
  const isLoggedIn = await getCachedIsUserLoggedIn();

  if (!isLoggedIn) {
    redirect('/login');
  }

  return <>{children}</>;
}
```

**Purpose:** Protects all routes under `/dashboard`, `/private-items`, etc.

---

### 4. Authenticated Server Action

**Location:** `src/lib/safe-action.ts` + `src/data/user/privateItems.ts`

```typescript
// Middleware extracts userId from claims
export const authActionClient = actionClient.use(async ({ next }) => {
  const userId = await getLoggedInUserId();
  return await next({
    ctx: { userId },
  });
});

// Action uses injected userId
export const insertPrivateItemAction = authActionClient
  .schema(insertPrivateItemSchema)
  .action(async ({ parsedInput, ctx }) => {
    // ctx.userId from getClaims()
    const data = await insertItem({
      ...parsedInput,
      owner_id: ctx.userId,
    });
    return data.id;
  });
```

**Purpose:** Every authenticated action automatically has access to user ID without additional network calls.

---

### 5. Middleware with getUser() Verification

**Location:** `src/supabase-clients/middleware.ts`

```typescript
const {
  data: { user },
} = await supabase.auth.getUser();

if (
  !user &&
  protectedPages.some((page) => {
    const matcher = match(page);
    return matcher(request.nextUrl.pathname);
  })
) {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
}
```

**Purpose:** First line of defense with server verification before any rendering happens.

---

## Security Architecture Summary

```
Request Flow:
─────────────────────────────────────────────────────

1. Browser Request
      ↓
2. Next.js Middleware
      ↓ getUser() - Server verifies JWT
3. Route Handler / Layout
      ↓ getClaims() - Fast auth check
4. Server Component
      ↓ getCachedLoggedInUserId() - Extract user ID
5. Server Action
      ↓ authActionClient provides ctx.userId
6. Database Query
      ↓ RLS checks auth.uid() = owner_id
7. Response

Security Layers:
─────────────────────────────────────────────────────

Layer 1: JWT Signature Validation
         - Every Supabase request validates JWT signature

Layer 2: Middleware (getUser)
         - Server-side token verification
         - Blocks expired/revoked tokens

Layer 3: Application (getClaims)
         - Fast authentication checks
         - User ID extraction

Layer 4: Database (RLS)
         - Row-level authorization
         - Uses same JWT claims
         - Final enforcement
```

---

## Performance Impact

### Before (using getUser() everywhere)

```typescript
// 3 network calls per request
const { data: user1 } = await supabase.auth.getUser();  // ~100ms
const { data: user2 } = await supabase.auth.getUser();  // ~100ms
const { data: user3 } = await supabase.auth.getUser();  // ~100ms
// Total: ~300ms extra latency
```

### After (using getClaims() with cache())

```typescript
// 1 network call in middleware, then fast claims extraction
// Middleware: getUser() ~100ms (once)
const claims = await getCachedLoggedInUserClaims();  // ~0ms
const userId = await getCachedLoggedInUserId();      // ~0ms (cached)
const isLoggedIn = await getCachedIsUserLoggedIn();  // ~0ms (cached)
// Total: ~100ms (middleware only)
```

**Result:** 60-70% reduction in authentication-related latency.

---

## Migration Guide

### From getUser() to getClaims()

**Before:**
```typescript
export async function getUserId() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error('Not authenticated');
  }
  return data.user.id;
}
```

**After:**
```typescript
export async function getUserId() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) {
    throw new Error('Not authenticated');
  }
  return data.claims.sub;
}
```

### When to Keep getUser()

Keep using getUser() when you need:
- Full user profile information
- Email/phone verification status
- User metadata (user_metadata, app_metadata)
- Server-verified token for critical operations

---

## Conclusion

Using `getClaims()` instead of `getUser()` provides significant performance benefits by eliminating unnecessary network round trips. Combined with React's `cache()` function for request deduplication and Supabase's Row Level Security for database-level authorization, you can build fast, secure applications.

**Key Takeaways:**

1. **Use getClaims() for auth checks** - Fast, no network call
2. **Use getUser() in middleware** - Server verification at entry point
3. **Cache claims with React cache()** - Deduplicate within request
4. **Rely on RLS** - Database enforces authorization using same JWT
5. **Layer your security** - Middleware → Layout → Action → Database
