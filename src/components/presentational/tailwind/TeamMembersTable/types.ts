export type TeamMemberRowProps = {
  name?: string;
  role: string;
  avatar_url?: string;
  id: string;
  index: number;
  created_at: string;
};

export type TeamMembersTableProps = {
  members: Array<TeamMemberRowProps>;
  organizationId: string;
};
