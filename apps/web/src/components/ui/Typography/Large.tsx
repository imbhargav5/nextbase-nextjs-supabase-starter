import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

export function Large({ className, ...rest }: ComponentProps<'div'>) {
  const classNames = cn('text-lg font-semibold text-foreground', className);
  return <div className={classNames} {...rest}></div>;
}
