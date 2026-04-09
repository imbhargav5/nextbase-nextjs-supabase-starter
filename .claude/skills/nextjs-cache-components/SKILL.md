---
name: nextjs-cache-components
description: Code generation and conversion for Next.js 16 applications using Cache Components (PPR). Use when the user requests to "convert to use cacheComponents" at project or page level, create new Next.js pages/components with proper caching directives, split pages into cached and dynamic sections with Suspense boundaries, or work with Next.js 16's new caching model including use cache, cacheLife, Suspense, and anonymous Supabase clients for cache-friendly data fetching.
---

# Next.js 16 Cache Components

Generate and convert Next.js 16 code using Cache Components (Partial Prerendering). Handle proper `use cache` directives, Suspense boundaries, anonymous Supabase clients, and migration from old route segment configs.

## Core Principles

1. **Dynamic by default**: All routes are dynamic unless explicitly cached with `use cache`
2. **Fine-grained control**: Cache at page, component, or function level
3. **No runtime APIs in cached scopes**: Cached code cannot use `cookies()`, `headers()`, or runtime `searchParams`
4. **Anonymous clients for caching**: Use Supabase anonymous clients (no cookies) in cached scopes
5. **Suspense for dynamic content**: Wrap runtime-dependent code in Suspense boundaries

## Anonymous Supabase Client Pattern

**Critical**: Cached components cannot use standard Supabase clients that rely on cookies. Always use anonymous clients in cached scopes.

Create the anonymous client:
```typescript
// src/supabase-clients/anon/createSupabaseAnonServerClient.ts
import type { Database } from "@/types/database";
import { createServerClient } from "@supabase/ssr";

export const createSupabaseAnonServerClient = async () => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll(cookiesToSet) {
          // no-op
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      }
    }
  );
};
```

Use in cached pages/components:
```typescript
export default async function HomePage() {
  'use cache';
  cacheLife('hours');
  
  const supabase = await createSupabaseAnonServerClient();
  const { data } = await supabase.from('products').select('*');
  return <div>{/* render */}</div>;
}
```

## Cache Directives

### Standard Cache
```typescript
'use cache'
```
Use for pages/components without params/searchParams that should be cached.

### Private Cache
```typescript
'use cache: private'
```
**Required** when using `params` or other request-specific data. Creates per-request cache keys.

### Cache Lifetime
```typescript
import { cacheLife } from 'next/cache';

'use cache';
cacheLife('days');    // Long-lived static content
cacheLife('hours');   // Semi-static content
cacheLife('minutes'); // Frequently updated content
```

### Cache Tags
```typescript
import { cacheTag } from 'next/cache';

'use cache';
cacheTag('products');
cacheTag('category-electronics');
```
Use for targeted cache invalidation with `updateTag()` or `revalidateTag()`.

## Code Generation Patterns

### Pattern 1: Fully Cached Page

Generate when: Content is static or rarely changes, no user-specific data.

```typescript
import { cacheLife } from 'next/cache';
import { createSupabaseAnonServerClient } from '@/supabase-clients/anon/createSupabaseAnonServerClient';

export default async function ProductsPage() {
  'use cache';
  cacheLife('hours');
  
  const supabase = await createSupabaseAnonServerClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .limit(20);
  
  return (
    <div>
      <h1>Products</h1>
      <div className="grid">
        {products?.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### Pattern 2: Page with Params (Private Cache)

Generate when: Using route params or dynamic segments.

```typescript
import { cacheLife } from 'next/cache';
import { notFound } from 'next/navigation';
import { createSupabaseAnonServerClient } from '@/supabase-clients/anon/createSupabaseAnonServerClient';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  'use cache: private'; // Required for params
  cacheLife('minutes');
  
  const { slug } = await params;
  const supabase = await createSupabaseAnonServerClient();
  
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (!category) {
    notFound();
  }
  
  return (
    <div>
      <h1>{category.name}</h1>
      <p>{category.description}</p>
    </div>
  );
}
```

### Pattern 3: Mixed Static/Dynamic Page

Generate when: Page has both cacheable and dynamic content.

```typescript
import { Suspense } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { cookies } from 'next/headers';
import { createSupabaseAnonServerClient } from '@/supabase-clients/anon/createSupabaseAnonServerClient';

export default function DashboardPage() {
  return (
    <div>
      <StaticHeader />
      
      <Suspense fallback={<UserSkeleton />}>
        <UserProfile />
      </Suspense>
      
      <Suspense fallback={<ProductsSkeleton />}>
        <RecentProducts />
      </Suspense>
    </div>
  );
}

// Cached component
async function StaticHeader() {
  'use cache';
  cacheLife('hours');
  cacheTag('header');
  
  const supabase = await createSupabaseAnonServerClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('name, slug');
  
  return (
    <nav>
      {categories?.map(cat => (
        <a key={cat.slug} href={`/category/${cat.slug}`}>
          {cat.name}
        </a>
      ))}
    </nav>
  );
}

// Dynamic component with runtime data
async function UserProfile() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  
  // Fetch user-specific data
  return <div>{/* User profile */}</div>;
}

// Dynamic component with fresh data
async function RecentProducts() {
  const supabase = await createSupabaseAnonServerClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  return <div>{/* Products list */}</div>;
}
```

### Pattern 4: Cached Utility Functions

Generate when: Data fetching logic should be reusable and cached.

```typescript
import { cacheLife, cacheTag } from 'next/cache';
import { createSupabaseAnonServerClient } from '@/supabase-clients/anon/createSupabaseAnonServerClient';

