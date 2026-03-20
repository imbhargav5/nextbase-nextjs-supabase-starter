import { userSearchSchema } from '@/lib/validations/profile.schema';
import { createServerSupabaseClient } from '@/supabase-clients/server';
import { sanitizeInput, checkRateLimit } from '@/lib/security';

export async function GET(request: Request) {
  try {
    // Rate limiting check
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const isRateLimited = await checkRateLimit(`user-search:${clientIp}`);
    
    if (!isRateLimited) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = userSearchSchema.safeParse(Object.fromEntries(searchParams));

    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { q, skills, location, limit, offset } = parsed.data;
    
    // Sanitize inputs
    const sanitizedQ = q ? sanitizeInput(q) : undefined;
    const sanitizedLocation = location ? sanitizeInput(location) : undefined;
    const sanitizedSkills = skills && Array.isArray(skills) 
      ? skills.map(skill => sanitizeInput(skill)) 
      : undefined;
    
    // Input validation
    if (sanitizedQ && sanitizedQ.length > 100) {
      return Response.json({ error: 'Search query too long' }, { status: 400 });
    }
    
    if (sanitizedLocation && sanitizedLocation.length > 100) {
      return Response.json({ error: 'Location query too long' }, { status: 400 });
    }

    // Validate and sanitize pagination parameters
    const safeLimit = Math.min(Math.max(Number(limit || 20), 1), 100);
    const safeOffset = Math.max(Number(offset || 0), 0);

    // For now, return mock users since profiles table doesn't exist in database types
    // This would be implemented once the proper profiles table is created
    const mockUsers = [
      {
        id: 'user-1',
        display_name: 'John Doe',
        username: 'johndoe',
        headline: 'Software Developer',
        location: 'San Francisco, CA',
        skills: ['JavaScript', 'TypeScript', 'React'],
        avatar_url: null,
        created_at: new Date().toISOString()
      },
      {
        id: 'user-2',
        display_name: 'Jane Smith',
        username: 'janesmith',
        headline: 'UX Designer',
        location: 'New York, NY',
        skills: ['Figma', 'Sketch', 'User Research'],
        avatar_url: null,
        created_at: new Date().toISOString()
      }
    ];

    // Apply basic filtering to mock data
    let filteredUsers = mockUsers;
    
    if (sanitizedQ) {
      filteredUsers = filteredUsers.filter(user => 
        user.display_name.toLowerCase().includes(sanitizedQ.toLowerCase()) ||
        user.username.toLowerCase().includes(sanitizedQ.toLowerCase())
      );
    }

    if (sanitizedSkills && sanitizedSkills.length > 0) {
      filteredUsers = filteredUsers.filter(user => 
        user.skills.some(skill => sanitizedSkills.includes(skill))
      );
    }

    if (sanitizedLocation) {
      filteredUsers = filteredUsers.filter(user => 
        user.location.toLowerCase().includes(sanitizedLocation.toLowerCase())
      );
    }

    // Exclude current user
    filteredUsers = filteredUsers.filter(user => user.id !== user.id);

    // Apply pagination
    const total = filteredUsers.length;
    const paginatedUsers = filteredUsers.slice(safeOffset, safeOffset + safeLimit);

    return Response.json({ 
      users: paginatedUsers,
      total,
      limit: safeLimit,
      offset: safeOffset
    });
  } catch (error) {
    console.error('User search error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
