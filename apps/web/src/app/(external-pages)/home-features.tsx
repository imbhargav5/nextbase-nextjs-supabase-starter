import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

export interface HomeFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface HomeFeaturesProps {
  features: HomeFeature[];
}

export function HomeFeatures({ features }: HomeFeaturesProps) {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-medium text-muted-foreground">Built to ship</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need, already connected
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Spend your time on the product instead of rebuilding the same
            foundation for every project.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/70 shadow-none">
              <CardHeader className="space-y-4">
                <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/50">
                  <feature.icon className="size-5" aria-hidden="true" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="leading-6">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
