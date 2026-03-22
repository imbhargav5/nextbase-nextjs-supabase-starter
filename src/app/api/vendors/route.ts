import { createServerSupabaseClient } from '@/supabase-clients/server';
import { sanitizeInput, checkRateLimit } from '@/lib/security';

export async function GET(request: Request) {
  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const isRateLimited = await checkRateLimit(`vendors-list:${clientIp}`);
    
    if (!isRateLimited) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const url = new URL(request.url);
    const category = url.searchParams.get('category') || '';
    const search = url.searchParams.get('q') || '';

    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query = supabase
      .from('external_orgs')
      .select(`
        *,
        _count:vendor_engagements (
          count
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: vendors, error } = await query;

    if (error) {
      console.error('Get vendors error:', error);
      return Response.json({ error: 'Failed to fetch vendors' }, { status: 500 });
    }

    return Response.json({ vendors });
  } catch (error) {
    console.error('Get vendors error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const isRateLimited = await checkRateLimit(`vendors-create:${clientIp}`);
    
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
    if (!body.name || !body.category) {
      return Response.json({ error: 'Name and category are required' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(body.name).trim(),
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      description: body.description ? sanitizeInput(body.description).trim() : null,
      category: body.category,
      sub_categories: body.sub_categories || [],
      website: body.website || null,
      email: body.email || null,
      phone: body.phone || null,
      location: body.location || null,
      country: body.country || null,
      logo_url: body.logo_url || null,
      banner_url: body.banner_url || null,
      is_verified: false,
      is_public: body.is_public !== false,
      tags: body.tags || [],
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: org, error: insertError } = await supabase
      .from('external_orgs')
      .insert([sanitizedData])
      .select()
      .single();

    if (insertError) {
      console.error('Create vendor org error:', insertError);
      return Response.json({ error: 'Failed to create vendor organization' }, { status: 500 });
    }

    // Add user as primary contact
    const { error: contactError } = await supabase
      .from('external_org_contacts')
      .insert({
        org_id: org.id,
        user_id: user.id,
        role: 'Account Manager',
        is_primary: true,
        added_at: new Date().toISOString()
      });

    if (contactError) {
      console.error('Create vendor contact error:', contactError);
      // Don't fail the whole request, just log the error
    }

    return Response.json({ org }, { status: 201 });
  } catch (error) {
    console.error('Create vendor error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}