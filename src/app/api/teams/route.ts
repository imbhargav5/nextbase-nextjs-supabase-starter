import { teamCreateSchema } from '@/lib/validations/team.schema';
import { createServerSupabaseClient } from '@/supabase-clients/server';

export async function POST(request: Request) {
  try {
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
      name: parsed.data.name.trim(),
      description: parsed.data.description?.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('teams')
      .insert({ ...sanitizedData, owner_id: user.id })
      .select('id, name, description, is_public, owner_id, created_at, updated_at')
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
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
      return Response.json({ error: error.message }, { status: 500 });
    }

    const teams = data?.map(tm => (tm as any).teams) || [];
    return Response.json({ teams });
  } catch (error) {
    console.error('Get teams error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