export async function getCategories() {
  'use cache';
  cacheLife('hours');
  cacheTag('categories');
  
  const supabase = await createSupabaseAnonServerClient();
  const { data } = await supabase
    .from('categories')
    .select('*');
  
  return data ?? [];
}

export async function getTrendingProducts(limit: number = 10) {
  'use cache: private'; // Private because of parameter
  cacheLife('minutes');
  cacheTag('trending');
  
  const supabase = await createSupabaseAnonServerClient();
  const { data } = await supabase
    .rpc('get_trending_products', { limit_arg: limit });
  
  return data ?? [];
}
```

### Pattern 5: SearchParams with Prop Passing

Generate when: Need to use searchParams but want to cache static parts.

```typescript
import { Suspense } from 'react';

interface PageProps {
  searchParams: Promise<{ sort?: string; filter?: string }>;
}

export default function ProductsPage({ searchParams }: PageProps) {
  return (
    <div>
      <h1>Products</h1>
      <StaticCategories />
      
      <Suspense fallback={<ProductsSkeleton />}>
        <FilteredProducts 
          sortPromise={searchParams.then(sp => sp.sort)}
          filterPromise={searchParams.then(sp => sp.filter)}
        />
      </Suspense>
    </div>
  );
}

async function FilteredProducts({ 
  sortPromise, 
  filterPromise 
}: { 
  sortPromise: Promise<string | undefined>;
  filterPromise: Promise<string | undefined>;
}) {
  const sort = await sortPromise;
  const filter = await filterPromise;
  
  const supabase = await createSupabaseAnonServerClient();
  let query = supabase.from('products').select('*');
  
  if (filter) {
    query = query.eq('category', filter);
  }
  
  if (sort) {
    query = query.order(sort as any);
  }
  
  const { data: products } = await query;
  
  return <div>{/* Render products */}</div>;
}
```

## Conversion Process

When converting existing Next.js code to Cache Components:

### Step 1: Enable in Config
```typescript
// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default nextConfig;
```

### Step 2: Create Anonymous Supabase Client
If using Supabase, create the anonymous client (see pattern above).

### Step 3: Analyze and Convert

**For pages with old route segment configs:**

```typescript
// BEFORE
export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function Page() {
  const data = await fetch('...');
  return <div>...</div>;
}

// AFTER
import { cacheLife } from 'next/cache';

export default async function Page() {
  'use cache';
  cacheLife('hours');
  
  const data = await fetch('...');
  return <div>...</div>;
}
```

**For pages with cookies/sessions:**

```typescript
// BEFORE
export default async function Page() {
  const supabase = createClient(); // Uses cookies
  const { data } = await supabase.from('products').select('*');
  return <div>...</div>;
}

// AFTER - Split into cached and dynamic
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <CachedProducts /> {/* Use anon client */}
      
      <Suspense fallback={<UserSkeleton />}>
        <UserSection /> {/* Use regular client with cookies */}
      </Suspense>
    </div>
  );
}

async function CachedProducts() {
  'use cache';
  cacheLife('hours');
  
  const supabase = await createSupabaseAnonServerClient();
  const { data } = await supabase.from('products').select('*');
  return <div>...</div>;
}

async function UserSection() {
  const supabase = createClient(); // Can use cookies here
  // User-specific logic
  return <div>...</div>;
}
```

### Step 4: Add Cache Invalidation

```typescript
'use server';
import { updateTag } from 'next/cache';

export async function createProduct(formData: FormData) {
  const supabase = await createSupabaseAnonServerClient();
  
  await supabase.from('products').insert({
    name: formData.get('name'),
    // ...
  });
  
  updateTag('products'); // Immediately invalidate
}
```

## Route Handlers

### Static Route Handler
```typescript
export async function GET() {
  return Response.json({ status: 'ok', version: '1.0.0' });
}
```

### Cached Data Route Handler
```typescript
import { cacheLife } from 'next/cache';

export async function GET() {
  const products = await getProducts();
  return Response.json(products);
}

async function getProducts() {
  'use cache';
  cacheLife('hours');
  
  const supabase = await createSupabaseAnonServerClient();
  const { data } = await supabase.from('products').select('*');
  return data ?? [];
}
```

## Common Issues and Solutions

### "Uncached data was accessed outside of <Suspense>"
**Solution**: Wrap dynamic component in Suspense or add `use cache` to make it cached.

### "Cannot use cookies() in cached component"
**Solution**: Use anonymous Supabase client or move cookies() access to Suspense boundary.

### Params not working
**Solution**: Use `'use cache: private'` and `await params`.

### Cache not updating
**Solution**: Add `cacheTag()` and call `updateTag()` or `revalidateTag()` in mutations.

## Additional Resources

For detailed patterns and examples, reference:
- `references/patterns.md` - Common code patterns for all scenarios
- `references/migration.md` - Step-by-step migration guide from old Next.js code

## Key Reminders

1. **Always use anonymous Supabase client in cached scopes**
2. **Use `'use cache: private'` with params**
3. **Await params**: `const { slug } = await params`
4. **Wrap runtime APIs in Suspense**
5. **Tag cached data for invalidation**
6. **Choose appropriate cacheLife based on update frequency**
