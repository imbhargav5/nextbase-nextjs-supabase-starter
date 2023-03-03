import { cn } from '@/utils/cn';
import { ComponentProps } from 'react';

export function Large({ className, ...rest }: ComponentProps<'div'>) {
  const classNames = cn(
    'text-lg font-semibold text-slate-900 dark:text-slate-50',
    className
  );
  return <div className={classNames} {...rest}></div>;
}
