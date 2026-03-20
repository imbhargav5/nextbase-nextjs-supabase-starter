import { profileUpdateSchema } from '@/lib/validations/profile.schema';
import { createServerSupabaseClient } from '@/supabase-clients/server';

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, display_name, username, bio, headline, location, skills, avatar_url, banner_url, is_public, created_at, updated_at')
      .eq('id', user.id)
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ user: profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      ...parsed.data,
      display_name: parsed.data.display_name.trim(),
      username: parsed.data.username.toLowerCase().trim(),
      bio: parsed.data.bio?.trim(),
      headline: parsed.data.headline?.trim(),
      location: parsed.data.location?.trim(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(sanitizedData)
      .eq('id', user.id)
      .select('id, display_name, username, bio, headline, location, skills, avatar_url, banner_url, is_public, updated_at')
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ user: data });
  } catch (error) {
    console.error('Update profile error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
