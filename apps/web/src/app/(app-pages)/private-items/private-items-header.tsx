import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { T } from '@/components/ui/Typography';
import { Lock, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export function PrivateItemsHeader() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <T.H1>Private Items</T.H1>
          <Badge variant="outline" className="h-6 flex items-center gap-1">
            <Lock className="h-3 w-3" /> Secure
          </Badge>
        </div>
        <Link href="/dashboard/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> New Private Item
          </Button>
        </Link>
      </div>
      <T.Subtle className="mb-4">
        Browse your private items that only you can access
      </T.Subtle>
    </>
  );
}
