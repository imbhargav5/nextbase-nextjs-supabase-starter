import { createServerSupabaseClient } from '@/supabase-clients/server';
import { NextResponse } from 'next/server';

// Helper function to generate unique username from email
async function generateUniqueUsername(email: string): Promise<string> {
  const supabase = await createServerSupabaseClient();
  const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '');
  let username = baseUsername;
  let counter = 1;

  while (counter < 100) {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (!data) {
      return username;
    }

    username = `${baseUsername}${counter}`;
    counter++;
  }

  return `${baseUsername}${Date.now()}`;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Auto-create profile if first OAuth login
      const uniqueUsername = await generateUniqueUsername(data.user.email || 'user');
      
      await supabase.from('profiles').upsert(
        {
          id: data.user.id,
          display_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          username: uniqueUsername,
          avatar_url: data.user.user_metadata?.avatar_url,
          is_verified: !!data.user.confirmed_at,
        },
        { onConflict: 'id', ignoreDuplicates: true }
      );

      return NextResponse.redirect(new URL('/dashboard', origin));
    }
  }

  return NextResponse.redirect(new URL('/login?error=oauth_failed', origin));
}
