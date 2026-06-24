import type { IngestPayload } from './payload';

export interface WidgetConfig {
  active: boolean;
  theme?: { buttonColor: string; position: 'bottom-right' | 'bottom-left' };
}

export interface IngestResponse {
  reportId: string;
  uploadUrl: string;
}

export async function fetchWidgetConfig(
  origin: string,
  key: string
): Promise<WidgetConfig> {
  const res = await fetch(`${origin}/api/widget-config?key=${encodeURIComponent(key)}`);
  if (!res.ok) return { active: false };
  return (await res.json()) as WidgetConfig;
}

export async function submitReport(
  origin: string,
  payload: IngestPayload
): Promise<IngestResponse> {
  const res = await fetch(`${origin}/api/ingest`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Ingest failed (${res.status})`);
  }
  return (await res.json()) as IngestResponse;
}

export async function uploadScreenshot(uploadUrl: string, blob: Blob): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'content-type': blob.type || 'image/png' },
    body: blob,
  });
  if (!res.ok) {
    throw new Error(`Screenshot upload failed (${res.status})`);
  }
}
