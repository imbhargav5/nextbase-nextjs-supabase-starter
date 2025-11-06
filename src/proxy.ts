import { type NextRequest } from 'next/server';
import { match } from 'path-to-regexp';
import { updateSession } from './supabase-clients/middleware';

const apiRoutes = ['/api{/*path}'];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // api routes are not handled by middleare for this project.
  if (apiRoutes.some((route) => match(route)(pathname))) {
    return null;
  }
  if (request.nextUrl.pathname) return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};

