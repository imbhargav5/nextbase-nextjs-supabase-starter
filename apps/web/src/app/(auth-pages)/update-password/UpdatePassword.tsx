'use client';

import { ShieldCheck } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { toast } from 'sonner';

import { AuthCard } from '@/components/Auth/AuthCard';
import { Password } from '@/components/Auth/Password';
import { updatePasswordAction } from '@/data/user/security';

export function UpdatePassword() {
  const router = useRouter();
  const toastRef = useRef<string | number | undefined>(undefined);

  const { execute, status } = useAction(updatePasswordAction, {
    onExecute: () => {
      toastRef.current = toast.loading('Updating password...');
    },
    onSuccess: () => {
      toast.success('Password updated', { id: toastRef.current });
      toastRef.current = undefined;
      router.push('/auth/callback');
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Failed to update password', {
        id: toastRef.current,
      });
      toastRef.current = undefined;
    },
  });

  return (
    <AuthCard
      title="Create a new password"
      description="Choose a secure password for your Nextbase account."
      icon={<ShieldCheck aria-hidden="true" />}
    >
      <Password
        isLoading={status === 'executing'}
        onSubmit={(password) => execute({ password })}
        label="New password"
        buttonLabel="Update password"
      />
    </AuthCard>
  );
}
