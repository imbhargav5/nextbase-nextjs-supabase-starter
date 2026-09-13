import { BudgetBento } from '@/components/ui/budget-bento';
import { MagnifiedBento } from '@/components/ui/magnified-bento';

export function HomeBento() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-medium text-muted-foreground">Interactive by default</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            A foundation that feels as good as it looks
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Explore motion, discovery, and launch-ready workflows built into the starter kit.
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
