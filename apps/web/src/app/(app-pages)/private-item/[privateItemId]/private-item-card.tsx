import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { T } from '@/components/ui/Typography';
import type { Table as TableType } from '@/types';
import { Calendar, Info } from 'lucide-react';
import Link from 'next/link';
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

  return (
    <div className="space-y-4">


      <Card className="shadow-md border-t-4 border-t-primary">
        <CardHeader className="pb-2">
          <T.H2 className="mb-1">{item.name}</T.H2>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Info className="h-3 w-3" />
            <span>Private Item</span>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <div className="space-y-4">
            <div>
              <T.Small className="text-muted-foreground">Description</T.Small>
              <T.P className="mt-1">{item.description}</T.P>
            </div>

            {item.created_at && (
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Calendar className="h-3 w-3" />
                <span>
                  Created on {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <ButtonGroup className="w-full justify-between">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
            <ConfirmDeleteItemDialog itemId={privateItemId} />
          </ButtonGroup>
        </CardFooter>
      </Card>
    </div>
  );
}
