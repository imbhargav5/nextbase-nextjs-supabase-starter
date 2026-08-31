import { ArrowRight, Rocket } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function AboutCTA() {
  return (
    <Empty className="border bg-muted/20 py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Rocket aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>Ready to build something useful?</EmptyTitle>
        <EmptyDescription>
          Start with the working example, then replace the demo feature with
          the product only you can build.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="lg" asChild>
          <Link href="/sign-up">
            Create your account
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
