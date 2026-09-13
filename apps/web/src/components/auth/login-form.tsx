'use client';

import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { AuthCard } from '@/components/Auth/AuthCard';
import { AuthMethodTabs } from '@/components/Auth/auth-method-tabs';
import { Email } from '@/components/Auth/Email';
import { EmailAndPassword } from '@/components/Auth/EmailAndPassword';
import { EmailConfirmationPendingCard } from '@/components/Auth/EmailConfirmationPendingCard';
import { RedirectingPleaseWaitCard } from '@/components/Auth/RedirectingPleaseWaitCard';
import { RenderProviders } from '@/components/Auth/RenderProviders';
import { Button } from '@/components/ui/button';
import {
  signInWithMagicLinkAction,
  signInWithPasswordAction,
  signInWithProviderAction,
} from '@/data/auth/auth';
import { PRODUCT_NAME } from '@/constants';
import type { AuthProvider } from '@/types';

export function Login({ next }: { next?: string }) {
  const [emailSentSuccessMessage, setEmailSentSuccessMessage] = useState<
    string | null
  >(null);
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  const toastRef = useRef<string | number | undefined>(undefined);
  const router = useRouter();

  function redirectToDashboard() {
    router.push(next ? `/auth/callback?next=${next}` : '/dashboard');
  }

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
        setEmailSentSuccessMessage('A magic link has been sent to your email.');
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? 'Failed to send magic link', {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
    }
  );

  const { execute: executePassword, status: passwordStatus } = useAction(
    signInWithPasswordAction,
    {
      onExecute: () => {
        toastRef.current = toast.loading('Signing in...');
      },
      onSuccess: () => {
        toast.success('Signed in', { id: toastRef.current });
        toastRef.current = undefined;
        redirectToDashboard();
        setRedirectInProgress(true);
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? 'Failed to sign in', {
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
        toastRef.current = toast.loading('Requesting sign in...');
      },
      onSuccess: (payload) => {
        toast.success('Redirecting...', { id: toastRef.current });
        toastRef.current = undefined;
        window.location.href = payload.data?.url || '/';
      },
      onError: () => {
        toast.error('Failed to sign in', { id: toastRef.current });
        toastRef.current = undefined;
      },
    }
  );

  if (emailSentSuccessMessage) {
    return (
      <EmailConfirmationPendingCard
        type="login"
        heading="Check your inbox"
        message={emailSentSuccessMessage}
        resetSuccessMessage={setEmailSentSuccessMessage}
      />
    );
  }

  if (redirectInProgress) {
    return (
      <RedirectingPleaseWaitCard
        message="Taking you to the dashboard."
        heading="Signing you in"
      />
    );
  }

  return (
    <AuthCard
      title={`Sign in to ${PRODUCT_NAME}`}
      description="Email and password, magic link, or OAuth."
      footer={
        <p className="w-full text-center text-sm text-muted-foreground">
          New to {PRODUCT_NAME}?{' '}
          <Button variant="link" className="h-auto px-0" asChild>
            <Link href="/sign-up">Create an account</Link>
          </Button>
        </p>
      }
    >
      <AuthMethodTabs layoutId="login-auth-method">
        {(activeTab) => {
          if (activeTab === 'password') {
            return (
              <EmailAndPassword
                isLoading={passwordStatus === 'executing'}
                onSubmit={(data) => executePassword(data)}
                view="sign-in"
              />
            );
          }

          if (activeTab === 'magic-link') {
            return (
              <Email
                onSubmit={(email) => executeMagicLink({ email, next })}
                isLoading={magicLinkStatus === 'executing'}
                view="sign-in"
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
