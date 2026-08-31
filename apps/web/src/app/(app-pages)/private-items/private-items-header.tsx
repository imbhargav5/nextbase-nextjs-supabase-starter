import { LockKeyhole, Plus } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';

export function PrivateItemsHeader() {
  return (
    <PageHeader
      title="Private Items"
      description="Browse records in the authenticated workspace, protected by row-level security."
      badge={
        <span className="flex items-center gap-1.5">
          <LockKeyhole className="size-3" aria-hidden="true" />
          Secure
        </span>
      }
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
