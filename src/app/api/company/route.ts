import { createServerSupabaseClient } from '@/supabase-clients/server';
import { sanitizeInput, checkRateLimit } from '@/lib/security';

export async function GET(request: Request) {
  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const isRateLimited = await checkRateLimit(`company-list:${clientIp}`);
    
    if (!isRateLimited) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get published company pages
    const { data: companyPages, error } = await supabase
      .from('company_pages')
      .select(`
        *,
        team:teams!company_pages_team_id_fkey (
          id, name, slug, avatar_url, description
        ),
        _count:open_positions (
          count
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get company pages error:', error);
      return Response.json({ error: 'Failed to fetch company pages' }, { status: 500 });
    }

    return Response.json({ companyPages });
  } catch (error) {
    console.error('Get company pages error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const isRateLimited = await checkRateLimit(`company-create:${clientIp}`);
    
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
    if (!body.team_id) {
      return Response.json({ error: 'Team ID is required' }, { status: 400 });
    }

    // Check if user is owner/captain of the team
    const { data: teamMember, error: memberError } = await supabase
      .from('team_members')
      .select('team_role')
      .eq('team_id', body.team_id)
      .eq('user_id', user.id)
      .single();

    if (memberError || !teamMember || !['owner', 'captain'].includes(teamMember.team_role)) {
      return Response.json({ error: 'You must be an owner or captain of the team' }, { status: 403 });
    }

    // Sanitize inputs
    const sanitizedData = {
      tagline: body.tagline ? sanitizeInput(body.tagline).trim() : null,
      industry: body.industry || null,
      stage: body.stage || null,
      founded_year: body.founded_year || null,
      employee_range: body.employee_range || null,
      website: body.website || null,
      linkedin_url: body.linkedin_url || null,
      twitter_url: body.twitter_url || null,
      locations: body.locations || [],
      tech_stack: body.tech_stack || [],
      is_hiring: body.is_hiring || false,
      is_published: body.is_published || false,
      team_id: body.team_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: companyPage, error: insertError } = await supabase
      .from('company_pages')
      .insert([sanitizedData])
      .select()
      .single();

    if (insertError) {
      console.error('Create company page error:', insertError);
      return Response.json({ error: 'Failed to create company page' }, { status: 500 });
    }

    return Response.json({ companyPage }, { status: 201 });
  } catch (error) {
    console.error('Create company page error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}