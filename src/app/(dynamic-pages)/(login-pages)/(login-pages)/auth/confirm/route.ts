import { createSupabaseClient } from '@/supabase-clients/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token_hash = searchParams.get('token_hash');
  const next = searchParams.get('next') ?? '/dashboard';
  if (token_hash) {
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.verifyOtp({
      type: 'magiclink',
      token_hash,
    });
    if (!error) {
      return NextResponse.redirect(new URL(`/${next.slice(1)}`, req.url));
    }
  }
  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', req.url));
}
