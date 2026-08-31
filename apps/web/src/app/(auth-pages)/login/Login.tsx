'use client';

import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { AuthCard } from '@/components/Auth/AuthCard';
import { Email } from '@/components/Auth/Email';
import { EmailAndPassword } from '@/components/Auth/EmailAndPassword';
import { EmailConfirmationPendingCard } from '@/components/Auth/EmailConfirmationPendingCard';
import { RedirectingPleaseWaitCard } from '@/components/Auth/RedirectingPleaseWaitCard';
import { RenderProviders } from '@/components/Auth/RenderProviders';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  signInWithMagicLinkAction,
  signInWithPasswordAction,
  signInWithProviderAction,
} from '@/data/auth/auth';
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
        message="Please wait while we open your protected workspace."
        heading="Opening your dashboard"
      />
    );
  }

  return (
    <AuthCard
      title="Login to NextBase"
      description="Choose the sign-in method that works best for you."
      footer={
        <p className="w-full text-center text-sm text-muted-foreground">
          New to Nextbase?{' '}
          <Button variant="link" className="h-auto px-0" asChild>
            <Link href="/sign-up">Create an account</Link>
          </Button>
        </p>
      }
    >
      <Tabs defaultValue="password">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
          <TabsTrigger value="social-login">Social</TabsTrigger>
        </TabsList>
        <TabsContent value="password" className="mt-6">
          <EmailAndPassword
            isLoading={passwordStatus === 'executing'}
            onSubmit={(data) => executePassword(data)}
            view="sign-in"
          />
        </TabsContent>
        <TabsContent value="magic-link" className="mt-6">
          <Email
            onSubmit={(email) => executeMagicLink({ email, next })}
            isLoading={magicLinkStatus === 'executing'}
            view="sign-in"
          />
        </TabsContent>
        <TabsContent value="social-login" className="mt-6">
          <RenderProviders
            providers={['google', 'github', 'twitter']}
            isLoading={providerStatus === 'executing'}
            onProviderLoginRequested={(
              provider: Extract<AuthProvider, 'google' | 'github' | 'twitter'>
            ) => executeProvider({ provider, next })}
          />
        </TabsContent>
      </Tabs>
    </AuthCard>
  );
}
