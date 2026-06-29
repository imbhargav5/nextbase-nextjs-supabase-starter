import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { match } from 'path-to-regexp';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

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
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid adding logic between createServerClient and
  // supabase.auth.getUser(). Extra work here can make session refresh bugs hard
  // to diagnose.

  const protectedPages = [
    '/dashboard',
    '/private-item',
    '/private-items',
    '/items',
    '/item',
  ] as const;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    protectedPages.some((page) => match(page)(request.nextUrl.pathname))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
