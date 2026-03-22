import { createServerSupabaseClient } from '@/supabase-clients/server';
import { sanitizeInput, checkRateLimit } from '@/lib/security';

export async function GET(request: Request) {
  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const isRateLimited = await checkRateLimit(`budget-list:${clientIp}`);
    
    if (!isRateLimited) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const url = new URL(request.url);
    const teamId = url.searchParams.get('teamId');

    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!teamId) {
      return Response.json({ error: 'Team ID is required' }, { status: 400 });
    }

    // Check if user is member of the team
    const { data: teamMember, error: memberError } = await supabase
      .from('team_members')
      .select('team_role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single();

    if (memberError || !teamMember) {
      return Response.json({ error: 'You are not a member of this team' }, { status: 403 });
    }

    // Get budgets for the team
    const { data: budgets, error: budgetsError } = await supabase
      .from('budgets')
      .select(`
        *,
        created_by_user:profiles!budgets_created_by_fkey (
          id, display_name, avatar_url
        ),
        _count:budget_items (
          count
        )
      `)
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (budgetsError) {
      console.error('Get budgets error:', budgetsError);
      return Response.json({ error: 'Failed to fetch budgets' }, { status: 500 });
    }

    return Response.json({ budgets });
  } catch (error) {
    console.error('Get budgets error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const isRateLimited = await checkRateLimit(`budget-create:${clientIp}`);
    
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
    if (!body.name || !body.team_id || !body.total_amount) {
      return Response.json({ error: 'Name, team ID, and total amount are required' }, { status: 400 });
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
      name: sanitizeInput(body.name).trim(),
      description: body.description ? sanitizeInput(body.description).trim() : null,
      total_amount: parseFloat(body.total_amount),
      currency: body.currency || 'USD',
      period: body.period || null,
      status: 'active',
      team_id: body.team_id,
      created_by: user.id,
      created_at: new Date().toISOString()
    };

    const { data: budget, error: insertError } = await supabase
      .from('budgets')
      .insert([sanitizedData])
      .select()
      .single();

    if (insertError) {
      console.error('Create budget error:', insertError);
      return Response.json({ error: 'Failed to create budget' }, { status: 500 });
    }

    return Response.json({ budget }, { status: 201 });
  } catch (error) {
    console.error('Create budget error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}