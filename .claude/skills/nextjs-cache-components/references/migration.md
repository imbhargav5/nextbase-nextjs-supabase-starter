# Migration Guide: Converting to Cache Components

## Project-Level Migration Checklist

1. **Enable cacheComponents in next.config.js**
   ```typescript
   import type { NextConfig } from 'next';
   
   const nextConfig: NextConfig = {
     cacheComponents: true,
   };
   
   export default nextConfig;
   ```

2. **Create Anonymous Supabase Client** (if using Supabase)
   - Create `src/supabase-clients/anon/createSupabaseAnonServerClient.ts`
   - Configure with no-op cookie handlers
   - Disable auth session management

3. **Identify Pages to Convert**
   - Start with static/semi-static pages
   - Then convert pages with cacheable data
   - Leave highly dynamic pages for last

4. **Remove Old Route Segment Configs**
   - Remove `dynamic = "force-static"` (replace with `use cache`)
   - Remove `dynamic = "force-dynamic"` (not needed, dynamic by default)
   - Remove `revalidate` (replace with `cacheLife`)
   - Remove `fetchCache` (not needed with `use cache`)

## Page-Level Migration Steps

### Step 1: Analyze Current Data Access

Identify which data in the page:
- **Static/Rarely changes**: Can be cached with long lifetimes
- **Dynamic but cacheable**: Can be cached with short lifetimes
- **User-specific**: Needs Suspense boundaries
- **Real-time**: Should stay dynamic

### Step 2: Determine Cache Strategy

**Fully Static Page**
- Content rarely changes
- No user-specific data
- No runtime APIs

→ Add `'use cache'` with long `cacheLife`

**Partially Static Page**
- Mix of static and dynamic content
- Some cacheable, some real-time

→ Split into cached components and Suspense boundaries

**Dynamic Page with Cacheable Queries**
- User-specific layout
- Some shared data (categories, popular items)

→ Extract cacheable data to utility functions with `use cache`

**Fully Dynamic Page**
- Uses `cookies()`, `headers()`, or `searchParams` extensively
- Real-time user data

→ Leave mostly as-is, wrap in Suspense boundaries

### Step 3: Convert Data Fetching

**If using cookies/sessions in data fetching:**

Before:
```typescript
export default async function Page() {
  const supabase = createClient(); // Uses cookies
  const { data } = await supabase.from('products').select('*');
  return <div>...</div>;
}
```

After (for cacheable data):
```typescript
export default async function Page() {
  'use cache';
  cacheLife('hours');
  
  const supabase = await createSupabaseAnonServerClient(); // No cookies
  const { data } = await supabase.from('products').select('*');
  return <div>...</div>;
}
```

### Step 4: Handle Params and SearchParams

**With Params:**

Before:
```typescript
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  // fetch data using slug
}
```

After:
```typescript
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  'use cache: private'; // Note: private cache for params
  cacheLife('minutes');
  
  const { slug } = await params; // Await params
  const supabase = await createSupabaseAnonServerClient();
  // fetch data using slug
}
```

**With SearchParams:**

Before:
```typescript
export default function Page({ searchParams }: { searchParams: { sort: string } }) {
  const sort = searchParams.sort;
  // ...
}
```

After (pass down as prop):
```typescript
import { Suspense } from 'react';

export default function Page({ 
  searchParams 
}: { 
  searchParams: Promise<{ sort: string }> 
}) {
  return (
    <div>
      <h1>Static Header</h1>
      <Suspense fallback={<Skeleton />}>
        <DynamicContent sortPromise={searchParams.then(sp => sp.sort)} />
      </Suspense>
    </div>
  );
}

async function DynamicContent({ sortPromise }: { sortPromise: Promise<string> }) {
  const sort = await sortPromise;
  // use sort value
}
```

### Step 5: Add Suspense Boundaries

Wrap any dynamic content that:
- Uses `cookies()`, `headers()`, or runtime `searchParams`
- Fetches frequently-changing data
- Should stream after initial page load

```typescript
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <StaticHeader /> {/* Will be pre-rendered */}
      
      <Suspense fallback={<ProductsSkeleton />}>
        <DynamicProducts /> {/* Will stream in */}
      </Suspense>
      
      <StaticFooter /> {/* Will be pre-rendered */}
    </div>
  );
}
```

## Component-Level Migration

### Converting a Static Component

Before:
```typescript
export default async function Categories() {
  const { data } = await fetch('https://api.example.com/categories');
  return <div>...</div>;
}
```

