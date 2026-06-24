import type { ReportMetadata } from './metadata';

export type FeedbackType = 'bug' | 'idea' | 'question';

export interface BuildPayloadInput {
  projectKey: string;
  type: FeedbackType;
  description: string;
  reporterName?: string;
  reporterEmail?: string;
  metadata: ReportMetadata;
}

export interface IngestPayload {
  projectKey: string;
  type: FeedbackType;
  description: string;
  reporterName: string | null;
  reporterEmail: string | null;
  pageUrl: string;
  browser: string;
  os: string;
  screenSize: string;
}

function nullifyBlank(value: string | undefined): string | null {
  const trimmed = (value ?? '').trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function buildIngestPayload(input: BuildPayloadInput): IngestPayload {
  return {
    projectKey: input.projectKey,
    type: input.type,
    description: input.description.trim(),
    reporterName: nullifyBlank(input.reporterName),
    reporterEmail: nullifyBlank(input.reporterEmail),
    pageUrl: input.metadata.pageUrl,
    browser: input.metadata.browser,
    os: input.metadata.os,
    screenSize: input.metadata.screenSize,
  };
}
