import { Button } from '@/components/ui/button';
import { Table } from '@/types';
import Link from 'next/link';

export const PrivateItemsList = ({
  privateItems,
}: {
  privateItems: Table<'private_items'>[];
}) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-baseline">
        <div className="space-y-2">
          <h1 className="mt-1 text-2xl font-bold tracking-tight  sm:text-4xl lg:text-5xl">
            Private Items
          </h1>
          <p className="text-gray-600 text-sm italic">
            These items can only be created by logged in users.
          </p>
        </div>
        <div>
          <Link href="/dashboard">
            <Button>New Private Item</Button>
          </Link>
        </div>
      </div>
      {privateItems.length ? (
        <div className="list-none space-y-2 m-0 pb-3 divide-y  border shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          {privateItems.map((privateItem) => (
            <Link
              href={`/private-item/${privateItem.id}`}
              className="px-3 block cursor-pointer pt-4 pb-3 text-left text-sm font-semibold text-gray-900"
              key={privateItem.id}
            >
              <div className="space-y-2">
                <p className="text-blue-600 text-lg">{privateItem.name}</p>
                <p className="text-gray-600 text-sm">
                  {privateItem.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No Private Items</p>
      )}
    </div>
  );
};
