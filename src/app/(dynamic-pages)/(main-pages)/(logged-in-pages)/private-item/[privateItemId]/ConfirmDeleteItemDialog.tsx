'use client';

import { AlertTriangle, Trash } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { deletePrivateItemAction } from '@/data/user/privateItems';

type Props = {
  itemId: string;
};

export const ConfirmDeleteItemDialog = ({ itemId }: Props): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const toastRef = useRef<string | number | undefined>(undefined);
  const router = useRouter();

  const { execute, status } = useAction(deletePrivateItemAction, {
    onExecute: () => {
      toastRef.current = toast.loading('Deleting item...');
    },
    onSuccess: () => {
      toast.success('Item deleted', { id: toastRef.current });
      toastRef.current = undefined;
      router.refresh();
      router.push('/private-items');
      setOpen(false);
    },
    onError: ({ error }) => {
      const errorMessage = error.serverError ?? 'Failed to delete item';
      toast.error(errorMessage, { id: toastRef.current });
      toastRef.current = undefined;
    },
  });

  const handleDelete = () => {
    execute({ id: itemId });
  };

  return (
    <>
      <Button
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setShowAlert(true)}
      >
        <Trash className="h-4 w-4" /> Delete Item
      </Button>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              item and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={status === 'executing'}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={status === 'executing'}
            >
              {status === 'executing' ? (
                <>
                  <Spinner className="h-4 w-4" />
                  <span>Deleting...</span>
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
