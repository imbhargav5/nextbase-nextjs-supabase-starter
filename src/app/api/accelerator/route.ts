import { createServerSupabaseClient } from '@/supabase-clients/server';
import { sanitizeInput, checkRateLimit } from '@/lib/security';

export async function GET(request: Request) {
  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const isRateLimited = await checkRateLimit(`accelerator-list:${clientIp}`);
    
    if (!isRateLimited) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get public cohorts
    const { data: cohorts, error } = await supabase
      .from('cohorts')
      .select(`
        *,
        host_team:teams!cohorts_host_team_id_fkey (
          id, name, slug, avatar_url
        ),
        _count:cohort_teams (
          count
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get cohorts error:', error);
      return Response.json({ error: 'Failed to fetch cohorts' }, { status: 500 });
    }

    return Response.json({ cohorts });
  } catch (error) {
    console.error('Get cohorts error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const isRateLimited = await checkRateLimit(`accelerator-create:${clientIp}`);
    
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
    if (!body.name || !body.host_team_id) {
      return Response.json({ error: 'Name and host team ID are required' }, { status: 400 });
    }

    // Check if user is owner/captain of the host team
    const { data: teamMember, error: memberError } = await supabase
      .from('team_members')
      .select('team_role')
      .eq('team_id', body.host_team_id)
      .eq('user_id', user.id)
      .single();

    if (memberError || !teamMember || !['owner', 'captain'].includes(teamMember.team_role)) {
      return Response.json({ error: 'You must be an owner or captain of the host team' }, { status: 403 });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(body.name).trim(),
      description: body.description ? sanitizeInput(body.description).trim() : null,
      program_type: body.program_type || 'accelerator',
      status: 'draft',
      starts_at: body.starts_at || null,
      ends_at: body.ends_at || null,
      max_teams: body.max_teams || 20,
      application_url: body.application_url || null,
      is_public: body.is_public || false,
      banner_url: body.banner_url || null,
      host_team_id: body.host_team_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: cohort, error: insertError } = await supabase
      .from('cohorts')
      .insert([sanitizedData])
      .select()
      .single();

    if (insertError) {
      console.error('Create cohort error:', insertError);
      return Response.json({ error: 'Failed to create cohort' }, { status: 500 });
    }

    return Response.json({ cohort }, { status: 201 });
  } catch (error) {
    console.error('Create cohort error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}