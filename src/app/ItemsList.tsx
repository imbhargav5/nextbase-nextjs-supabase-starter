'use client';
import { Table } from '@/types';
import Link from 'next/link';
import { useItems } from './utils/react-query-hooks';

export const ItemsList = ({
  initialItems,
}: {
  initialItems: Table<'items'>[];
}) => {
  const { data: items } = useItems(initialItems);
  return (
    <div className="space-y-4">
      <h1 className="text-lg text-black">Items</h1>
      <div>
        <Link className="text-white bg-gray-700 rounded px-3 py-2" href="/new">
          New Item
        </Link>
      </div>
      {items.length ? (
        <ul className="list-none space-y-2 m-0 p-0">
          {items.map((item) => (
            <li className="text-gray-500" key={item.id}>
              <Link href={`/item/${item.id}`}>{item.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Items</p>
      )}
    </div>
  );
};
