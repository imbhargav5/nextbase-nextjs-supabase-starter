'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { insertItemAction } from '@/data/anon/items';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

type FormData = z.infer<typeof formSchema>;

export const ClientPage: React.FC = () => {
  const router = useRouter();
  const toastRef = useRef<string | number | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const { execute, status } = useAction(insertItemAction, {
    onExecute: () => {
      toastRef.current = toast.loading('Creating item');
    },
    onSuccess: ({ data }) => {
      toast.success('Item created', { id: toastRef.current });
      toastRef.current = undefined;
      router.refresh();
      if (data) {
        router.push(`/item/${data}`);
      }
    },
    onError: ({ error }) => {
      const errorMessage =
        error.serverError ?? error.fetchError ?? 'Failed to create item';
      toast.error(errorMessage, { id: toastRef.current });
      toastRef.current = undefined;
    },
  });

  const onSubmit = (data: FormData) => {
    execute(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
      <div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Create Item
        </h1>
      </div>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="name"
        >
          Name
        </label>
        <Input
          {...register('name')}
          id="name"
          type="text"
          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="description"
        >
          Description
        </label>
        <Textarea
          {...register('description')}
          id="description"
          rows={4}
          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>
      <Button
        variant="default"
        type="submit"
        disabled={status === 'executing' || !isValid}
      >
        {status === 'executing' ? 'Creating Item...' : 'Create Item'}
      </Button>
    </form>
  );
};
