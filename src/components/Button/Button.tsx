'use client';
import {
  Button as TailwindButton,
  ButtonProps as TailwindButtonProps,
} from '@/components/ui/button';

export function Button({
  className: classNameProp,
  disabled: disabledProp,
  ...props
}: TailwindButtonProps) {
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
