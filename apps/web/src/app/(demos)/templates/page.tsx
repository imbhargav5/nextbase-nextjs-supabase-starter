import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createPageMetadata } from '@/lib/seo/metadata';
import { templateCatalog, type TemplateStatus } from '@/lib/templates/catalog';

export const metadata = createPageMetadata({
  title: 'Template marketplace',
  description:
    'Browse Menace Next landing page templates — live demos and scaffolds for SaaS marketing, product launches, and client deliverables.',
  path: '/templates',
});

function statusLabel(status: TemplateStatus) {
  switch (status) {
    case 'live':
      return 'Live';
    case 'scaffold':
      return 'Scaffold';
    case 'coming-soon':
      return 'Coming soon';
  }
}

function statusVariant(status: TemplateStatus): 'default' | 'secondary' | 'outline' {
  switch (status) {
    case 'live':
      return 'default';
    case 'scaffold':
      return 'secondary';
    case 'coming-soon':
      return 'outline';
  }
}

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Template marketplace
          </h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Start from a polished landing page template and customize it for
            your product.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {templateCatalog.map((template) => (
            <Card key={template.slug} className="border-border/70">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{template.name}</CardTitle>
                  <div className="flex shrink-0 flex-wrap justify-end gap-2">
                    <Badge variant={statusVariant(template.status)}>
                      {statusLabel(template.status)}
                    </Badge>
                    <Badge variant="outline">Landing page</Badge>
                  </div>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </CardContent>
              <CardFooter>
                {template.status === 'coming-soon' ? (
                  <Button disabled>Coming soon</Button>
                ) : (
                  <Button asChild>
                    <Link href={`/templates/${template.slug}`}>
                      {template.status === 'live'
                        ? 'View template'
                        : 'Open scaffold'}
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
