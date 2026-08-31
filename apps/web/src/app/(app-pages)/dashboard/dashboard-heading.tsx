import { Plus } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';

export async function DashboardHeading() {
  'use cache';

  return (
    <PageHeader
      title="Dashboard"
      description="Manage your secure workspace and continue where you left off."
      actions={
        <Button asChild>
          <Link href="/dashboard/new">
            <Plus aria-hidden="true" />
            New private item
          </Link>
        </Button>
      }
    />
  );
}
