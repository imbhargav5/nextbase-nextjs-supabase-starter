import { Database } from '@/lib/database.types';
import {
  createServerSupabaseClient,
  Session,
  User,
} from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { enableCors } from '../enable-cors';

/**
 * This is a wrapper for API routes that require a user to be logged in.
 * It also provides the supabase client , the session and the user object to the wrapped function.
 */
export const withUserLoggedInApi = (
  cb: (
    req: NextApiRequest,
    res: NextApiResponse,
    supabaseClient: ReturnType<typeof createServerSupabaseClient<Database>>,
    session: Session,
    user: User
  ) => void
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const supabaseClient = createServerSupabaseClient<Database>({
      req,
      res,
    });
    enableCors(req, res);

    // return ok if options request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    if (!session || !session.user) {
      return res.status(401).json({
        error: 'not_authenticated',
        description:
          'The user does not have an active session or is not authenticated',
      });
    }

    return cb(req, res, supabaseClient, session, session.user);
  };
};
