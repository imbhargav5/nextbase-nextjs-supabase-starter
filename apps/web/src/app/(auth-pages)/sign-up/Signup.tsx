'use client';

import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { AuthCard } from '@/components/Auth/AuthCard';
import { Email } from '@/components/Auth/Email';
import { EmailAndPassword } from '@/components/Auth/EmailAndPassword';
import { EmailConfirmationPendingCard } from '@/components/Auth/EmailConfirmationPendingCard';
import { RenderProviders } from '@/components/Auth/RenderProviders';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  signInWithMagicLinkAction,
  signInWithProviderAction,
  signUpAction,
} from '@/data/auth/auth';
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
      title="Register to NextBase"
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
      <Tabs defaultValue="password">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
          <TabsTrigger value="social-login">Social</TabsTrigger>
        </TabsList>
        <TabsContent value="password" className="mt-6">
          <EmailAndPassword
            isLoading={signUpStatus === 'executing'}
            onSubmit={(data) => executeSignUp({ ...data, next })}
            view="sign-up"
          />
        </TabsContent>
        <TabsContent value="magic-link" className="mt-6">
          <Email
            onSubmit={(email) => executeMagicLink({ email, next })}
            isLoading={magicLinkStatus === 'executing'}
            view="sign-up"
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
