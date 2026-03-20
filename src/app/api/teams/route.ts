import { teamCreateSchema } from '@/lib/validations/team.schema';
import { createServerSupabaseClient } from '@/supabase-clients/server';
import { sanitizeInput, checkRateLimit } from '@/lib/security';

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const isRateLimited = await checkRateLimit(`team-create:${clientIp}`);
    
    if (!isRateLimited) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = teamCreateSchema.safeParse(body);
    
    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      ...parsed.data,
      name: sanitizeInput(parsed.data.name).trim(),
      description: parsed.data.description ? sanitizeInput(parsed.data.description).trim() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Additional validation
    if (sanitizedData.name.length > 100) {
      return Response.json({ error: 'Team name too long' }, { status: 400 });
    }
    
    if (sanitizedData.description && sanitizedData.description.length > 500) {
      return Response.json({ error: 'Team description too long' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('teams')
      .insert({ ...sanitizedData, owner_id: user.id })
      .select('id, name, description, is_public, owner_id, created_at, updated_at')
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return Response.json({ error: 'Internal server error' }, { status: 500 });
    }

    // Add creator as team member
    await supabase.from('team_members').insert({
      team_id: data.id,
      user_id: user.id,
      team_role: 'owner',
      joined_at: new Date().toISOString()
    });

    return Response.json({ team: data }, { status: 201 });
  } catch (error) {
    console.error('Create team error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const isRateLimited = await checkRateLimit(`team-list:${clientIp}`);
    
    if (!isRateLimited) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get teams where user is a member with proper typing
    const { data, error } = await supabase
      .from('team_members')
      .select(`
        teams (
          id,
          name,
          description,
          is_public,
          owner_id,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Database query error:', error);
      return Response.json({ error: 'Internal server error' }, { status: 500 });
    }

    const teams = data?.map(tm => (tm as any).teams) || [];
    return Response.json({ teams });
  } catch (error) {
    console.error('Get teams error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
