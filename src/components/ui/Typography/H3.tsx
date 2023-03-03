import { cn } from '@/utils/cn';
import { ComponentProps } from 'react';

export function H3({ className, ...rest }: ComponentProps<'h3'>) {
  const classNames = cn(
    'mt-8 scroll-m-20 text-2xl font-semibold tracking-tight',
    className
  );
  return <h3 className={classNames} {...rest}></h3>;
}
