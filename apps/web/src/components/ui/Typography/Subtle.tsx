import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

export function Subtle({ className, ...rest }: ComponentProps<'p'>) {
  const classNames = cn('text-sm text-muted-foreground', className);
  return <p className={classNames} {...rest}></p>;
}
