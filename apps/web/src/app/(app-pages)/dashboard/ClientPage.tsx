'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { insertPrivateItemAction } from '@/data/user/privateItems';

const formSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120, 'Name is too long'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(1000, 'Description is too long'),
});

type FormData = z.infer<typeof formSchema>;

export function CreatePrivateItemForm() {
  const router = useRouter();
  const toastRef = useRef<string | number | undefined>(undefined);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: { name: '', description: '' },
  });

  const { execute, status } = useAction(insertPrivateItemAction, {
    onExecute: () => {
      toastRef.current = toast.loading('Creating item...');
    },
    onSuccess: ({ data }) => {
      toast.success('Private item created', { id: toastRef.current });
      toastRef.current = undefined;
      router.refresh();
      if (data) router.push(`/private-item/${data}`);
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Failed to create item', {
        id: toastRef.current,
      });
      toastRef.current = undefined;
    },
  });

  return (
    <Card className="border-border/70 shadow-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => execute(data))}>
          <CardHeader>
            <CardTitle className="text-xl">Item details</CardTitle>
            <CardDescription>
              This record is assigned to your account and protected by row-level security.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Launch checklist" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use a short name that will be easy to recognize later.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add the private context you want to keep with this item."
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Up to 1,000 characters. You can edit the schema for your own use case.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col-reverse gap-2 border-t bg-muted/20 py-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={status === 'executing' || !form.formState.isValid}
            >
              {status === 'executing' ? <Spinner aria-hidden="true" /> : null}
              {status === 'executing' ? 'Creating...' : 'Create private item'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
