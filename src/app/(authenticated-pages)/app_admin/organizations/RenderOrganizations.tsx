'use client';
import { View } from '@/types';
import { useGetOrganizationsInfiniteQuery } from '@/utils/react-query-hooks-app-admin';

import moment from 'moment';
import { useState } from 'react';
import { FiMail } from 'react-icons/fi';
import { useDebouncedValue } from 'rooks';

function RenderOrganization({
  organization,
}: {
  organization: View<'app_admin_view_all_organizations'>;
}) {
  return (
    <tr key={organization.id}>
      <td className="whitespace-nowrap pl-4 pr-3 py-4 text-sm text-gray-500">
        {organization.title ?? '-'}
      </td>
      <td className="whitespace-nowrap pl-4 pr-3 py-4 text-sm text-gray-500">
        {moment(organization.created_at).format('DD MMM YYYY')}
      </td>
      <td className="whitespace-nowrap pl-4 pr-3 py-4 text-sm text-gray-500">
        {organization.team_members_count ?? '-'}
      </td>
      <td className="whitespace-nowrap pl-4 pr-3 py-4 text-sm text-gray-500">
        {organization.owner_full_name}
      </td>

      <td className="whitespace-nowrap pl-4 pr-3 py-4 text-sm text-gray-500">
        <span className="flex items-center space-x-2">
          <a
            title="Send email"
            className="text-blue-500 text-sm hover:text-blue-700"
            href={`mailto:${organization.owner_email}`}
            target="_blank"
          >
            <FiMail />
          </a>
        </span>
      </td>
    </tr>
  );
}

export function RenderOrganizations({
  organizationsData,
}: {
  organizationsData: [number, Array<View<'app_admin_view_all_organizations'>>];
}) {
  const [searchText, setSearchText] = useState<string>('');
  const [debouncedSearchText] = useDebouncedValue(searchText, 500);
  const search =
    debouncedSearchText.length > 0 ? debouncedSearchText : undefined;
  // TODO: add pagination support here
  const { data, isFetchingNextPage, isLoading, fetchNextPage, hasNextPage } =
    useGetOrganizationsInfiniteQuery(organizationsData, search);
  if (isLoading || !data) {
    return <div>Loading...</div>;
  }
  const { pages } = data;

  const users2DArray = pages.map((page) => page[1]);
  const organizations = users2DArray.flat();

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="title"
            id="title"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="block px-3 py-2 appearance-none  w-full rounded-md border-gray-300 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Search Organizations"
          />
        </div>
      </div>
      <div className="space-y-4">
        <table className="min-w-full divide-y divide-gray-300 shadow rounded-sm">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="pl-4 pr-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Title
              </th>
              <th
                scope="col"
                className="pl-4 pr-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Created At
              </th>
              <th
                scope="col"
                className="pl-4 pr-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Team Members count
              </th>

              <th
                scope="col"
                className="pl-4 pr-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Owner Name
              </th>
              <th
                scope="col"
                className="pl-4 pr-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {organizations.map((organization) => (
              <RenderOrganization
                key={organization.id}
                organization={organization}
              />
            ))}
          </tbody>
        </table>
        {hasNextPage ? (
          <button
            className="underline text-blue-500 text-sm"
            onClick={() => {
              fetchNextPage();
            }}
            disabled={isLoading || isFetchingNextPage}
          >
            Load More
          </button>
        ) : null}
      </div>
    </div>
  );
}
