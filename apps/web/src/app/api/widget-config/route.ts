import { createServiceRoleClient } from '@/supabase-clients/service-role';
import { type NextRequest, NextResponse } from 'next/server';
import { buildWidgetConfig } from './config';

// Config is non-sensitive, so we allow any origin to read it.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!key) {
    return NextResponse.json(
      { active: false },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('projects')
    .select('id, is_active')
    .eq('public_key', key)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { active: false },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  return NextResponse.json(buildWidgetConfig(data), { headers: CORS_HEADERS });
}
