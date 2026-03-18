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
      .select('*')
      .limit(Number(limit || 20))
      .range(Number(offset || 0), Number(offset || 0) + Number(limit || 20));

    // Search by name
    if (q) {
      const escapedQ = q.replace(/[%_]/g, '\\$&');
      query = query.or(`display_name.ilike.%${escapedQ}%,username.ilike.%${escapedQ}%`);
    }

    // Filter by skills if provided
    if (skills && typeof skills === 'string') {
      const skillArray = skills.split(',').map(s => s.trim());
      // Note: PostgreSQL array contains - adjust based on actual operator support
      query = query.filter('skills', 'cs', skillArray);
    }

    // Filter by location if provided
    if (location) {
      const escapedLocation = location.replace(/[%_]/g, '\\$&');
      query = query.ilike('location', `%${escapedLocation}%`);
    }

    // Exclude current user
    query = query.neq('id', user.id);

    const { data, error } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ users: data || [] });
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
