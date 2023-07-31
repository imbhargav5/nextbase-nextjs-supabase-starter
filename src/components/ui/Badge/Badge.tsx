import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-slate-50 group-hover:bg-slate-100 border border-slate-700 text-black',
        success:
          'bg-green-50 group-hover:bg-green-100 border border-green-700 text-green-900',
        information:
          'bg-blue-50 group-hover:bg-blue-100 border border-blue-700 text-blue-900',
        danger:
          'bg-rose-50 group-hover:bg-rose-100 border border-rose-700 text-rose-900',
        warning:
          'bg-amber-50 group-hover:bg-amber-100 border border-amber-700 text-amber-900',
        discussion:
          'bg-purple-50 group-hover:bg-purple-100 border border-purple-700 text-purple-900',
        sky: 'bg-sky-50 group-hover:bg-sky-100 border border-sky-700 text-sky-900',
        indigo:
          'bg-indigo-50 group-hover:bg-indigo-100 border border-indigo-700 text-indigo-900',
        outline: 'text-foreground',
        soliddefault: 'bg-slate-700 text-white group-hover:bg-slate-500',
        solidSuccess: 'bg-green-700 text-white group-hover:bg-green-500',
        solidInformation: 'bg-blue-700 text-white group-hover:bg-blue-500',
        solidDanger: 'bg-rose-700 text-white group-hover:bg-rose-500',
        solidWarning: 'bg-amber-700 text-white group-hover:bg-amber-500',
        solidDiscussion: 'bg-purple-700 text-white group-hover:bg-purple-500',
        solidSky: 'bg-sky-700 text-white group-hover:bg-sky-500',
        solidIndigo: 'bg-indigo-700 text-white group-hover:bg-indigo-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
