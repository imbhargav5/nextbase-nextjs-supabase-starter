import { AWS_BUCKET_OUTPUT_SUBTITLES } from '@/constants';
import { AppSupabaseClient } from '@/types';
import { withUserLoggedInApi } from '@/utils/api-routes/wrappers/withUserLoggedInApi';
import { getFilenameWithoutExtension } from '@/utils/helpers';
import { checkIfS3FileExists } from '@/utils/s3';
import { getPendingRuns } from '@/utils/supabase-queries';
import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const querySchema = z.object({
  organizationId: z.string(),
});

async function syncRunsHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  supabaseClient: AppSupabaseClient
) {
  try {
    const { organizationId } = querySchema.parse(req.query);
    const pendingRuns = await getPendingRuns(supabaseClient, organizationId);

    const setSuccessPromises = pendingRuns.map(async (run) => {
      const doesFileExist = await checkIfS3FileExists(
        getFilenameWithoutExtension(run.file_key) + '.json',
        AWS_BUCKET_OUTPUT_SUBTITLES
      );
      if (doesFileExist) {
        await supabaseClient.rpc('set_run_success', {
          arg_uuid: run.uuid,
        });
      } else {
        console.log(`file doesn't exist`);
        const endDate = new Date();
        const startDate = new Date(endDate);
        const eighteenHoursAgo = startDate.setHours(startDate.getHours() - 18);
        const runCreatedMoment = moment(run.created_at);
        const eighteenHoursAgoMoment = moment(eighteenHoursAgo);
        if (runCreatedMoment.isBefore(eighteenHoursAgoMoment)) {
          await supabaseClient.rpc('set_run_error', {
            arg_uuid: run.uuid,
          });
        }
      }
    });

    await Promise.allSettled(setSuccessPromises);
    return res.setHeader('Cache-Control', 'no-store').status(200).json({
      ok: true,
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
}

export default withUserLoggedInApi(syncRunsHandler);
