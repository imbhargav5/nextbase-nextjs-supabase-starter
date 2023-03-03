import { NextApiRequest, NextApiResponse } from 'next';
import { withUserLoggedInApi } from '@/utils/api-routes/wrappers/withUserLoggedInApi';
import { AppSupabaseClient, Enum } from '@/types';
import { Session, User } from '@supabase/supabase-js';
import { render as renderEmail } from '@react-email/render';
import TeamInvitationEmail from 'emails/TeamInvitation';
import { toSiteURL } from '@/utils/helpers';
import { sendEmail } from '@/utils/api-routes/utils';
import { z } from 'zod';

const payloadSchema = z.object({
  email: z.string().email(),
  organizationId: z.string(),
  // one of 'admin', 'member', 'readonly'
  role: z.enum(['admin', 'member', 'readonly']),
});

type Payload = z.infer<typeof payloadSchema>;

async function createInvitationHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  supabaseClient: AppSupabaseClient,
  _: Session,
  user: User
) {
  const payload = req.body;
  const parsedBody = payloadSchema.parse(payload);
  const { email, organizationId: organizationId } = parsedBody;

  // check if already invited
  const existingInvitationResponse = await supabaseClient
    .from('organization_team_invitations')
    .select('*')
    .eq('invitee_user_email', email)
    .eq('inviter_user_id', user.id)
    .eq('status', 'active')
    .eq('organization_id', organizationId);

  if (existingInvitationResponse.error) {
    res.status(400).json({ error: existingInvitationResponse.error.message });
    return;
  } else if (existingInvitationResponse.data.length > 0) {
    res.status(400).json({ error: 'User already invited' });
    return;
  }

  // check if organization exists
  const organizationResponse = await supabaseClient
    .from('organizations')
    .select('*')
    .eq('id', organizationId)
    .single();

  if (organizationResponse.error) {
    res.status(400).json({ error: organizationResponse.error.message });
    return;
  }

  const invitationResponse = await supabaseClient
    .from('organization_team_invitations')
    .insert({
      invitee_user_email: email,
      inviter_user_id: user.id,
      status: 'active',
      organization_id: organizationId,
      invitee_team_role: parsedBody.role,
    })
    .select('*')
    .single();

  if (invitationResponse.error) {
    res.status(400).json({ error: invitationResponse.error.message });
    return;
  }

  const acceptInvitationUrl = toSiteURL(
    '/api/invitations/accept/' + invitationResponse.data.id
  );
  const declineInvitationUrl = toSiteURL(
    '/api/invitations/decline/' + invitationResponse.data.id
  );

  // send email
  const invitationEmailHTML = renderEmail(
    <TeamInvitationEmail
      acceptInvitationUrl={acceptInvitationUrl}
      declineInvitationUrl={declineInvitationUrl}
      // Use user name if your organization collects Fullnames.
      inviterName={`User ${user.id}`}
      organizationName={organizationResponse.data.title}
    />
  );

  if (process.env.NODE_ENV === 'development') {
    // In development, we log the email to the console instead of sending it.
    console.log({
      acceptInvitationUrl,
      declineInvitationUrl,
    });
  } else {
    await sendEmail({
      to: email,
      subject: `Invitation to join ${organizationResponse.data.title}`,
      html: invitationEmailHTML,
      //TODO: Modify this to your app's admin email
      // Make sure you have verified this email in your Sendgrid (mail provider) account
      from: process.env.ADMIN_EMAIL,
    });
  }

  const invitation = invitationResponse.data;
  res.status(201).json(invitation);
  return;
}

export default withUserLoggedInApi(createInvitationHandler);
