import { userSearchSchema } from '@/lib/validations/profile.schema';
import { createServerSupabaseClient } from '@/supabase-clients/server';
import { sanitizeInput, checkRateLimit } from '@/lib/security';

export async function GET(request: Request) {
  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const isRateLimited = await checkRateLimit(`user-search:${clientIp}`);
    
    if (!isRateLimited) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = userSearchSchema.safeParse(Object.fromEntries(searchParams));

    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { q, skills, location, limit, offset } = parsed.data;
    
    // Sanitize inputs
    const sanitizedQ = q ? sanitizeInput(q) : undefined;
    const sanitizedLocation = location ? sanitizeInput(location) : undefined;
    const sanitizedSkills = skills && Array.isArray(skills) 
      ? skills.map(skill => sanitizeInput(skill)) 
      : undefined;
    
    // Input validation
    if (sanitizedQ && sanitizedQ.length > 100) {
      return Response.json({ error: 'Search query too long' }, { status: 400 });
    }
    
    if (sanitizedLocation && sanitizedLocation.length > 100) {
      return Response.json({ error: 'Location query too long' }, { status: 400 });
    }

    // Validate and sanitize pagination parameters
    const safeLimit = Math.min(Math.max(Number(limit || 20), 1), 100);
    const safeOffset = Math.max(Number(offset || 0), 0);

    let query = supabase
      .from('profiles')
      .select('id, display_name, username, headline, location, skills, avatar_url, created_at')
      .limit(safeLimit)
      .range(safeOffset, safeOffset + safeLimit);

    // Search by name with proper escaping
    if (sanitizedQ) {
      const escapedQ = sanitizedQ.replace(/[%_]/g, '\\$&');
      query = query.or(`display_name.ilike.%${escapedQ}%,username.ilike.%${escapedQ}%`);
    }

    // Filter by skills if provided
    if (sanitizedSkills && sanitizedSkills.length > 0) {
      // Use contains operator for array columns
      query = query.contains('skills', sanitizedSkills);
    }

    // Filter by location if provided
    if (sanitizedLocation) {
      const escapedLocation = sanitizedLocation.replace(/[%_]/g, '\\$&');
      query = query.ilike('location', `%${escapedLocation}%`);
    }

    // Exclude current user and only show public profiles
    query = query.neq('id', user.id).eq('is_public', true);

    const { data, error } = await query;

    if (error) {
      console.error('Database query error:', error);
      return Response.json({ error: 'Internal server error' }, { status: 500 });
    }

    return Response.json({ users: data || [] });
  } catch (error) {
    console.error('User search error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
