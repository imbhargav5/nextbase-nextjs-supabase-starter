import { TeamInvitationsTableProps } from './types';

export const TeamInvitationsTable = ({
  invitations,
}: TeamInvitationsTableProps) => {
  return (
    <table className="w-full divide-y divide-gray-300 shadow rounded-sm max-w-4xl">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {' '}
            #{' '}
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Email
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Role
          </th>

          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Sent On
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Status
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {invitations.map((invitation, index) => {
          return (
            <tr key={invitation.id} className="text-sm">
              <td className="px-6 py-4 whitespace-nowrap ">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap ">
                {invitation.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap capitalize">
                {invitation.role}
              </td>
              <td className="px-6 py-4 whitespace-nowrap ">
                {invitation.created_at}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap uppercase italic font-bold`}
              >
                <span>
                  {invitation.status === 'active'
                    ? 'pending'
                    : invitation.status}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