After:
```typescript
import { cacheLife, cacheTag } from 'next/cache';

export default async function Categories() {
  'use cache';
  cacheLife('hours');
  cacheTag('categories');
  
  const supabase = await createSupabaseAnonServerClient();
  const { data } = await supabase.from('categories').select('*');
  return <div>...</div>;
}
```

### Splitting a Mixed Component

Before:
```typescript
export default async function ProductPage() {
  const categories = await fetchCategories(); // Cacheable
  const user = await getCurrentUser(); // Runtime
  const recentViews = await getUserRecentViews(user.id); // User-specific
  
  return (
    <div>
      <nav>{/* categories */}</nav>
      <div>{/* user info */}</div>
      <div>{/* recent views */}</div>
    </div>
  );
}
```

After:
```typescript
import { Suspense } from 'react';

export default function ProductPage() {
  return (
    <div>
      <CategoriesNav /> {/* Cached */}
      <Suspense fallback={<UserSkeleton />}>
        <UserSection /> {/* Dynamic */}
      </Suspense>
      <Suspense fallback={<ViewsSkeleton />}>
        <RecentViews /> {/* Dynamic */}
      </Suspense>
    </div>
  );
}

async function CategoriesNav() {
  'use cache';
  cacheLife('hours');
  
  const supabase = await createSupabaseAnonServerClient();
  const { data: categories } = await supabase.from('categories').select('*');
  return <nav>{/* render categories */}</nav>;
}

async function UserSection() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;
  // Fetch user data
  return <div>{/* render user */}</div>;
}

async function RecentViews() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;
  // Fetch recent views
  return <div>{/* render views */}</div>;
}
```

## Common Conversion Patterns

### Pattern 1: Fully Static to Cached

✅ **When**: Content rarely changes, no user-specific data

```typescript
// Add to top of component or page
'use cache';
cacheLife('days'); // or 'hours', 'minutes'
```

### Pattern 2: Mixed Content Split

✅ **When**: Page has both static and dynamic sections

```typescript
// Split into separate components
// Cached components get 'use cache'
// Dynamic components wrapped in Suspense
```

### Pattern 3: Extract Cacheable Data

✅ **When**: Dynamic page but some data is cacheable

```typescript
// Extract data fetching to utility functions
async function getCachedData() {
  'use cache';
  cacheLife('hours');
  // fetch data
}

// Use in dynamic component
export default async function Page() {
  const cachedData = await getCachedData();
  const dynamicData = await getDynamicData();
  return <div>...</div>;
}
```

### Pattern 4: Params with Private Cache

✅ **When**: Using route params or dynamic segments

```typescript
export default async function Page({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  'use cache: private'; // Important: private for params
  cacheLife('minutes');
  
  const { slug } = await params;
  // Use slug
}
```

## Route Handler Migration

### Static Route Handler

Before:
```typescript
export const dynamic = 'force-static';

export async function GET() {
  return Response.json({ status: 'ok' });
}
```

After:
```typescript
// Static by default if deterministic
export async function GET() {
  return Response.json({ status: 'ok' });
}
```

### Route Handler with Cached Data

Before:
```typescript
export async function GET() {
  const products = await db.query('SELECT * FROM products');
  return Response.json(products);
}
```

After:
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

## Testing Migration

1. **Check Build Output**: Ensure pages are marked as static/dynamic correctly
2. **Test Cache Behavior**: Verify cached content serves quickly
3. **Test Invalidation**: Ensure cache tags work with mutations
4. **Test Suspense Boundaries**: Verify loading states show correctly
5. **Monitor Performance**: Compare before/after load times

## Common Migration Issues

### Issue: "Uncached data was accessed outside of <Suspense>"

**Cause**: Dynamic code not wrapped in Suspense

**Fix**: Wrap the dynamic component in Suspense or add `use cache`

### Issue: "Cannot use cookies() in cached component"

**Cause**: Trying to access runtime API in cached scope

**Fix**: Use anonymous Supabase client or move to Suspense boundary

### Issue: Params not working

**Cause**: Forgot to await params or use private cache

**Fix**: 
```typescript
'use cache: private';
const { slug } = await params;
```

### Issue: Cache not invalidating

**Cause**: Missing cacheTag or not calling updateTag/revalidateTag

**Fix**: Add cacheTag and call appropriate invalidation function

## Best Practices

1. **Start with mostly-static pages** - Easier to convert
2. **Use anonymous clients for public data** - Avoids cookie issues
3. **Be intentional with Suspense boundaries** - Affects loading UX
4. **Tag cached data** - Makes invalidation easier
5. **Use appropriate cacheLife** - Balance freshness vs performance
6. **Private cache for params** - Always use `'use cache: private'` with params
7. **Test thoroughly** - Especially cache invalidation flows
