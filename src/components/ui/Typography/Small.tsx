import { cn } from '@/utils/cn';
import { ComponentProps } from 'react';

export function Small({ className, ...rest }: ComponentProps<'small'>) {
  const classNames = cn('text-sm font-medium leading-none', className);
  return <small className={classNames} {...rest}></small>;
}
