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

    // For now, return mock profile since profiles table doesn't exist in database types
    // This would be implemented once the proper profiles table is created
    return Response.json({ 
      user: {
        id: user.id,
        display_name: 'Demo User',
        username: 'demo-user',
        bio: 'A demo user for testing',
        headline: 'Software Developer',
        location: 'San Francisco, CA',
        skills: ['JavaScript', 'TypeScript', 'React'],
        avatar_url: null,
        banner_url: null,
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });
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

    // For now, return mock updated profile since profiles table doesn't exist in database types
    // This would be implemented once the proper profiles table is created
    return Response.json({ 
      user: {
        id: user.id,
        display_name: sanitizedData.display_name,
        username: sanitizedData.username,
        bio: sanitizedData.bio,
        headline: sanitizedData.headline,
        location: sanitizedData.location,
        skills: ['JavaScript', 'TypeScript', 'React'], // Mock skills
        avatar_url: null,
        banner_url: null,
        is_public: true,
        updated_at: sanitizedData.updated_at
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
