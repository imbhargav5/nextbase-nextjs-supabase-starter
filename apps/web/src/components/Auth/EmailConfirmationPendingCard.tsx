'use client';

import { ArrowLeft, Fingerprint, MailCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';

import { AuthCard } from '@/components/Auth/AuthCard';
import { Button } from '@/components/ui/button';

interface ConfirmationPendingCardProps {
  message: string;
  heading: string;
  type: 'login' | 'sign-up' | 'reset-password';
  resetSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>;
  resendEmail?: () => void;
}

export function EmailConfirmationPendingCard({
  message,
  heading,
  type,
  resetSuccessMessage,
  resendEmail,
}: ConfirmationPendingCardProps) {
  const router = useRouter();
  const destination = type === 'sign-up' ? '/sign-up' : '/login';

  return (
    <AuthCard
      title={heading}
      description={message}
      icon={
        type === 'reset-password' ? (
          <Fingerprint aria-hidden="true" />
        ) : (
          <MailCheck aria-hidden="true" />
        )
      }
      footer={
        <div className="flex w-full flex-col gap-2">
          <Button
            variant="outline"
            onClick={() => {
              resetSuccessMessage(null);
              router.push(destination);
            }}
          >
            <ArrowLeft aria-hidden="true" />
            {type === 'sign-up' ? 'Back to sign up' : 'Back to login'}
          </Button>
          {type === 'sign-up' && resendEmail ? (
            <Button variant="link" onClick={resendEmail}>
              Resend confirmation email
            </Button>
          ) : null}
        </div>
      }
    >
      <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
        You can close this page after following the secure link in your email.
      </div>
    </AuthCard>
  );
}
