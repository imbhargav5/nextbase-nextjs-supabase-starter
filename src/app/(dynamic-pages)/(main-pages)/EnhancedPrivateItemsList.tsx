"use client";

import { Table as TableType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/ui/data-table';
import { privateItemsColumns } from '@/components/ui/data-table/columns';
import { T } from '@/components/ui/Typography';

interface EnhancedPrivateItemsListProps {
  privateItems: TableType<'private_items'>[];
  showActions?: boolean;
}

export const EnhancedPrivateItemsList = ({
  privateItems,
  showActions = true,
}: EnhancedPrivateItemsListProps) => {
  return (
    <div className="space-y-8">
      {showActions && (
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <T.H2>Private Items</T.H2>
              <Badge variant="outline" className="h-6 flex items-center gap-1">
                <Lock className="h-3 w-3" /> Secure
              </Badge>
            </div>
            <T.Subtle>These items are only visible to logged in users</T.Subtle>
          </div>
          <Link href="/dashboard/new">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> New Private Item
            </Button>
          </Link>
        </div>
      )}

      {privateItems.length ? (
        <Card className="shadow-sm border-muted/40">
          <CardContent className="p-0 sm:p-6">
            <DataTable 
              columns={privateItemsColumns} 
              data={privateItems} 
              searchPlaceholder="Search private items..."
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No Private Items Available</CardTitle>
            <CardDescription>
              You haven't created any private items yet. Create your first one!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/new">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> Create Your First Private
                Item
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
