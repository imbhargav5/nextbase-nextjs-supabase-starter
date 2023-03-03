import { Anchor } from '@/components/Anchor';
import { usePathname } from 'next/navigation';
import { TabProps } from './types';

export const Tab = ({ label, href, icon }: TabProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const baseClassNames =
    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2';
  const modifierClasses = isActive
    ? 'border-blue-500 text-blue-600'
    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  const className = `${baseClassNames} ${modifierClasses}`;
  return (
    <Anchor href={href} className={className}>
      {icon} <span>{label}</span>
    </Anchor>
  );
};
