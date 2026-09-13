import { BudgetBento } from '@/components/ui/budget-bento';
import { MagnifiedBento } from '@/components/ui/magnified-bento';

export function HomeBento() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-medium text-brand">See before you buy</p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Demo, prompts, and ship checklist
          </h2>
          <p className="mt-4 text-pretty text-base leading-7 text-muted-foreground">
            Live template, section prompts, and deploy steps in every kit.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <MagnifiedBento />
          <BudgetBento />
        </div>
      </div>
    </section>
  );
}
