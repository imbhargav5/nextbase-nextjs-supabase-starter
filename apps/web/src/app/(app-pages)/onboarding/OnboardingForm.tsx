'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { createWorkspaceAction } from '@/data/user/workspaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({ name: z.string().min(1, 'Name is required').max(80) });
type FormData = z.infer<typeof formSchema>;

export function OnboardingForm() {
  const router = useRouter();
  const toastRef = useRef<string | number | undefined>(undefined);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: { name: '' },
  });

  const { execute, status } = useAction(createWorkspaceAction, {
    onExecute: () => {
      toastRef.current = toast.loading('Creating workspace');
    },
    onSuccess: () => {
      toast.success('Workspace created', { id: toastRef.current });
      router.push('/dashboard');
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Failed to create workspace', {
        id: toastRef.current,
      });
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your workspace</CardTitle>
        <CardDescription>
          A workspace holds your projects, feedback, and teammates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => execute(data))}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={status === 'executing' || !form.formState.isValid}
            >
              {status === 'executing' ? <Spinner className="h-4 w-4" /> : 'Create workspace'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
