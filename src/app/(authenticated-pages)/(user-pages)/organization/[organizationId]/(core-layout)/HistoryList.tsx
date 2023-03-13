'use client';
import { Anchor } from '@/components/Anchor';
import { T } from '@/components/ui/Typography';
import { Table } from '@/types';
import { cn } from '@/utils/cn';
import {
  convertSecondsToVideoTime,
  normalizeS3FileName,
} from '@/utils/helpers';
import { useGetRuns, useSyncRuns } from '@/utils/react-query-hooks';
import { cva } from 'class-variance-authority';
import { useOrganizationIdLayoutContext } from '../../OrganizationIdLayoutContext';

const statusLabelVariants = cva('whitespace-nowrap p-1 rounded-lg', {
  variants: {
    variant: {
      default: 'text-gray-500',
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export default function Rows({ runs }: { runs: Table<'runs'>[] }) {
  const { organizationId } = useOrganizationIdLayoutContext();

  return (
    <div className="bg-gray-100 py-10">
      <div className="px-4  sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <T.H2>History</T.H2>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the translations your organization has requested.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none"></div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Length
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {runs.map((run) => {
                      const statusVariant =
                        run.status === 'SUCCESS'
                          ? 'success'
                          : run.status === 'ERROR'
                            ? 'error'
                            : 'pending';

                      return (
                        <tr key={run.uuid}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {normalizeS3FileName(run.file_key)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {convertSecondsToVideoTime(run.duration_in_secs)}
                          </td>
                          <td className={'whitespace-nowrap px-3 py-4 text-sm'}>
                            <span
                              className={cn(
                                statusLabelVariants({
                                  variant: statusVariant,
                                })
                              )}
                            >
                              {' '}
                              {run.status}{' '}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {run.created_at}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            {run.status === 'SUCCESS' ? (
                              <Anchor
                                className="text-blue-500"
                                href={`/organization/${organizationId}/subtitles/${run.uuid}/edit`}
                              >
                                Edit
                              </Anchor>
                            ) : run.status === 'PENDING' ? (
                              <span className="text-xs text-gray-400">
                                Processing...
                              </span>
                            ) : (
                              ''
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const HistoryList = ({
  initialRuns,
}: {
  initialRuns: Table<'runs'>[];
}) => {
  const { organizationId } = useOrganizationIdLayoutContext();
  const {
    data: runs,
    isLoading,
    error,
  } = useGetRuns(organizationId, initialRuns);

  useSyncRuns(organizationId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }

  if (!runs) {
    return <div>Error: No data</div>;
  }

  return <Rows runs={runs} />;
};
