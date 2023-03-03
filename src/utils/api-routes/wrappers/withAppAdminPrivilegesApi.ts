import { Database as AppDatabase } from '@/lib/database.types';
import {
  createServerSupabaseClient as _createServerSupabaseClient,
  filterCookies,
  ensureArray,
  serializeCookie,
} from '@supabase/auth-helpers-shared';
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { CookieOptions } from '@supabase/auth-helpers-shared';
import { enableCors } from '../enable-cors';
import { getIsAppAdmin } from '@/utils/supabase-queries';

/**
 * Similar to this https://github.com/supabase/auth-helpers/blob/main/packages/nextjs/src/index.ts#L53
 * but with the service role key
 */
/* eslint-disable prettier/prettier */
export function createServiceRoleServerSupabaseClient<
  Database = AppDatabase,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
  ? 'public'
  : string & keyof Database
>(
  context:
    | GetServerSidePropsContext
    | { req: NextApiRequest; res: NextApiResponse },
  {
    cookieOptions,
  }: {
    cookieOptions?: CookieOptions;
  } = {}
) {
  /* eslint-enable prettier/prettier */
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables are required!'
    );
  }

  return _createServerSupabaseClient<Database, SchemaName>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    getRequestHeader: (key) => context.req.headers[key],

    getCookie(name) {
      return context.req.cookies[name];
    },
    setCookie(name, value, options) {
      const newSetCookies = filterCookies(
        ensureArray(context.res.getHeader('set-cookie')?.toString() ?? []),
        name
      );
      const newSessionStr = serializeCookie(name, value, {
        ...options,
        // Allow supabase-js on the client to read the cookie as well
        httpOnly: false,
      });

      context.res.setHeader('set-cookie', [...newSetCookies, newSessionStr]);
    },
    options: {
      global: {
        headers: {},
      },
    },
    cookieOptions,
  });
}

/**
 * @description Ensures that the user is an Application Admin.
 * This is a wrapper around the createServiceRoleServerSupabaseClient
 * that checks if the user is an Application Admin and returns a 401 if not
 * */
export const withAppAdminPrivilegesApi = (
  cb: (
    req: NextApiRequest,
    res: NextApiResponse,
    supabaseClient: ReturnType<typeof _createServerSupabaseClient<AppDatabase>>
  ) => void
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const supabaseClient = createServiceRoleServerSupabaseClient<AppDatabase>({
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

    const isAppAdmin = await getIsAppAdmin(supabaseClient, session.user);

    if (!isAppAdmin) {
      return res.status(401).json({
        error: 'not_allowed',
        description: 'The user is not allowed to perform this action',
      });
    }

    return cb(req, res, supabaseClient);
  };
};
