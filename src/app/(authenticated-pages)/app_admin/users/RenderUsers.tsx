'use client';
import { View } from '@/types';
import {
  useFetchUserImpersonationUrl,
  useGetUsersInfiniteQuery,
} from '@/utils/react-query-hooks-app-admin';

import moment from 'moment';
import { useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { useDebouncedValue } from 'rooks';

function RenderUser({ user }: { user: View<'app_admin_view_all_users'> }) {
  const { mutate, isLoading } = useFetchUserImpersonationUrl();

  return (
    <tr key={user.id}>
      <td className="whitespace-nowrap pl-4 pr-3 py-4 text-sm text-gray-500">
        {user.full_name ?? '-'}
      </td>
      <td className="whitespace-nowrap pl-4 pr-3 py-4 text-sm text-gray-500">
        {user.email}
      </td>
      <td className="whitespace-nowrap pl-4 pr-3 py-4 text-sm text-gray-500">
        {user.is_app_admin ? '✅' : '❌'}
      </td>
      <td className="whitespace-nowrap pl-4 pr-3 py-4 text-sm text-gray-500">
        {moment(user.created_at).format('DD MMM YYYY')}
      </td>
      <td className="whitespace-nowrap pl-4 pr-3 py-4 text-xs text-gray-500">
        {user.is_confirmed ? '✅' : '❌'}
      </td>
      <td className="whitespace-nowrap pl-4 pr-3 py-4 text-sm text-gray-500">
        <span className="flex items-center space-x-4">
          <a
            title="Send email"
            className=" text-xs flex items-center space-x-1 "
            href={`mailto:${user.email}`}
            target="_blank"
          >
            <FiMail /> <span>Send Email</span>
          </a>
        </span>
      </td>
      <td className="whitespace-nowrap pl-4 pr-3 py-4 text-sm text-gray-500">
        {user.is_app_admin ? null : (
          <button
            title="Impersonate User"
            className="inline-flex text-xs items-center space-x-1 rounded  text-blue-500
            hover:text-blue-700"
            onClick={() => {
              mutate(user.id);
            }}
            disabled={isLoading}
          >
            <FiLogIn /> <span>Login as User </span>
          </button>
        )}
      </td>
    </tr>
  );
}

export function RenderUsers({
  userData,
}: {
  userData: [number, Array<View<'app_admin_view_all_users'>>];
}) {
  const [searchText, setSearchText] = useState<string>('');
  const [debouncedSearchText] = useDebouncedValue(searchText, 500);
  const search =
    debouncedSearchText.length > 0 ? debouncedSearchText : undefined;
  // TODO: add pagination support here
  const { data, isFetchingNextPage, isLoading, fetchNextPage, hasNextPage } =
    useGetUsersInfiniteQuery(userData, search);
  if (isLoading || !data) {
    return <div>Loading...</div>;
  }
  const { pages } = data;

  const users2DArray = pages.map((page) => page[1]);
  const users = users2DArray.flat();

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <div className="mt-1">
          <input
            type="email"
            name="email"
            id="email"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="block px-3 py-2 appearance-none  w-full rounded-md border-gray-300 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Search users"
          />
        </div>
      </div>
      <div className="space-y-2">
        <table className="min-w-full divide-y divide-gray-300 shadow rounded-sm">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="pl-4 pr-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Full Name
              </th>
              <th
                scope="col"
                className="pl-4 pr-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Email
              </th>
              <th
                scope="col"
                className="pl-4 pr-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Admin
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
                Confirmed
              </th>
              <th
                scope="col"
                className="pl-4 pr-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Contact User
              </th>

              <th
                scope="col"
                className="pl-4 pr-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Debug
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <RenderUser key={user.id} user={user} />
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
