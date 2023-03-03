// nextjs api handler to accept a team invitation

import { withUserLoggedInApi } from '@/utils/api-routes/wrappers/withUserLoggedInApi';
import { AppSupabaseClient } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { errors } from '@/utils/errors';
import { generateS3FileDownloadLink, getSubtitlesString } from '@/utils/s3';
import {
  getFileExtensionFromName,
  getFilenameWithoutExtension,
} from '@/utils/file';
import {
  AWS_BUCKET_INPUT,
  AWS_BUCKET_INPUT_MP3,
  AWS_BUCKET_OUTPUT_SUBTITLES,
} from '@/constants';

async function GetSubtitleHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  supabaseClient: AppSupabaseClient
) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }
  const { runUUID } = req.query;
  console.log(req.query);
  try {
    const getSubtitleResponse = await supabaseClient
      .from('subtitles')
      .select('*, runs(uuid, file_key)')
      .eq('run_uuid', runUUID)
      .maybeSingle();

    if (getSubtitleResponse.error) {
      errors.add(getSubtitleResponse.error);
      throw getSubtitleResponse.error;
    }

    const subtitle = getSubtitleResponse.data;
    console.log({ subtitle });
    if (subtitle?.original) {
      const run = Array.isArray(subtitle.runs)
        ? subtitle.runs[0]
        : subtitle.runs;
      if (!run) {
        throw new Error('Run not found');
      }
      const videoUrl = await generateS3FileDownloadLink(
        getFileExtensionFromName(run.file_key) === 'mp4'
          ? AWS_BUCKET_INPUT
          : AWS_BUCKET_INPUT_MP3,
        run.file_key,
        60 * 60 * 5,
        true
      );
      return res.status(200).json({
        original: subtitle.original,
        modified: subtitle.modified,
        videoUrl,
      });
    } else {
      const runQuery = await supabaseClient
        .from('runs')
        .select('*')
        .eq('uuid', runUUID)
        .single();

      if (runQuery.error) {
        throw runQuery.error;
      }

      const run = runQuery.data;

      const subtitleText = await getSubtitlesString(
        getFilenameWithoutExtension(run.file_key) + '.json',
        AWS_BUCKET_OUTPUT_SUBTITLES
      );

      const insertSubtitleResponse = await supabaseClient
        .from('subtitles')
        .insert({
          original: subtitleText,
          run_uuid: run.uuid,
        })
        .select('*')
        .single();

      if (insertSubtitleResponse.error) {
        throw insertSubtitleResponse.error;
      }

      const videoUrl = await generateS3FileDownloadLink(
        getFileExtensionFromName(run.file_key) === 'mp4'
          ? AWS_BUCKET_INPUT
          : AWS_BUCKET_INPUT_MP3,
        run.file_key,
        60 * 60 * 5,
        true
      );
      res.status(200).json({
        original: insertSubtitleResponse.data.original,
        modified: insertSubtitleResponse.data.modified,
        videoUrl,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      errors.add(error);
    } else {
      errors.add(new Error(error));
    }
    throw error;
  }
}

export default withUserLoggedInApi(GetSubtitleHandler);
