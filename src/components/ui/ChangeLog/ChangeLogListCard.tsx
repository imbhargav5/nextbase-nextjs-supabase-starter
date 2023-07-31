import { ReactNode } from 'react';
import { T } from '../Typography';
type ChangeLogListCardProps = {
  date: string;
  title: string;
  children: ReactNode;
};

export default function ChangeLogListCard({
  date,
  title,
  children,
}: ChangeLogListCardProps) {
  return (
    <div
      className="grid grid-cols-2 gap-4 border b-gray-200 rounded-lg px-6 py-4 shadow-sm w-full"
      style={{ gridTemplateColumns: '160px auto' }}
    >
      <p>{date}</p>
      <div>
        <T.H2 className=" border-none text-blue-500">{title}</T.H2>
        {children}
      </div>
    </div>
  );
}
