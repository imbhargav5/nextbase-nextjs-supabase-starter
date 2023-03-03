'use client';
import { Anchor } from '@/components/Anchor';
import { PageHeading } from '@/components/presentational/tailwind/PageHeading/PageHeading';
import { FiPlus } from 'react-icons/fi';
import moment from 'moment';
import {
  InitialOrganizationListType,
  useOrganizationsList,
} from '@/utils/react-query-hooks';
import { classNames } from '@/utils/classNames';

export function OrganizationList({
  initialOrganizationsList,
}: {
  initialOrganizationsList: InitialOrganizationListType;
}) {
  const { data, isLoading } = useOrganizationsList(initialOrganizationsList);
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <PageHeading
          actions={
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Anchor
                href="/organization-create"
                className={classNames(
                  'flex w-full justify-center rounded border border-transparent py-2 px-4 text-sm font-medium  shadow-sm focus:outline-none focus:ring-2  focus:ring-offset-2',
                  'bg-blue-500 focus:ring-blue-500 hover:bg-blue-600  text-white'
                )}
              >
                <FiPlus className="text-lg" />
                <span>Create Organization</span>
              </Anchor>
            </div>
          }
          title="Organizations"
        />
        <p className="text-gray-500 text-sm max-w-xl">
          Organizations are where all the work happens. Every organization has a
          team and has it's own Stripe plan. You can add more database models to
          your projects to suit your usecase. You can also modify the backend
          and add spaces within an organization and add members to the space if
          you like.
        </p>
      </div>
      <table className="w-full divide-y divide-gray-300 shadow rounded-sm">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              #
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Title
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Members
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Created At
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Owner
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Plan
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data?.map((organization, index) => {
            const teamMembers = Array.isArray(
              organization.organization_team_members
            )
              ? organization.organization_team_members
              : [];
            const teamMembersCount = teamMembers.length;
            const owner = teamMembers.find(
              (member) => member.member_role === 'owner'
            );
            const ownerUserProfile = Array.isArray(owner?.user_profiles)
              ? owner?.user_profiles[0]
              : owner.user_profiles;

            const subscription = Array.isArray(organization.subscriptions)
              ? organization.subscriptions[0]
              : organization.subscriptions;

            const price = Array.isArray(subscription?.prices)
              ? subscription?.prices[0]
              : subscription?.prices;

            const product = Array.isArray(price?.products)
              ? price?.products[0]
              : price?.products;

            const planName = product?.name;

            return (
              <tr key={organization.id} className="text-sm">
                <td className="px-6 py-4 whitespace-nowrap ">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap ">
                  <Anchor
                    className=" text-blue-700 hover:text-blue-500  underline"
                    key={organization.id}
                    href={`/organization/${organization.id}`}
                  >
                    {organization.title}
                  </Anchor>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <div className="text-sm text-gray-900">
                    {teamMembersCount} members
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {moment(organization.created_at).fromNow()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {ownerUserProfile.full_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 capitalize">
                    {planName}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
