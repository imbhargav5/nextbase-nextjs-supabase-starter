import Image from 'next/image';
import type { CSSProperties } from 'react';

import { SITE_LOGO_PATH } from '@/constants';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <Image
      src={SITE_LOGO_PATH}
      alt=""
      width={size}
      height={size}
      className={cn('shrink-0 object-contain', className)}
      style={{ width: size, height: size } satisfies CSSProperties}
      aria-hidden="true"
    />
  );
}
