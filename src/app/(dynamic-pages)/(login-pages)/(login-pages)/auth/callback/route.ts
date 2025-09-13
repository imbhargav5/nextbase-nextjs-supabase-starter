import { createSupabaseClient } from '@/supabase-clients/server';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');

  if (code) {
    const supabase = createSupabaseClient();
    try {
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      // Handle error
      console.error('Failed to exchange code for session: ', error);
      // Potentially return an error response here
    }
  }
  revalidatePath('/', 'layout');

  let redirectTo = new URL('/dashboard', requestUrl.origin);

  if (next) {
    // decode next param
    const decodedNext = decodeURIComponent(next);
    // validate next param
    redirectTo = new URL(decodedNext, requestUrl.origin);
  }
  return NextResponse.redirect(redirectTo);
}
