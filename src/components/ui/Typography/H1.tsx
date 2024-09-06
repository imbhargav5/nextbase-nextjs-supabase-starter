import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

export function H1({ className, ...rest }: ComponentProps<'h1'>) {
  const classNames = cn(
    'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    className
  );
  return <h1 className={classNames} {...rest}></h1>;
}
