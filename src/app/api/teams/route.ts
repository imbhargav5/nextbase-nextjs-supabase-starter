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

    const { data, error } = await supabase
      .from('teams')
      .insert({ ...parsed.data, owner_id: user.id })
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ team: data }, { status: 201 });
  } catch (error) {
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

    // Get teams where user is a member
    const { data, error } = await supabase
      .from('team_members')
      .select('teams(*)')
      .eq('user_id', user.id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    const teams = data?.map(tm => (tm as any).teams) || [];
    return Response.json({ teams });
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
