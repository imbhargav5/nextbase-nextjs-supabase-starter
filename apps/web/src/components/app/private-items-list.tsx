import { CalendarDays, Eye, LockKeyhole, MoreHorizontal, Plus } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Table as TableType } from '@/types';

interface PrivateItemsListProps {
  privateItems: TableType<'private_items'>[];
}

function formatCreatedAt(createdAt: string | null) {
  if (!createdAt) return 'Date unavailable';
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
  }).format(new Date(createdAt));
}

function ItemMenu({ itemId, itemName }: { itemId: string; itemName: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${itemName}`}>
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Item actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/private-item/${itemId}`}>
            <Eye aria-hidden="true" />
            View details
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PrivateItemsList({ privateItems }: PrivateItemsListProps) {
  if (!privateItems.length) {
    return (
      <Empty className="min-h-72 border bg-background">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LockKeyhole aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No private items yet</EmptyTitle>
          <EmptyDescription>
            Create your first private item to see the complete protected-data flow.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/dashboard/new">
              <Plus aria-hidden="true" />
              Create private item
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <>
      <Card className="hidden overflow-hidden border-border/70 shadow-none md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[32%]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-40">Created</TableHead>
              <TableHead className="w-14">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {privateItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Link
                    href={`/private-item/${item.id}`}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {item.name}
                  </Link>
                </TableCell>
                <TableCell className="max-w-md text-muted-foreground">
                  <span className="line-clamp-2">{item.description}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {formatCreatedAt(item.created_at)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ItemMenu itemId={item.id} itemName={item.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="border-border/70 p-2 shadow-none md:hidden">
        <ItemGroup className="gap-1">
          {privateItems.map((item) => (
            <Item key={item.id} variant="default" size="sm">
              <ItemMedia variant="icon">
                <LockKeyhole aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  <Link href={`/private-item/${item.id}`}>{item.name}</Link>
                </ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="size-3" aria-hidden="true" />
                  {formatCreatedAt(item.created_at)}
                </span>
              </ItemContent>
              <ItemActions>
                <ItemMenu itemId={item.id} itemName={item.name} />
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </Card>
    </>
  );
}
