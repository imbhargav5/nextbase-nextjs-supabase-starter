'use client';

import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { AuthCard } from '@/components/Auth/AuthCard';
import { AuthMethodTabs } from '@/components/Auth/auth-method-tabs';
import { Email } from '@/components/Auth/Email';
import { EmailAndPassword } from '@/components/Auth/EmailAndPassword';
import { EmailConfirmationPendingCard } from '@/components/Auth/EmailConfirmationPendingCard';
import { RenderProviders } from '@/components/Auth/RenderProviders';
import { Button } from '@/components/ui/button';
import {
  signInWithMagicLinkAction,
  signInWithProviderAction,
  signUpAction,
} from '@/data/auth/auth';
import { PRODUCT_NAME } from '@/constants';
import type { AuthProvider } from '@/types';

interface SignUpProps {
  next?: string;
}

export function SignUp({ next }: SignUpProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const toastRef = useRef<string | number | undefined>(undefined);

  const { execute: executeMagicLink, status: magicLinkStatus } = useAction(
    signInWithMagicLinkAction,
    {
      onExecute: () => {
        toastRef.current = toast.loading('Sending magic link...');
      },
      onSuccess: () => {
        toast.success('A magic link has been sent to your email!', {
          id: toastRef.current,
        });
        toastRef.current = undefined;
        setSuccessMessage('A magic link has been sent to your email.');
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? 'Failed to send magic link', {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
    }
  );

  const { execute: executeSignUp, status: signUpStatus } = useAction(
    signUpAction,
    {
      onExecute: () => {
        toastRef.current = toast.loading('Creating account...');
      },
      onSuccess: () => {
        toast.success('Account created', { id: toastRef.current });
        toastRef.current = undefined;
        setSuccessMessage('A confirmation link has been sent to your email.');
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? 'Failed to create account', {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
    }
  );

  const { execute: executeProvider, status: providerStatus } = useAction(
    signInWithProviderAction,
    {
      onExecute: () => {
        toastRef.current = toast.loading('Requesting sign up...');
      },
      onSuccess: ({ data }) => {
        toast.success('Redirecting...', { id: toastRef.current });
        toastRef.current = undefined;
        if (data?.url) window.location.href = data.url;
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? 'Failed to sign up', {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
    }
  );

  if (successMessage) {
    return (
      <EmailConfirmationPendingCard
        type="sign-up"
        heading="Confirmation Link Sent"
        message={successMessage}
        resetSuccessMessage={setSuccessMessage}
      />
    );
  }

  return (
    <AuthCard
      title={`Create your ${PRODUCT_NAME} account`}
      description="Create your account and start with a secure, working foundation."
      footer={
        <p className="w-full text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Button variant="link" className="h-auto px-0" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </p>
      }
    >
      <AuthMethodTabs layoutId="signup-auth-method">
        {(activeTab) => {
          if (activeTab === 'password') {
            return (
              <EmailAndPassword
                isLoading={signUpStatus === 'executing'}
                onSubmit={(data) => executeSignUp({ ...data, next })}
                view="sign-up"
              />
            );
          }

          if (activeTab === 'magic-link') {
            return (
              <Email
                onSubmit={(email) => executeMagicLink({ email, next })}
                isLoading={magicLinkStatus === 'executing'}
                view="sign-up"
              />
            );
          }

          return (
            <RenderProviders
              providers={['google', 'github', 'twitter']}
              isLoading={providerStatus === 'executing'}
              onProviderLoginRequested={(
                provider: Extract<AuthProvider, 'google' | 'github' | 'twitter'>
              ) => executeProvider({ provider, next })}
            />
          );
        }}
      </AuthMethodTabs>
    </AuthCard>
  );
}
