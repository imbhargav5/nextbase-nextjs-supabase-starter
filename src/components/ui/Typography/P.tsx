import { cn } from '@/utils/cn';
import { ComponentProps } from 'react';

export function P({ className, ...rest }: ComponentProps<'p'>) {
  const classNames = cn('leading-7', '&:not(:first-child):mt-6', className);
  return <p className={classNames} {...rest}></p>;
}
