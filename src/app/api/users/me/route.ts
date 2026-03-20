import { profileUpdateSchema } from '@/lib/validations/profile.schema';
import { createServerSupabaseClient } from '@/supabase-clients/server';
import { sanitizeInput, checkRateLimit } from '@/lib/security';

export async function GET(request: Request) {
  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const isRateLimited = await checkRateLimit(`user-profile:${clientIp}`);
    
    if (!isRateLimited) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, display_name, username, bio, headline, location, skills, avatar_url, banner_url, is_public, created_at, updated_at')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Database query error:', error);
      return Response.json({ error: 'Internal server error' }, { status: 500 });
    }

    return Response.json({ user: profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const isRateLimited = await checkRateLimit(`user-update:${clientIp}`);
    
    if (!isRateLimited) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      ...parsed.data,
      display_name: sanitizeInput(parsed.data.display_name).trim(),
      username: sanitizeInput(parsed.data.username).toLowerCase().trim(),
      bio: parsed.data.bio ? sanitizeInput(parsed.data.bio).trim() : null,
      headline: parsed.data.headline ? sanitizeInput(parsed.data.headline).trim() : null,
      location: parsed.data.location ? sanitizeInput(parsed.data.location).trim() : null,
      updated_at: new Date().toISOString()
    };

    // Additional validation
    if (sanitizedData.display_name.length > 100) {
      return Response.json({ error: 'Display name too long' }, { status: 400 });
    }
    
    if (sanitizedData.bio && sanitizedData.bio.length > 500) {
      return Response.json({ error: 'Bio too long' }, { status: 400 });
    }
    
    if (sanitizedData.headline && sanitizedData.headline.length > 100) {
      return Response.json({ error: 'Headline too long' }, { status: 400 });
    }
    
    if (sanitizedData.location && sanitizedData.location.length > 100) {
      return Response.json({ error: 'Location too long' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(sanitizedData)
      .eq('id', user.id)
      .select('id, display_name, username, bio, headline, location, skills, avatar_url, banner_url, is_public, updated_at')
      .single();

    if (error) {
      console.error('Database update error:', error);
      return Response.json({ error: 'Internal server error' }, { status: 500 });
    }

    return Response.json({ user: data });
  } catch (error) {
    console.error('Update profile error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
