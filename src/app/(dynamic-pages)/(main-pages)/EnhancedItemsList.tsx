"use client";

import { Table as TableType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/ui/data-table';
import { publicItemsColumns } from '@/components/ui/data-table/columns';
import { T } from '@/components/ui/Typography';

interface EnhancedItemsListProps {
  items: TableType<'items'>[];
  showActions?: boolean;
}

export const EnhancedItemsList = ({ items, showActions = true }: EnhancedItemsListProps) => {
  return (
    <div className="space-y-8">
      {showActions && (
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <T.H2>Public Items</T.H2>
            <T.Subtle>
              This is an open database. Items are automatically cleared every 24
              hours.
            </T.Subtle>
          </div>
          <Link href="/new">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> New Item
            </Button>
          </Link>
        </div>
      )}

      {items.length ? (
        <Card className="shadow-sm border-muted/40">
          <CardContent className="p-0 sm:p-6">
            <DataTable 
              columns={publicItemsColumns} 
              data={items} 
              searchPlaceholder="Search items..."
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No Items Available</CardTitle>
            <CardDescription>
              There are no items in the database. Create your first item!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/new">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> Create Your First Item
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
