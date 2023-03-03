// nextjs api handler to accept a team invitation

import { withUserLoggedInApi } from '@/utils/api-routes/wrappers/withUserLoggedInApi';
import { AppSupabaseClient } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { errors } from '@/utils/errors';
import { z } from 'zod';
import {
  AWS_BUCKET_INPUT,
  AWS_BUCKET_INPUT_MP3,
  MAX_VIDEO_LENGTH_SEC,
  MAX_VIDEO_NAME_LENGTH,
} from '@/constants';
import { Session, User } from '@supabase/supabase-js';
import { generateS3FileKey, generateS3SignedPOST } from '@/utils/s3';
import { getFileExtensionFromName } from '@/utils/helpers';

async function VideoS3UrlHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  supabaseClient: AppSupabaseClient,
  _: Session,
  user: User
) {
  try {
    if (req.method === 'PUT') {
      const putSchema = z.object({
        name: z.string().min(3).max(MAX_VIDEO_NAME_LENGTH),
        videoDurationInSeconds: z.number().positive().max(MAX_VIDEO_LENGTH_SEC),
        organizationId: z.string(),
      });
      console.log(req.body);
      const { name, videoDurationInSeconds, organizationId } = putSchema.parse(
        req.body
      );
      const insertResponse = await supabaseClient.from('runs').insert({
        etag: 'n/a',
        file_key: name,
        status: 'PENDING',
        duration_in_secs: Math.ceil(videoDurationInSeconds),
        organization_id: organizationId,
      });

      if (insertResponse.error) {
        errors.add(insertResponse.error);
        throw insertResponse.error;
      }

      const videoDurationInMinutes = Math.ceil(videoDurationInSeconds / 60);

      const decrementCreditsResponse = await supabaseClient.rpc(
        'decrement_credits',
        {
          amount: videoDurationInMinutes,
          org_id: organizationId,
        }
      );

      if (decrementCreditsResponse.error) {
        errors.add(decrementCreditsResponse.error);
        throw decrementCreditsResponse.error;
      }

      return res.json({
        ok: true,
      });
    } else if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed.' });
      return;
    } else {
      const postSchema = z.object({
        name: z.string().min(3).max(MAX_VIDEO_NAME_LENGTH),
        videoDurationInSeconds: z.number().positive().max(MAX_VIDEO_LENGTH_SEC),
        organizationId: z.string(),
      });
      const { name, videoDurationInSeconds, organizationId } = postSchema.parse(
        req.body
      );
      try {
        const getOrgCredits = await supabaseClient
          .from('organization_credits')
          .select('*')
          .eq('organization_id', organizationId)
          .single();
        const videoDurationInMinutes = Math.ceil(videoDurationInSeconds / 60);

        if (getOrgCredits.error) {
          errors.add(getOrgCredits.error);
          throw getOrgCredits.error;
        }

        if (getOrgCredits.data.credits < videoDurationInMinutes) {
          throw new Error(
            `Insufficient credits. This file will require ${videoDurationInMinutes} credits but you have ${getOrgCredits.data.credits} credits.`
          );
        }

        const fileKey = generateS3FileKey(name);
        const data = await generateS3SignedPOST(
          getFileExtensionFromName(name) === 'mp4'
            ? AWS_BUCKET_INPUT
            : AWS_BUCKET_INPUT_MP3,
          fileKey,
          10 * 60,
          true
        );

        return res.json({
          s3UploadUrl: data.url,
          s3FormData: data.fields,
          videoDurationInSeconds: req.body.videoDurationInSeconds,
          fileKey,
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
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}

export default withUserLoggedInApi(VideoS3UrlHandler);
