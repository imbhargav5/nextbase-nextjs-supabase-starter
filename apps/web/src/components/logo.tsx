import { useId } from 'react';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  const id = useId().replace(/:/g, '');
  const markAccent = `logo-mark-accent-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        'shrink-0',
        '[--logo-mark-top:var(--foreground)]',
        '[--logo-mark-mid:color-mix(in_oklch,var(--foreground)_92%,var(--background))]',
        '[--logo-mark-bottom:color-mix(in_oklch,var(--foreground)_78%,var(--background))]',
        className,
      )}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={markAccent}
          x1="32"
          y1="17"
          x2="32"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--logo-mark-top)" />
          <stop offset="0.42" stopColor="var(--logo-mark-mid)" />
          <stop offset="1" stopColor="var(--logo-mark-bottom)" />
        </linearGradient>
      </defs>

      <path
        d="M32 17.5 20.25 37.75 43.75 37.75 32 17.5Z"
        fill={`url(#${markAccent})`}
      />

      <rect
        x="20.25"
        y="41.25"
        width="23.5"
        height="2.75"
        rx="1.375"
        fill={`url(#${markAccent})`}
      />
    </svg>
  );
}
