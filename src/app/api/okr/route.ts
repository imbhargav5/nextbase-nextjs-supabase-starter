import { createServerSupabaseClient } from '@/supabase-clients/server';
import { sanitizeInput, checkRateLimit } from '@/lib/security';

export async function GET(request: Request) {
  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const isRateLimited = await checkRateLimit(`okr-list:${clientIp}`);
    
    if (!isRateLimited) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's team memberships
    const { data: teamMemberships, error: memberError } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.id);

    if (memberError) {
      console.error('Get team memberships error:', memberError);
      return Response.json({ error: 'Failed to fetch team memberships' }, { status: 500 });
    }

    if (!teamMemberships || teamMemberships.length === 0) {
      return Response.json({ objectives: [] });
    }

    const teamIds = teamMemberships.map(m => m.team_id);

    // Get objectives for user's teams
    const { data: objectives, error: objError } = await supabase
      .from('objectives')
      .select(`
        *,
        owner:profiles!objectives_owner_id_fkey (
          id, display_name, avatar_url
        ),
        key_results (
          *,
          assignee:profiles!key_results_assigned_to_fkey (
            id, display_name, avatar_url
          )
        ),
        _count:key_results (
          count
        )
      `)
      .in('team_id', teamIds)
      .order('created_at', { ascending: false });

    if (objError) {
      console.error('Get objectives error:', objError);
      return Response.json({ error: 'Failed to fetch objectives' }, { status: 500 });
    }

    return Response.json({ objectives });
  } catch (error) {
    console.error('Get OKR error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const isRateLimited = await checkRateLimit(`okr-create:${clientIp}`);
    
    if (!isRateLimited) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.team_id) {
      return Response.json({ error: 'Title and team ID are required' }, { status: 400 });
    }

    // Check if user is owner/captain/manager of the team
    const { data: teamMember, error: memberError } = await supabase
      .from('team_members')
      .select('team_role')
      .eq('team_id', body.team_id)
      .eq('user_id', user.id)
      .single();

    if (memberError || !teamMember || !['owner', 'captain', 'manager'].includes(teamMember.team_role)) {
      return Response.json({ error: 'You must be an owner, captain, or manager of the team' }, { status: 403 });
    }

    // Sanitize inputs
    const sanitizedData = {
      title: sanitizeInput(body.title).trim(),
      description: body.description ? sanitizeInput(body.description).trim() : null,
      period: body.period || 'Q1 2025',
      status: 'on_track',
      progress_pct: 0,
      is_public: body.is_public !== false,
      team_id: body.team_id,
      owner_id: user.id,
      parent_id: body.parent_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: objective, error: insertError } = await supabase
      .from('objectives')
      .insert([sanitizedData])
      .select()
      .single();

    if (insertError) {
      console.error('Create objective error:', insertError);
      return Response.json({ error: 'Failed to create objective' }, { status: 500 });
    }

    return Response.json({ objective }, { status: 201 });
  } catch (error) {
    console.error('Create OKR error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}