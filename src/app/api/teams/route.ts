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

    // For now, return a mock response since teams table doesn't exist in database types
    // This would be implemented once the proper teams table is created
    return Response.json({ 
      team: {
        id: 'mock-team-id',
        name: sanitizedData.name,
        description: sanitizedData.description,
        is_public: sanitizedData.is_public,
        owner_id: user.id,
        created_at: sanitizedData.created_at,
        updated_at: sanitizedData.updated_at
      }
    }, { status: 201 });
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

    // For now, return mock teams since teams table doesn't exist in database types
    // This would be implemented once the proper teams table is created
    return Response.json({ 
      teams: [
        {
          id: 'mock-team-1',
          name: 'Demo Team',
          description: 'A demo team for testing',
          is_public: true,
          owner_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    });
  } catch (error) {
    console.error('Get teams error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
