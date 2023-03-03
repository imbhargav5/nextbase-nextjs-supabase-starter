// nextjs api handler to accept a team invitation

import { withUserLoggedInApi } from '@/utils/api-routes/wrappers/withUserLoggedInApi';
import { AppSupabaseClient } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { errors } from '@/utils/errors';

async function ResetSubtitleHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  supabaseClient: AppSupabaseClient
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }
  const { runUUID } = req.query;
  try {
    const getSubtitleResponse = await supabaseClient
      .from('subtitles')
      .select('*')
      .eq('run_uuid', runUUID)
      .single();

    if (getSubtitleResponse.error) {
      errors.add(getSubtitleResponse.error);
      throw getSubtitleResponse.error;
    }

    const subtitleResponse = await supabaseClient
      .from('subtitles')
      .update({
        modified: getSubtitleResponse.data.original,
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

export default withUserLoggedInApi(ResetSubtitleHandler);
