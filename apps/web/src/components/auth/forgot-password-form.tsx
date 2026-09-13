'use client';

import { KeyRound } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useRef, useState, type JSX } from 'react';
import { toast } from 'sonner';

import { AuthCard } from '@/components/Auth/AuthCard';
import { Email } from '@/components/Auth/Email';
import { EmailConfirmationPendingCard } from '@/components/Auth/EmailConfirmationPendingCard';
import { Button } from '@/components/ui/button';
import { resetPasswordAction } from '@/data/auth/auth';

export function ForgotPassword(): JSX.Element {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const toastRef = useRef<string | number | undefined>(undefined);

  const { execute, status } = useAction(resetPasswordAction, {
    onExecute: () => {
      toastRef.current = toast.loading('Sending password reset link...');
    },
    onSuccess: () => {
      toast.success('Password reset link sent', { id: toastRef.current });
      toastRef.current = undefined;
      setSuccessMessage('A password reset link has been sent to your email.');
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Failed to send password reset link', {
        id: toastRef.current,
      });
      toastRef.current = undefined;
    },
  });

  if (successMessage) {
    return (
      <EmailConfirmationPendingCard
        message={successMessage}
        heading="Reset link sent"
        type="reset-password"
        resetSuccessMessage={setSuccessMessage}
      />
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      description="Enter your email and we will send you a secure password reset link."
      icon={<KeyRound aria-hidden="true" />}
      footer={
        <Button variant="link" className="mx-auto h-auto" asChild>
          <Link href="/login">Back to sign in</Link>
        </Button>
      }
    >
      <Email
        onSubmit={(email) => execute({ email })}
        isLoading={status === 'executing'}
        view="forgot-password"
      />
    </AuthCard>
  );
}
