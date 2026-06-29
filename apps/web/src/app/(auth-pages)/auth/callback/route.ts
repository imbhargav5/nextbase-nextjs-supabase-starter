import { createServerClient } from '@supabase/ssr';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('Failed to exchange code for session: ', error);
    }
  }

  revalidatePath('/', 'layout');

  let redirectTo = new URL('/dashboard', requestUrl.origin);

  if (next) {
    const decodedNext = decodeURIComponent(next);
    redirectTo = new URL(decodedNext, requestUrl.origin);
  }

  return NextResponse.redirect(redirectTo);
}
