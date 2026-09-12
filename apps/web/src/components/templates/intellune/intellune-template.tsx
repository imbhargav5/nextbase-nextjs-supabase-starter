import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getTemplateBySlug } from '@/lib/templates/catalog';

const template = getTemplateBySlug('intellune');

export function IntelluneTemplate() {
  return (
    <div
      data-template="intellune"
      className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-foreground antialiased sm:px-6"
    >
      <Card className="w-full max-w-xl border-border/70">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Template scaffold</Badge>
            {template?.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <CardTitle className="text-2xl">{template?.name ?? 'Intellune'}</CardTitle>
          <CardDescription className="text-base leading-7">
            {template?.description ??
              'Add sections, assets, and theme tokens in this folder to ship your next marketplace template.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
          <p>
            Copy the Nguyen structure: create components under{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
              src/components/templates/intellune/
            </code>
            , add assets to{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
              public/templates/intellune/
            </code>
            , and register the entry in{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
              src/lib/templates/catalog.ts
            </code>
            .
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/templates">Back to marketplace</Link>
            </Button>
            <Button asChild>
              <Link href="/templates/nguyen">View Nguyen reference</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
