import { Button } from '@/components/ui/button';
import { Table } from '@/types';
import Link from 'next/link';

export const ItemsList = ({ items }: { items: Table<'items'>[] }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-baseline">
        <div className="space-y-2">
          <h1 className="mt-1 text-xl font-thin tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Items
          </h1>
          <p className="text-gray-600 text-sm">
            This is an open database. Please be respectful of others.
          </p>
          <p className="text-gray-400 text-xs">
            Items are automatically cleared every 24 hours via a cron job.
          </p>
        </div>
        <div>
          <Link href="/new">
            <Button>New Item</Button>
          </Link>
        </div>
      </div>
      {items.length ? (
        <div className="list-none m-0 divide-y divide-gray-200 bg-white shadow ring-1 ring-black ring-opacity-5">
          {items.map((item) => (
            <Link
              href={`/item/${item.id}`}
              className="px-3 block cursor-pointer pt-4 pb-3 text-left text-sm font-semibold text-gray-900 group hover:bg-blue-600 transition-all duration-200"
              key={item.id}
            >
              <div className="space-y-2">
                <p className="text-blue-600 font-normal text-lg group-hover:text-white">
                  {item.name}
                </p>
                <p className="text-gray-600 font-medium text-sm group-hover:text-white">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No Items</p>
      )}
    </div>
  );
};
