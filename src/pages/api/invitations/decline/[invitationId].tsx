// decline invitation

import { withUserLoggedInApi } from '@/utils/api-routes/wrappers/withUserLoggedInApi';
import { AppSupabaseClient } from '@/types';
import { Session, User } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { errors } from '@/utils/errors';

async function DeclineInvitationHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  supabaseClient: AppSupabaseClient,
  session: Session,
  user: User
) {
  const { invitationId } = req.query;

  if (typeof invitationId === 'string') {
    const invitationResponse = await supabaseClient
      .from('organization_team_invitations')
      .update({
        status: 'finished_declined',
        invitee_user_id: user.id, // Add this information here, so that our database function can add this id to the team members table
      })
      .eq('id', invitationId)
      .select('*')
      .single();

    if (invitationResponse.error) {
      errors.add(invitationResponse.error);
      res.status(400).json({ error: 'Access denied.' });
      return;
    } else {
      res.redirect('/dashboard');
    }
  } else {
    res.status(400).json({ error: 'Invalid invitation ID' });
  }
}

export default withUserLoggedInApi(DeclineInvitationHandler);
