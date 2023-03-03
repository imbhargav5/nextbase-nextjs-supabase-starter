import { Button } from '@react-email/button';
import { Html } from '@react-email/html';
import { Section } from '@react-email/section';
import { Column } from '@react-email/column';
import * as React from 'react';
import { Text } from '@react-email/text';

type TeamInvitationEmailProps = {
  acceptInvitationUrl: string;
  declineInvitationUrl: string;
  organizationName: string;
  inviterName: string;
};

/**
 * This email is sent to a user when they are invited to join a team.
 */
export default function TeamInvitationEmail(props: TeamInvitationEmailProps) {
  return (
    <Html>
      <Text>
        Hello,
        {props.inviterName} has invited you to join the team{' '}
        {props.organizationName}.
      </Text>
      <Section>
        <Column>
          <Button
            href={props.acceptInvitationUrl}
            pX={20}
            pY={12}
            style={{ background: '#00f', color: '#fff', borderRadius: '6px' }}
          >
            Accept Invitation
          </Button>
        </Column>
        <Column>
          <Button
            pX={20}
            pY={12}
            href={props.declineInvitationUrl}
            style={{ background: '#00f', color: '#fff', borderRadius: '6px' }}
          >
            Reject Invitation
          </Button>
        </Column>
      </Section>
    </Html>
  );
}
