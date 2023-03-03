'use client';
import { useMaintenanceMode } from '@/contexts/MaintenanceModeContext';
import { Tooltip } from 'react-tooltip';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  withMaintenanceMode?: boolean;
};

export function Button({
  className: classNameProp,
  disabled: disabledProp,
  withMaintenanceMode = false,
  ...props
}: ButtonProps) {
  const isInMaintenanceMode = useMaintenanceMode() && withMaintenanceMode;
  const disabled = isInMaintenanceMode || disabledProp;
  const className = isInMaintenanceMode
    ? `${classNameProp} cursor-not-allowed `
    : classNameProp;

  const buttonElement = (
    <button disabled={disabled} className={className} {...props}></button>
  );
  if (isInMaintenanceMode) {
    const wrapperId = `${props.id}-wrapper`;
    return (
      <>
        <div id={wrapperId}>{buttonElement}</div>
        <Tooltip anchorId={wrapperId}>
          <p>The App is currently in maintenance mode. </p>
          <p>Please check back later.</p>
        </Tooltip>
      </>
    );
  }
  return buttonElement;
}
