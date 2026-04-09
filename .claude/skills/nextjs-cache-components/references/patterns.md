# Next.js 16 Cache Components Patterns

## Supabase Anonymous Client Pattern

### Creating the Anon Client

For cache components, use an anonymous Supabase client that doesn't rely on cookies:

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

**Why this pattern?**
- Cached components cannot use runtime APIs like `cookies()`
- Anonymous clients work without user sessions
- Safe for public data that doesn't require authentication

### Using with Standard Cache

```typescript
export default async function HomePage() {
  'use cache';
  cacheLife('hours');
  
  const supabase = await createSupabaseAnonServerClient();
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .limit(10);
  
  return <div>{/* render products */}</div>;
}
```

### Using with Private Cache (for params/searchParams)

```typescript
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  'use cache: private';
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
  
  return <div>{/* render category */}</div>;
}
```

## Page Patterns

### Fully Static Page

```typescript
import { cacheLife } from 'next/cache';

export default async function AboutPage() {
  'use cache';
  cacheLife('days');
  
  return (
    <div>
      <h1>About Us</h1>
      <p>Static content that rarely changes</p>
    </div>
  );
}
```

### Page with Static Shell and Dynamic Content

```typescript
import { Suspense } from 'react';
import { cacheLife } from 'next/cache';

export default function ProductPage() {
  return (
    <div>
      <StaticHeader />
      <Suspense fallback={<ProductSkeleton />}>
        <DynamicProductList />
      </Suspense>
      <StaticFooter />
    </div>
  );
}

async function StaticHeader() {
  'use cache';
  cacheLife('hours');
  
  const supabase = await createSupabaseAnonServerClient();
  const { data: categories } = await supabase.from('categories').select('name, slug');
  
  return <nav>{/* render categories */}</nav>;
}

async function DynamicProductList() {
  const supabase = await createSupabaseAnonServerClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  
  return <div>{/* render products */}</div>;
}
```

### Page with Runtime Data (User-Specific)

```typescript
import { Suspense } from 'react';
import { cookies } from 'next/headers';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<UserSkeleton />}>
        <UserInfo />
      </Suspense>
      <Suspense fallback={<DataSkeleton />}>
        <UserData />
      </Suspense>
    </div>
  );
}

async function UserInfo() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  // Fetch user-specific data
  return <div>{/* render user info */}</div>;
}
```

## Component Patterns

### Cached Component with Data Fetching

```typescript
import { cacheLife, cacheTag } from 'next/cache';

export async function PopularProducts() {
  'use cache';
  cacheLife('hours');
  cacheTag('popular-products');
  
  const supabase = await createSupabaseAnonServerClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('popularity', { ascending: false })
    .limit(5);
  
  return (
    <div>
      {products?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Cached Wrapper Component

```typescript
import type { ReactNode } from 'react';
import { cacheLife } from 'next/cache';

export async function SiteLayout({ children }: { children: ReactNode }) {
  'use cache';
  cacheLife('hours');
  
  const supabase = await createSupabaseAnonServerClient();
  const { data: siteConfig } = await supabase
    .from('site_config')
    .select('*')
    .single();
  
  return (
    <div className="site-wrapper">
      <header>{siteConfig?.site_name}</header>
      {children}
      <footer>© {new Date().getFullYear()}</footer>
    </div>
  );
}
```

### Component with Params (Private Cache)

```typescript
export async function ProductDetails({ productId }: { productId: string }) {
  'use cache: private';
  cacheLife('minutes');
  
  const supabase = await createSupabaseAnonServerClient();
  const { data: product } = await supabase
    .from('products')
    .select('*, reviews(*)')
    .eq('id', productId)
    .single();
  
  return <div>{/* render product details */}</div>;
}
```

## Utility Function Patterns

### Cached Data Fetching Function

```typescript
import { cacheLife, cacheTag } from 'next/cache';

export async function getProducts() {
  'use cache';
  cacheLife('hours');
  cacheTag('products');
  
  const supabase = await createSupabaseAnonServerClient();
  const { data } = await supabase
    .from('products')
    .select('*');
  
  return data ?? [];
}
```

### Cached RPC Call

```typescript
export async function getTrendingProducts(limit: number = 10) {
  'use cache: private';
  cacheLife('minutes');
  cacheTag('trending');
  
  const supabase = await createSupabaseAnonServerClient();
  const { data } = await supabase
    .rpc('get_trending_products', { limit_arg: limit });
  
  return data ?? [];
}
```

## Route Handler Patterns

### Static Route Handler

```typescript
export async function GET() {
  return Response.json({
    version: '1.0.0',
    status: 'operational'
  });
}
```

### Route Handler with Cached Data

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
  const { data } = await supabase
    .from('products')
    .select('*');
  
  return data ?? [];
}
```

### Dynamic Route Handler (No Caching)

```typescript
export async function GET() {
  return Response.json({
    randomNumber: Math.random(),
    timestamp: new Date().toISOString()
  });
}
```

## Cache Invalidation Patterns

### With updateTag (Immediate)

```typescript
'use server';
import { updateTag } from 'next/cache';

export async function createProduct(formData: FormData) {
  const supabase = await createSupabaseAnonServerClient();
  
  await supabase
    .from('products')
    .insert({
      name: formData.get('name'),
      // ... other fields
    });
  
  // Immediately expire and refresh
  updateTag('products');
}
```

### With revalidateTag (Eventual)

```typescript
'use server';
import { revalidateTag } from 'next/cache';

export async function updateProduct(id: string, data: any) {
  const supabase = await createSupabaseAnonServerClient();
  
  await supabase
    .from('products')
    .update(data)
    .eq('id', id);
  
  // Mark for revalidation on next request
  revalidateTag('products', 'max');
}
```

## Mixed Static/Dynamic Patterns

### E-commerce Product Page

```typescript
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <Suspense fallback={<ProductHeaderSkeleton />}>
        <ProductHeader params={params} />
      </Suspense>
      
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews params={params} />
      </Suspense>
      
      <Suspense fallback={<RecommendationsSkeleton />}>
        <DynamicRecommendations />
      </Suspense>
    </div>
  );
}

// Cached product info
async function ProductHeader({ params }: { params: Promise<{ id: string }> }) {
  'use cache: private';
  cacheLife('hours');
  
  const { id } = await params;
  const supabase = await createSupabaseAnonServerClient();
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (!product) notFound();
  
  return <div>{/* render product header */}</div>;
}

// Dynamic reviews (frequently updated)
async function ProductReviews({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseAnonServerClient();
  
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', id)
    .order('created_at', { ascending: false });
  
  return <div>{/* render reviews */}</div>;
}

// Dynamic personalized recommendations
async function DynamicRecommendations() {
  const supabase = await createSupabaseAnonServerClient();
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .limit(4);
  
  return <div>{/* render recommendations */}</div>;
}
```

## Migration Patterns

### Before: Route Segment Config

```typescript
// OLD APPROACH - Don't use this
export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>...</div>;
}
```

### After: Cache Components

```typescript
// NEW APPROACH - Use this
import { cacheLife } from 'next/cache';

export default async function Page() {
  'use cache';
  cacheLife('hours');
  
  const data = await fetch('https://api.example.com/data');
  return <div>...</div>;
}
```

### Before: Force Dynamic

```typescript
// OLD APPROACH
export const dynamic = 'force-dynamic';

export default function Page() {
  return <div>Dynamic content</div>;
}
```

### After: Just Remove It

```typescript
// NEW APPROACH - Pages are dynamic by default
export default function Page() {
  return <div>Dynamic content</div>;
}
```
