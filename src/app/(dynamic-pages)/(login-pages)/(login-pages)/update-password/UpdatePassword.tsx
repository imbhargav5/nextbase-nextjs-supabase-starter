'use client';

import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { toast } from 'sonner';

import { Password } from '@/components/Auth/Password';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { updatePasswordAction } from '@/data/user/security';

export function UpdatePassword() {
  const router = useRouter();
  const toastRef = useRef<string | number | undefined>(undefined);

  const { execute, status } = useAction(updatePasswordAction, {
    onExecute: () => {
      toastRef.current = toast.loading('Updating password...');
    },
    onSuccess: () => {
      toast.success('Password updated!', {
        id: toastRef.current,
      });
      toastRef.current = undefined;
      router.push('/auth/callback');
    },
    onError: ({ error }) => {
      const errorMessage =
        error.serverError ?? error.fetchError ?? 'Failed to update password';
      toast.error(errorMessage, {
        id: toastRef.current,
      });
      toastRef.current = undefined;
    },
  });

  return (
    <div className="container h-full grid items-center text-left max-w-lg mx-auto overflow-auto">
      <div className="space-y-8 ">
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email to receive a Magic Link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Password
              isLoading={status === 'executing'}
              onSubmit={(password: string) => execute({ password })}
              label="Create your new Password"
              buttonLabel="Confirm Password"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
