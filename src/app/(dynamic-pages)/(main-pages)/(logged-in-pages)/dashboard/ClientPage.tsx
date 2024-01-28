'use client';

import { T } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { insertPrivateItemAction } from '@/data/user/privateItems';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

export const ClientPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toastRef = useRef<string | null>(null);

  const { mutate } = useMutation(insertPrivateItemAction, {
    onMutate: () => {
      const toastId = toast.loading('Creating item');
      toastRef.current = toastId;
    },

    onSuccess: (newItemId) => {
      toast.success('Item created', { id: toastRef.current });
      toastRef.current = null;
      router.refresh();
      queryClient.invalidateQueries(['items']);
      router.push(`/private-item/${newItemId}`);
    },
    onError: () => {
      toast.error('Failed to create item', { id: toastRef.current });
      toastRef.current = null;
    },
  });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  return (
    <form
      className="flex flex-col space-y-4 pt-8"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        //TODO: do better validation 🤷‍♂️
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        mutate({ name, description });
      }}
    >
      <div>
        <T.H1>Create Private Item</T.H1>
        <T.Subtle>
          This item will be private and only you logged in will be able to
          create it.
        </T.Subtle>
      </div>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="name"
        >
          Name
        </label>
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          id="name"
          name="name"
          type="text"
          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
        />
      </div>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          id="description"
          name="description"
          rows={4}
          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
        />
      </div>
      <Button variant="default" type="submit">
        Create Item
      </Button>
    </form>
  );
};
