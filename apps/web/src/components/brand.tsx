import { Logo } from '@/components/logo';
import { PRODUCT_NAME, PRODUCT_TAGLINE } from '@/constants';
import { cn } from '@/lib/utils';

interface BrandProps {
  className?: string;
  showTagline?: boolean;
}

export function Brand({ className, showTagline = false }: BrandProps) {
  return (
    <span className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <Logo size={32} />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-sm font-semibold tracking-tight">
          {PRODUCT_NAME}
        </span>
        {showTagline ? (
          <span className="truncate text-xs text-muted-foreground">
            {PRODUCT_TAGLINE}
          </span>
        ) : null}
      </span>
    </span>
  );
}
