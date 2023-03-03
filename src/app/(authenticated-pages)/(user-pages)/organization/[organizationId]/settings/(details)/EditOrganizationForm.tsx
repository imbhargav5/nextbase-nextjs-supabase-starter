'use client';
import { Button } from '@/components/presentational/tailwind/Button';
import H3 from '@/components/presentational/tailwind/Text/H3';
import { classNames } from '@/utils/classNames';
import { useUpdateOrganizationTitleMutation } from '@/utils/react-query-hooks';
import { useState } from 'react';
import { useOrganizationIdLayoutContext } from '../../../OrganizationIdLayoutContext';

export function EditOrganizationForm({
  initialTitle,
}: {
  initialTitle: string;
}) {
  const { organizationId: organizationId } = useOrganizationIdLayoutContext();

  const { mutate, isLoading } = useUpdateOrganizationTitleMutation({
    organizationId,
  });

  const [organizationTitle, setOrganizationTitle] =
    useState<string>(initialTitle);
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <H3>Edit Organization Title</H3>
        <p className="text-sm text-gray-500">
          This is the title that will be displayed on the organization page.
        </p>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          mutate({
            title: organizationTitle,
          });
        }}
        className="space-y-4 max-w-md"
      >
        <input
          value={organizationTitle}
          type="text"
          name="organization-title"
          id="organization-title"
          onChange={(e) => {
            setOrganizationTitle(e.target.value);
          }}
          className="flex-1 shadow text-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <div className="inline-block">
          <Button
            withMaintenanceMode
            disabled={isLoading}
            type="submit"
            id="update-organization-title-button"
            className={classNames(
              'flex w-full justify-center rounded border border-transparent py-2 px-4 text-sm font-medium  shadow-sm focus:outline-none focus:ring-2  focus:ring-offset-2',
              'bg-blue-500 focus:ring-blue-500 hover:bg-blue-600  text-white'
            )}
          >
            {isLoading ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </div>
  );
}
