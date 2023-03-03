import { Input } from '@/components/ui/Input';
import { Enum } from '@/types';
import { useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalCancelButton,
  ModalFooter,
  ModalHeader,
  ModalSuccessButton,
} from '../Modal';
import { TeamMemberRoleSelect } from '../TeamMemberRoleSelect';
import H3 from '../Text/H3';

export const InviteTeamMemberModal = ({
  isOpen,
  onClose,
  onInvite,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, memberRole: Enum<'team_member_role'>) => void;
  isLoading: boolean;
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Enum<'team_member_role'>>('readonly');

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>
        <H3>Invite team member</H3>
      </ModalHeader>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onInvite(email, role);
          setEmail('');
        }}
      >
        <ModalBody>
          <div className="space-y-2">
            <p className="text-gray-500 text-sm">
              Invite a team member to your organization.
            </p>
            <Input
              disabled={isLoading}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              required
            />
            <TeamMemberRoleSelect
              value={role}
              onChange={(newRole) => setRole(newRole)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-end space-x-2">
            <ModalCancelButton onClick={onClose} disabled={isLoading}>
              Cancel
            </ModalCancelButton>
            <ModalSuccessButton type="submit" disabled={isLoading}>
              {isLoading ? 'Inviting...' : 'Invite'}
            </ModalSuccessButton>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};
