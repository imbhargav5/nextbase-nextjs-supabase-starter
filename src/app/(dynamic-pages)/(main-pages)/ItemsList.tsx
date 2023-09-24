'use client';
import { Button } from '@/components/ui/button';
import { Table } from '@/types';
import Link from 'next/link';

export const ItemsList = ({ items }: { items: Table<'items'>[] }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-baseline">
        <div className="space-y-2">
          <h1 className="mt-1 text-2xl font-bold tracking-tight  sm:text-4xl lg:text-5xl">
            Items
          </h1>
          <p className="text-gray-600 text-sm italic">
            This is an open database. Please be respectful of others.
          </p>
          <p className="text-gray-300 text-xs italic">
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
        <div className="list-none space-y-2 m-0 pb-3 divide-y   border shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          {items.map((item) => (
            <Link
              href={`/item/${item.id}`}
              className="px-3 block cursor-pointer pt-4 pb-3 text-left text-sm font-semibold  text-gray-900"
              key={item.id}
            >
              <div className="space-y-2">
                <p className="text-blue-600 text-lg">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.description}</p>
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
