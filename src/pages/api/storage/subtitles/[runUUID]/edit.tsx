// nextjs api handler to accept a team invitation

import { withUserLoggedInApi } from '@/utils/api-routes/wrappers/withUserLoggedInApi';
import { AppSupabaseClient } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { errors } from '@/utils/errors';
import { z } from 'zod';

const requestBodySchema = z.object({
  subtitle: z.object({
    modified: z.string(),
    original: z.string(),
  }),
});

async function EditSubtitleHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  supabaseClient: AppSupabaseClient
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }
  const { runUUID } = req.query;
  const body = req.body;
  try {
    const { subtitle } = requestBodySchema.parse(body);

    const subtitleResponse = await supabaseClient
      .from('subtitles')
      .update({
        modified: subtitle.modified,
      })
      .eq('run_uuid', runUUID)
      .select('*')
      .single();

    if (subtitleResponse.error) {
      throw subtitleResponse.error;
    }
    return res.json({
      ok: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      errors.add(error);
    } else {
      errors.add(new Error(error));
    }
    throw error;
  }
}

export default withUserLoggedInApi(EditSubtitleHandler);
