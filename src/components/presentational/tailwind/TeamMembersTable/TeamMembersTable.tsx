import { TeamMembersTableProps } from './types';

export const TeamMembersTable = ({ members }: TeamMembersTableProps) => {
  return (
    <table className="w-full divide-y divide-gray-300 shadow rounded-sm">
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
            Name
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
            Joined On
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {members.map((member, index) => {
          return (
            <tr key={member.id} className="text-sm">
              <td className="px-6 py-4 whitespace-nowrap ">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap ">{member.name}</td>
              <td className="px-6 py-4 whitespace-nowrap capitalize">
                {member.role}
              </td>
              <td className="px-6 py-4 whitespace-nowrap ">
                {member.created_at}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
