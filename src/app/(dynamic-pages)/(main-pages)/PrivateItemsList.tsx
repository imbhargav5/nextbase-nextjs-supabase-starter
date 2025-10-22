import { T } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Table as TableType } from '@/types';
import {
  Clock,
  ExternalLink,
  Lock,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

interface PrivateItemsListProps {
  privateItems: TableType<'private_items'>[];
  showActions?: boolean;
}

export const PrivateItemsList = ({
  privateItems,
  showActions = true,
}: PrivateItemsListProps) => {
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
              {privateItems.map((item) => (
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
                    <Link href={`/private-item/${item.id}`}>
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
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShieldCheck />
            </EmptyMedia>
            <EmptyTitle>No Private Items Available</EmptyTitle>
            <EmptyDescription>
              You haven't created any private items yet. Create your first one
              to get started!
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/dashboard/new">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> Create Your First Private
                Item
              </Button>
            </Link>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
};
