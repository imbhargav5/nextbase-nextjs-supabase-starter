import { Table } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteItem,
  getAllItems,
  getItem,
  insertItem,
  updateItem,
} from './supabase-queries';
import supabaseClient from './supabase-browser';
import { useRef } from 'react';
import { toast } from 'react-hot-toast';

export const useItems = (initialData: Array<Table<'items'>>) => {
  return useQuery<Array<Table<'items'>>>(
    ['items'],
    async () => {
      return getAllItems(supabaseClient);
    },
    {
      initialData,
    }
  );
};

export const useInsertItem = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async (item: { name: string; description: string }) => {
      return insertItem(supabaseClient, item);
    },
    {
      onMutate: () => {
        const toastId = toast.loading('Creating item');
        toastRef.current = toastId;
      },

      onSuccess: () => {
        toast.success('Item created', { id: toastRef.current });
        toastRef.current = null;
        queryClient.invalidateQueries(['items']);
        onSuccess?.();
      },
      onError: () => {
        toast.error('Failed to create item', { id: toastRef.current });
        toastRef.current = null;
      },
    }
  );
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  const toastRef = useRef<string | null>(null);

  return useMutation(
    async (item: { id: string; name: string; description: string }) => {
      return updateItem(supabaseClient, item);
    },
    {
      onMutate: () => {
        const toastId = toast.loading('Updating item');
        toastRef.current = toastId;
      },
      onSuccess: () => {
        toast.success('Item updated', { id: toastRef.current });
        toastRef.current = null;
        queryClient.invalidateQueries(['items']);
      },
      onError: () => {
        toast.error('Failed to update item', { id: toastRef.current });
        toastRef.current = null;
      },
    }
  );
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async (id: string) => {
      return deleteItem(supabaseClient, id);
    },
    {
      onMutate: () => {
        const toastId = toast.loading('Deleting item');
        toastRef.current = toastId;
      },
      onSuccess: () => {
        toast.success('Item deleted', { id: toastRef.current });
        toastRef.current = null;
        queryClient.invalidateQueries(['items']);
      },
      onError: () => {
        toast.error('Failed to delete item', { id: toastRef.current });
        toastRef.current = null;
      },
    }
  );
};

export const useGetItem = (id: string) => {
  return useQuery<Promise<Table<'items'>>>(['items', id], async () => {
    return getItem(supabaseClient, id);
  });
};
