'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { deleteItemAction } from '@/data/anon/items';

type ConfirmDeleteItemDialogProps = {
  itemId: string;
};

export const ConfirmDeleteItemDialog = ({
  itemId,
}: ConfirmDeleteItemDialogProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const toastRef = useRef<string | number | undefined>(undefined);

  const { execute, status } = useAction(deleteItemAction, {
    onExecute: () => {
      toastRef.current = toast.loading('Deleting item');
    },
    onSuccess: () => {
      toast.success('Item deleted', { id: toastRef.current });
      toastRef.current = undefined;
      router.refresh();
      router.push('/');
      setOpen(false);
    },
    onError: ({ error }) => {
      const errorMessage =
        error.serverError ?? error.fetchError ?? 'Failed to delete item';
      toast.error(errorMessage, { id: toastRef.current });
      toastRef.current = undefined;
      setOpen(false);
    },
  });

  const handleDelete = () => {
    execute({ id: itemId });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Trash className="mr-1" /> Delete Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this item?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            disabled={status === 'executing'}
            onClick={handleDelete}
          >
            {status === 'executing' ? 'Deleting item...' : 'Yes, delete'}
          </Button>
          <Button
            disabled={status === 'executing'}
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
