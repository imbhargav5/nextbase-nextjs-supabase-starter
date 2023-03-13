import { AppSupabaseClient } from '@/types';
import { withSupabase } from '@/utils/api-routes/wrappers/withSupabase';
import { Session, User } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

async function logoutHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  supabaseClient: AppSupabaseClient,
  session: Session | null,
  user: User | null
) {
  if (!session || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  await supabaseClient.auth.signOut();
  res.status(200).redirect('/');
}
export default withSupabase(logoutHandler);
