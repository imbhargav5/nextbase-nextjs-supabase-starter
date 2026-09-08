import { type NextRequest } from 'next/server';
import { match } from 'path-to-regexp';
import { updateSession } from './supabase-clients/middleware';

const apiRoutes = ['/api{/*path}'];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // API routes bypass session refresh here.
  if (apiRoutes.some((route) => match(route)(pathname))) {
    return null;
  }
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static assets and the Next.js image pipeline.
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
