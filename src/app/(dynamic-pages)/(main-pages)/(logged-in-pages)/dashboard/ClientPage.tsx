'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';

import { T } from '@/components/ui/Typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { insertPrivateItemAction } from '@/data/user/privateItems';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

type FormData = z.infer<typeof formSchema>;

const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const inputVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

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

  const { execute, status } = useAction(insertPrivateItemAction, {
    onExecute: () => {
      toastRef.current = toast.loading('Creating item');
    },
    onSuccess: ({ data }) => {
      toast.success('Item created', { id: toastRef.current });
      toastRef.current = undefined;
      router.refresh();
      if (data) {
        router.push(`/private-item/${data}`);
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="container mx-auto p-4"
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>
            <T.H2>Create Private Item</T.H2>
          </CardTitle>
          <CardDescription>
            <T.Subtle>
              This item will be private and only you logged in will be able to
              create it.
            </T.Subtle>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div variants={inputVariants} className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                {...register('name')}
                id="name"
                placeholder="Enter item name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </motion.div>
            <motion.div variants={inputVariants} className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                {...register('description')}
                id="description"
                placeholder="Enter item description"
                rows={4}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </motion.div>
            <motion.div
              variants={inputVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                className="w-full"
                variant="default"
                type="submit"
                disabled={status === 'executing' || !isValid}
              >
                {status === 'executing' ? 'Creating Item...' : 'Create Item'}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
