'use client';

import { BudgetCard } from '@/components/ui/budget-card';
import { cn } from '@/lib/utils';

const bentoShellClassName =
  'group relative flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] border bg-card p-1.5 shadow-2xl shadow-primary/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-primary/10 sm:rounded-[2rem] sm:p-2';

const bentoHoleClassName =
  'flex min-h-[148px] flex-1 flex-col justify-end rounded-[1.25rem] bg-muted/30 p-2 sm:min-h-[164px] sm:rounded-[1.5rem] sm:p-2.5';

const bentoFooterClassName = 'px-4 pt-3 pb-5 sm:px-5 sm:pb-6';

export function BudgetBento({ className }: { className?: string }) {
  return (
    <div className={cn(bentoShellClassName, className)}>
      <div className={bentoHoleClassName}>
        <BudgetCard />
      </div>

      <div className={bentoFooterClassName}>
        <h3 className="text-lg font-medium tracking-tight text-foreground sm:text-xl">
          Built for Growth
        </h3>
        <p className="mt-1.5 min-h-[3.5rem] text-sm leading-relaxed text-muted-foreground sm:min-h-[3.75rem]">
          Track momentum with polished dashboards and interactive visuals that make your product
          feel premium from the first screen.
        </p>
      </div>
    </div>
  );
}
