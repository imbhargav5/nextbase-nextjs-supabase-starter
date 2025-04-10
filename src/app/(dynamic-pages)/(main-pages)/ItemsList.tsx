import { T } from '@/components/ui/Typography';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Table as TableType } from '@/types';
import { Clock, ExternalLink, PlusCircle } from 'lucide-react';
import Link from 'next/link';

interface ItemsListProps {
  items: TableType<'items'>[];
  showActions?: boolean;
}

export const ItemsList = ({ items, showActions = true }: ItemsListProps) => {
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead className="hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.name}
                    {item.created_at && (
                      <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {item.description.length > 100
                      ? `${item.description.slice(0, 100)}...`
                      : item.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/item/${item.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
