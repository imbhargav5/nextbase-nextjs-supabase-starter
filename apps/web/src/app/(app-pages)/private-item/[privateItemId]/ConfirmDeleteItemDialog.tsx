'use client';

import { AlertTriangle, Trash2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useRef, useState, type JSX } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { deletePrivateItemAction } from '@/data/user/privateItems';

export function ConfirmDeleteItemDialog({ itemId }: { itemId: string }): JSX.Element {
  const [open, setOpen] = useState(false);
  const toastRef = useRef<string | number | undefined>(undefined);
  const router = useRouter();

  const { execute, status } = useAction(deletePrivateItemAction, {
    onExecute: () => {
      toastRef.current = toast.loading('Deleting item...');
    },
    onSuccess: () => {
      toast.success('Item deleted', { id: toastRef.current });
      toastRef.current = undefined;
      setOpen(false);
      router.push('/private-items');
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Failed to delete item', {
        id: toastRef.current,
      });
      toastRef.current = undefined;
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 aria-hidden="true" />
          Delete item
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" aria-hidden="true" />
            Delete this private item?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The record will be permanently removed
            from your workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={status === 'executing'}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            disabled={status === 'executing'}
            onClick={(event) => {
              event.preventDefault();
              execute({ id: itemId });
            }}
          >
            {status === 'executing' ? <Spinner aria-hidden="true" /> : null}
            {status === 'executing' ? 'Deleting...' : 'Delete permanently'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
