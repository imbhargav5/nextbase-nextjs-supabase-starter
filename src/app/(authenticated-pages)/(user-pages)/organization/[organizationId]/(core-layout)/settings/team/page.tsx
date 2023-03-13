'use client';
import { useOrganizationIdLayoutContext } from '../../../../OrganizationIdLayoutContext';
import moment from 'moment';
import { useState } from 'react';
import { LoadingSpinner } from '@/components/presentational/tailwind/LoadingSpinner';
import H3 from '@/components/presentational/tailwind/Text/H3';
import { TeamMembersTable } from '@/components/presentational/tailwind/TeamMembersTable';
import { TeamMembersTableProps } from '@/components/presentational/tailwind/TeamMembersTable/types';
import { TeamInvitationsTable } from '@/components/presentational/tailwind/TeamInvitationsTable';
import { TeamInvitationsTableProps } from '@/components/presentational/tailwind/TeamInvitationsTable/types';
import { FiPlus } from 'react-icons/fi';
import { InviteTeamMemberModal } from '@/components/presentational/tailwind/InviteTeamMemberModal/InviteTeamMemberModal';
import { toast } from 'react-hot-toast';
import {
  useGetIsOrganizationAdmin,
  useGetTeamInvitationsInOrganization,
  useGetTeamMembersInOrganization,
  useInviteUserMutation,
} from '@/utils/react-query-hooks';
import { Button } from '@/components/presentational/tailwind/Button';
import { classNames } from '@/utils/classNames';

function InviteUser() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { organizationId } = useOrganizationIdLayoutContext();
  const { mutate, isLoading } = useInviteUserMutation(organizationId, {
    onSuccess: () => {
      toast('Invitation sent');
    },
    onSettled: () => {
      setIsModalOpen(false);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(String(error));
      }
    },
  });

  return (
    <>
      <Button
        withMaintenanceMode
        onClick={() => {
          setIsModalOpen(true);
        }}
        className={classNames(
          'flex items-center justify-center rounded border border-transparent py-2 px-4 text-sm font-medium  shadow-sm focus:outline-none focus:ring-2  focus:ring-offset-2',
          'bg-blue-500 focus:ring-blue-500 hover:bg-blue-600  text-white'
        )}
      >
        <FiPlus
          className="text-sm"
          style={{
            position: 'relative',
            top: -1,
          }}
        />
        <span>Invite User</span>
      </Button>
      <InviteTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onInvite={(email, role) => {
          mutate({
            email,
            organizationId: organizationId,
            role,
          });
        }}
        isLoading={isLoading}
      />
    </>
  );
}

function TeamMembers() {
  const { organizationId } = useOrganizationIdLayoutContext();
  const { data, isLoading } = useGetTeamMembersInOrganization(organizationId);
  const { data: isOrganizationAdmin, isLoading: isOrganizationAdminLoading } =
    useGetIsOrganizationAdmin(organizationId);
  if (isLoading || isOrganizationAdminLoading || !data)
    return (
      <div>
        <LoadingSpinner className="text-blue-500" />
      </div>
    );

  const members: TeamMembersTableProps['members'] = data.map(
    (member, index) => {
      const userProfile = Array.isArray(member.user_profiles)
        ? member.user_profiles[0]
        : member.user_profiles;

      if (!userProfile) {
        throw new Error('userProfile is undefined');
      }
      return {
        index: index + 1,
        id: userProfile.id,
        name: userProfile.full_name ?? `User ${userProfile.id}`,
        role: member.member_role,
        created_at: moment(member.created_at).format('DD MMM YYYY'),
      };
    }
  );

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex justify-between items-center">
        <H3>Team Members</H3>
        {isOrganizationAdmin ? <InviteUser /> : null}
      </div>

      <TeamMembersTable members={members} organizationId={organizationId} />
    </div>
  );
}

function TeamInvitations() {
  const { organizationId } = useOrganizationIdLayoutContext();
  const { data, isLoading } =
    useGetTeamInvitationsInOrganization(organizationId);
  if (isLoading || !data)
    return (
      <div>
        <LoadingSpinner className="text-blue-500" />
      </div>
    );

  if (!data.length) {
    return (
      <div className="space-y-4">
        <H3>Team invitations</H3>
        <p className="text-gray-500 text-sm">No pending invitations</p>
      </div>
    );
  }

  const invitations: TeamInvitationsTableProps['invitations'] = data.map(
    (invitation, index) => {
      return {
        index: index + 1,
        id: invitation.id,
        email: invitation.invitee_user_email,
        created_at: moment(invitation.created_at).format('DD MMM YYYY'),
        status: invitation.status,
        role: invitation.invitee_team_role,
      };
    }
  );

  return (
    <div className="space-y-4">
      <H3>Invitations</H3>
      <TeamInvitationsTable
        organizationId={organizationId}
        invitations={invitations}
      />
    </div>
  );
}

export default function OrganizationPage() {
  return (
    <div className="space-y-12">
      <TeamMembers />
      <TeamInvitations />
    </div>
  );
}
