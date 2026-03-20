import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => response.cookies.set({ name, value, ...options }),
        remove: (name, options) => response.cookies.set({ name, value: '', ...options }),
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const isAuthRoute = request.nextUrl.pathname.match(/^\/(login|register|forgot-password|auth)/);
  const isDashRoute = !isAuthRoute && !request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.startsWith('/_next') && !request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp)$/);

  // Redirect to login if accessing dashboard without session
  if (!session && isDashRoute && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if already authenticated and accessing auth routes
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
