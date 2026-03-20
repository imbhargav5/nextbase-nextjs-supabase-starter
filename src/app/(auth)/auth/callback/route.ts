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

// Sanitize user metadata to prevent XSS
function sanitizeUserMetadata(metadata: any): any {
  if (!metadata) return {};
  
  return {
    full_name: metadata.full_name ? metadata.full_name.trim().slice(0, 100) : undefined,
    avatar_url: metadata.avatar_url ? metadata.avatar_url.trim().slice(0, 500) : undefined,
  };
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, origin));
  }

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code);

    if (authError) {
      console.error('OAuth exchange error:', authError);
      return NextResponse.redirect(new URL('/login?error=oauth_failed', origin));
    }

    if (data.user) {
      try {
        // Sanitize user metadata
        const sanitizedMetadata = sanitizeUserMetadata(data.user.user_metadata);
        
        // Auto-create profile if first OAuth login
        const uniqueUsername = await generateUniqueUsername(data.user.email || 'user');
        
        const { error: profileError } = await supabase.from('profiles').upsert(
          {
            id: data.user.id,
            display_name: sanitizedMetadata.full_name || data.user.email?.split('@')[0] || 'User',
            username: uniqueUsername,
            avatar_url: sanitizedMetadata.avatar_url,
            is_verified: !!data.user.confirmed_at,
            created_at: data.user.created_at,
          },
          { onConflict: 'id', ignoreDuplicates: false }
        );

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        return NextResponse.redirect(new URL('/dashboard', origin));
      } catch (error) {
        console.error('Callback processing error:', error);
        return NextResponse.redirect(new URL('/login?error=profile_creation_failed', origin));
      }
    }
  }

  return NextResponse.redirect(new URL('/login?error=invalid_callback', origin));
}
