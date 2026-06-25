import { z } from 'zod';

export const ingestPayloadSchema = z.object({
  projectKey: z.string().min(1).max(120),
  type: z.enum(['bug', 'idea', 'question']),
  description: z.string().min(1).max(5000),
  reporterName: z.string().max(120).nullable().optional(),
  reporterEmail: z.string().email().max(200).nullable().optional(),
  pageUrl: z.string().url().max(2000),
  browser: z.string().max(60),
  os: z.string().max(60),
  screenSize: z.string().max(20),
});

export type IngestPayload = z.infer<typeof ingestPayloadSchema>;
