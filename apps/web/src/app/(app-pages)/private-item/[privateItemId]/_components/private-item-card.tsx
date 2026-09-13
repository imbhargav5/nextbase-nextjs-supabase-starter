import { ArrowLeft, CalendarDays, FileText, LockKeyhole } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import type { Table as TableType } from '@/types';
import { ConfirmDeleteItemDialog } from './ConfirmDeleteItemDialog';

interface PrivateItemCardProps {
  privateItemId: string;
  itemPromise: Promise<TableType<'private_items'>>;
}

export async function PrivateItemCard({
  privateItemId,
  itemPromise,
}: PrivateItemCardProps) {
  const item = await itemPromise;
  const createdAt = item.created_at
    ? new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(
        new Date(item.created_at)
      )
    : 'Date unavailable';

  return (
    <div className="space-y-8">
      <PageHeader
        title={item.name}
        description="View the information stored in this protected record."
        badge={
          <span className="flex items-center gap-1.5">
            <LockKeyhole className="size-3" aria-hidden="true" />
            Private
          </span>
        }
      />

      <Card className="border-border/70 shadow-none">
        <CardHeader>
          <CardTitle className="text-xl">Item information</CardTitle>
          <CardDescription>
            This data is available inside the authenticated workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemGroup className="gap-3">
            <Item variant="outline" className="items-start">
              <ItemMedia variant="icon">
                <FileText aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Description</ItemTitle>
                <ItemDescription className="line-clamp-none text-pretty">
                  {item.description}
                </ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="outline">
              <ItemMedia variant="icon">
                <CalendarDays aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Created</ItemTitle>
                <ItemDescription>{createdAt}</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardContent>
        <CardFooter className="flex-col-reverse gap-2 border-t bg-muted/20 py-4 sm:flex-row sm:justify-between">
          <Button variant="outline" asChild>
            <Link href="/private-items">
              <ArrowLeft aria-hidden="true" />
              Back to private items
            </Link>
          </Button>
          <ConfirmDeleteItemDialog itemId={privateItemId} />
        </CardFooter>
      </Card>
    </div>
  );
}
