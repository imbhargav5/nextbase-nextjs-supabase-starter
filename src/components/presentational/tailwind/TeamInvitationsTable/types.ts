import { Enum, Table } from '@/types';

export type TeamInvitationRowProps = {
  email: string;
  status: Table<'organization_team_invitations'>['status'];
  created_at: string;
  id: string;
  index: number;
  role: Enum<'team_member_role'>;
};

export type TeamInvitationsTableProps = {
  invitations: Array<TeamInvitationRowProps>;
  organizationId: string;
};
