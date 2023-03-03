import {
  AWS_BUCKET_OUTPUT_VIDEOS,
  MAX_FILE_DOWNLOAD_LINK_EXPIRY_TIME_SECS,
} from '@/constants';
import { AppSupabaseClient } from '@/types';
import { withUserLoggedInApi } from '@/utils/api-routes/wrappers/withUserLoggedInApi';
import { generateS3FileDownloadLink } from '@/utils/s3';
import { Session } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

async function VideoDownloadHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  supabaseClient: AppSupabaseClient
) {
  try {
    if (req.method === 'GET') {
      const { runUUID } = req.query;
      const runDataResponse = await supabaseClient
        .from('runs')
        .select('*')
        .eq('uuid', runUUID)
        .single();

      if (runDataResponse.error) {
        throw runDataResponse.error;
      }

      const runData = runDataResponse.data;
      if (!runData) {
        throw new Error('Run not found.');
      }

      const videoUrl = await generateS3FileDownloadLink(
        AWS_BUCKET_OUTPUT_VIDEOS,
        runData.file_key,
        MAX_FILE_DOWNLOAD_LINK_EXPIRY_TIME_SECS
      );
      res.redirect(videoUrl);
    } else {
      throw new Error('Method not allowed.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

export default withUserLoggedInApi(VideoDownloadHandler);
