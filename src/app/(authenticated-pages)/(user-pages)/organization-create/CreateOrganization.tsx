'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useCreateOrganizationMutation } from '@/utils/react-query-hooks';
import { Button } from '@/components/presentational/tailwind/Button';

export function CreateOrganization() {
  const [organizationTitle, setOrganizationTitle] = useState<string>('');
  const router = useRouter();
  const { mutate, isLoading } = useCreateOrganizationMutation({
    onSuccess: (organization) => {
      router.push(`/organization/${organization.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setOrganizationTitle('');
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(organizationTitle);
  };
  return (
    <div className="flex-1 bg-[#fdfdfd]">
      <div className="mb-4 my-2 max-w-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Organization Name
            </label>
            <input
              disabled={isLoading}
              value={organizationTitle}
              onChange={(event) => {
                setOrganizationTitle(event.target.value);
              }}
              required
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
              id="name"
              type="text"
              placeholder="Organization Name"
            />
          </div>

          <div className="flex items-center justify-between">
            <Button
              withMaintenanceMode
              disabled={isLoading}
              className="select-none inline-flex items-center rounded-md border-2 border-blue-500 text-blue-600 px-2 py-1 text-xs font-medium bg-white shadow-sm hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 space-x-1"
              type="submit"
              id="create-organization-button"
            >
              {isLoading ? 'Creating...' : 'Create Organization'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
