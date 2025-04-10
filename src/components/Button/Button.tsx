'use client';
import { Button as TailwindButton } from '@/components/ui/button';
import { ComponentPropsWithRef } from 'react';

export function Button({
  className: classNameProp,
  disabled: disabledProp,
  ...props
}: ComponentPropsWithRef<typeof TailwindButton>) {
  const disabled = disabledProp;
  const className = classNameProp;

  const buttonElement = (
    <TailwindButton
      disabled={disabled}
      className={className}
      {...props}
    ></TailwindButton>
  );

  return buttonElement;
}
