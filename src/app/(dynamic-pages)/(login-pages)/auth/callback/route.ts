import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    try {
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      // Handle error
      console.error('Failed to exchange code for session: ', error);
      // Potentially return an error response here
    }
  }

  // Revalidates the path in Next.js cache
  revalidatePath('/');

  // Constructs the URL to redirect to after the sign in process completes
  const redirectTo = new URL('/', requestUrl.origin);

  return NextResponse.redirect(redirectTo);
}
