import { createServiceRoleClient } from '@/supabase-clients/service-role';
import { corsHeaders } from '@/utils/widget/cors';
import { isOriginAllowed } from '@/utils/widget/domain-match';
import { ingestPayloadSchema } from '@/utils/zod-schemas/ingest';
import { type NextRequest, NextResponse } from 'next/server';

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get('origin')),
  });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON', code: 'invalid_json' },
      { status: 400, headers }
    );
  }

  const parsed = ingestPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', code: 'invalid_payload' },
      { status: 422, headers }
    );
  }
  const payload = parsed.data;

  const supabase = createServiceRoleClient();

  const { data: project } = await supabase
    .from('projects')
    .select('id, workspace_id, is_active, allowed_domains')
    .eq('public_key', payload.projectKey)
    .maybeSingle();

  if (!project || !project.is_active) {
    return NextResponse.json(
      { error: 'Invalid project key', code: 'invalid_key' },
      { status: 401, headers }
    );
  }

  if (!isOriginAllowed(origin, project.allowed_domains)) {
    return NextResponse.json(
      { error: 'Origin not allowed', code: 'origin_not_allowed' },
      { status: 403, headers }
    );
  }

  const { data: report, error: insertError } = await supabase
    .from('feedback_reports')
    .insert({
      project_id: project.id,
      workspace_id: project.workspace_id,
      type: payload.type,
      description: payload.description,
      reporter_name: payload.reporterName ?? null,
      reporter_email: payload.reporterEmail ?? null,
      page_url: payload.pageUrl,
      browser: payload.browser,
      os: payload.os,
      screen_size: payload.screenSize,
    })
    .select('id')
    .single();

  if (insertError || !report) {
    return NextResponse.json(
      { error: 'Could not save report', code: 'insert_failed' },
      { status: 500, headers }
    );
  }

  const path = `${project.workspace_id}/${report.id}.png`;
  await supabase
    .from('feedback_reports')
    .update({ screenshot_path: path })
    .eq('id', report.id);

  const { data: signed, error: signError } = await supabase.storage
    .from('screenshots')
    .createSignedUploadUrl(path);

  if (signError || !signed) {
    return NextResponse.json(
      { error: 'Could not create upload URL', code: 'sign_failed' },
      { status: 500, headers }
    );
  }

  return NextResponse.json(
    { reportId: report.id, uploadUrl: signed.signedUrl },
    { headers }
  );
}
