'use client';

import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

export const ClientPage = ({
  insertPrivateItemAction,
}: {
  insertPrivateItemAction: (item: {
    name: string;
    description: string;
  }) => Promise<string>;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toastRef = useRef<string | null>(null);

  const { mutate } = useMutation(
    async (item: { name: string; description: string }) => {
      return insertPrivateItemAction(item);
    },
    {
      onMutate: () => {
        const toastId = toast.loading('Creating item');
        toastRef.current = toastId;
      },

      onSuccess: (newItemId) => {
        toast.success('Item created', { id: toastRef.current });
        toastRef.current = null;
        router.refresh();
        queryClient.invalidateQueries(['items']);
        router.push(`/item/${newItemId}`);
      },
      onError: () => {
        toast.error('Failed to create item', { id: toastRef.current });
        toastRef.current = null;
      },
    }
  );
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  return (
    <form
      className="flex flex-col space-y-4"
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
        <h1 className="mt-1 text-3xl font-bold tracking-tight  sm:text-4xl lg:text-5xl">
          Create Private Item
        </h1>
        <p className="text-gray-600">
          This item will be private and only you logged in will be able to
          create it.
        </p>
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
          className="block w-full appearance-none rounded-md border  px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
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
          className="block w-full appearance-none rounded-md border  px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
        />
      </div>
      <Button
        variant="default"
        type="submit"
        className="bg-black hover:bg-gray-900"
      >
        Create Item
      </Button>
    </form>
  );
};
