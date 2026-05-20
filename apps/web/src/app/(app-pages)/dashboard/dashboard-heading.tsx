import { Button } from '@/components/ui/button';
import { T } from '@/components/ui/Typography';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export async function DashboardHeading() {
  'use cache';
  return (
    <>
      <T.H1>Dashboard</T.H1>
      <Link href="/dashboard/new">
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> New Private Item
        </Button>
      </Link>
    </>
  );
}
