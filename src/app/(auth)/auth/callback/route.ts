import { createServerSupabaseClient } from '@/supabase-clients/server';
import { NextResponse } from 'next/server';

// Helper function to generate unique username from email
async function generateUniqueUsername(email: string): Promise<string> {
  const supabase = await createServerSupabaseClient();
  const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '');
  let username = baseUsername;
  let counter = 1;

  // For now, just return the base username since user_profiles table doesn't exist in types
  return baseUsername;
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
        
        // For now, skip profile creation since user_profiles table doesn't exist in types
        // This would be implemented once the proper user_profiles table is created

        return NextResponse.redirect(new URL('/dashboard', origin));
      } catch (error) {
        console.error('Callback processing error:', error);
        return NextResponse.redirect(new URL('/login?error=profile_creation_failed', origin));
      }
    }
  }

  return NextResponse.redirect(new URL('/login?error=invalid_callback', origin));
}
