import { FileQuestion } from 'lucide-react';
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

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-2xl items-center p-4 sm:p-6">
      <Empty className="w-full border bg-background py-14">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileQuestion aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>Private item not found</EmptyTitle>
          <EmptyDescription>
            It may have been deleted, or your account may not have permission to
            view it.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/private-items">Return to private items</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
