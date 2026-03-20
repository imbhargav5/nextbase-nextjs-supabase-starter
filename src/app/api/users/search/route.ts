import { userSearchSchema } from '@/lib/validations/profile.schema';
import { createServerSupabaseClient } from '@/supabase-clients/server';

export async function GET(request: Request) {
  try {
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
    let query = supabase
      .from('profiles')
      .select('id, display_name, username, headline, location, skills, avatar_url, created_at')
      .limit(Number(limit || 20))
      .range(Number(offset || 0), Number(offset || 0) + Number(limit || 20));

    // Search by name with proper escaping
    if (q) {
      const escapedQ = q.replace(/[%_]/g, '\\$&');
      query = query.or(`display_name.ilike.%${escapedQ}%,username.ilike.%${escapedQ}%`);
    }

    // Filter by skills if provided
    if (skills && Array.isArray(skills)) {
      // Use contains operator for array columns
      query = query.contains('skills', skills);
    }

    // Filter by location if provided
    if (location) {
      const escapedLocation = location.replace(/[%_]/g, '\\$&');
      query = query.ilike('location', `%${escapedLocation}%`);
    }

    // Exclude current user and only show public profiles
    query = query.neq('id', user.id).eq('is_public', true);

    const { data, error } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ users: data || [] });
  } catch (error) {
    console.error('User search error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
