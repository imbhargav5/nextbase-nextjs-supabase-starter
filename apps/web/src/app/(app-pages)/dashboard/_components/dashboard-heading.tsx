import { Plus } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';

export async function DashboardHeading() {
  'use cache';

  return (
    <PageHeader
      title="Dashboard"
      description="Your signed-in workspace. Add private items or jump back to kits."
      actions={
        <Button asChild variant="brand">
          <Link href="/dashboard/new">
            <Plus aria-hidden="true" />
            New private item
          </Link>
        </Button>
      }
    />
  );
}
