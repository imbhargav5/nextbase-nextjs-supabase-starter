'use client';
import { Anchor } from '@/components/Anchor';
import { LoadingSpinner } from '@/components/presentational/tailwind/LoadingSpinner';
import { PageHeading } from '@/components/presentational/tailwind/PageHeading/PageHeading';
import Overline from '@/components/presentational/tailwind/Text/Overline';
import { classNames } from '@/utils/classNames';
import {
  OrganizationByIdData,
  useGetOrganizationById,
} from '@/utils/react-query-hooks';
import moment from 'moment';
import { notFound, usePathname } from 'next/navigation';
import { match } from 'path-to-regexp';
import { ReactNode } from 'react';
import { FiArrowLeft, FiSettings } from 'react-icons/fi';
import { useOrganizationIdLayoutContext } from '../OrganizationIdLayoutContext';
const matchSettingsPath = match('/organization/:organizationId/settings/(.*)?');

export function OrganizationClientLayout({
  children,
  initialOrganizationByIdData,
}: {
  children: ReactNode;
  initialOrganizationByIdData: OrganizationByIdData;
}) {
  const pathname = usePathname();
  const isSettingsPath = matchSettingsPath(pathname ?? '');
  const { organizationId } = useOrganizationIdLayoutContext();
  const { data, isLoading, error } = useGetOrganizationById(
    organizationId,
    initialOrganizationByIdData
  );

  if (error) return notFound();

  if (isLoading || !data)
    return (
      <div>
        <LoadingSpinner className="text-blue-500" />
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="space-y-0">
        <div>
          {isSettingsPath ? (
            <Anchor
              href={`/organization/${organizationId}`}
              className="text-blue-800 space-x-2 flex items-center"
            >
              <FiArrowLeft className="relative -top-0.5" />
              <Overline className="text-blue-800">
                Back to Organization
              </Overline>
            </Anchor>
          ) : (
            <Overline className="text-blue-800">Organization</Overline>
          )}
        </div>
        <PageHeading
          title={data?.title}
          titleHref={`/organization/${organizationId}`}
          actions={
            <div className="flex flex-col items-end space-y-1">
              <Anchor
                href={`/organization/${organizationId}/settings`}
                className={classNames(
                  'flex space-x-1 items-center w-full justify-center rounded border border-transparent py-2 px-4 text-sm font-medium  shadow-sm focus:outline-none focus:ring-2  focus:ring-offset-2',
                  'bg-blue-500 focus:ring-blue-500 hover:bg-blue-600  text-white'
                )}
              >
                <FiSettings />
                <span className="text-xs">View Organization Settings</span>
              </Anchor>
              <span className="text-xs text-gray-500">
                Created {moment(data.created_at).fromNow()}
              </span>
            </div>
          }
        />
      </div>
      <div>{children}</div>
    </div>
  );
}
