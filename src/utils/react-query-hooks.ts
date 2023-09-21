/* ==================== */
/* AUTH */
/* ==================== */

import { supabaseUserClientComponentClient } from '@/supabase-clients/supabaseUserClientComponentClient';
import { AuthProvider } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import {
  signInWithMagicLink,
  signInWithPassword,
  resetPassword,
  updatePassword,
  signInWithProvider,
  signUp,
} from './supabase-queries';

/* ==================== */
/* AUTH */
/* ==================== */

export const useSignInWithMagicLink = ({
  onSuccess,
  onMutate,
  onError,
}: {
  onSuccess?: () => void;
  onMutate?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async ({ email }: { email: string }) => {
      return signInWithMagicLink(supabaseUserClientComponentClient, email);
    },
    {
      onMutate: () => {
        toastRef.current = toast.loading('Sending magic link...');
        onMutate?.();
      },
      onSuccess: () => {
        toast.success('Check your email for the magic link!', {
          id: toastRef.current ?? undefined,
        });

        toastRef.current = null;
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(String(error), {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
        onError?.(error);
      },
    }
  );
};

export const useSignInWithPassword = ({
  onSuccess,
  onMutate,
  onError,
}: {
  onSuccess?: () => void;
  onMutate?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async ({ email, password }: { email: string; password: string }) => {
      return signInWithPassword(
        supabaseUserClientComponentClient,
        email,
        password
      );
    },
    {
      onMutate: () => {
        toastRef.current = toast.loading('Signing in...');
        onMutate?.();
      },
      onSuccess: () => {
        toast.success('Signed in!', {
          id: toastRef.current ?? undefined,
        });

        toastRef.current = null;
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(String(error), {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
        onError?.(error);
      },
    }
  );
};

export const useResetPassword = ({
  onSuccess,
  onMutate,
  onError,
}: {
  onSuccess?: () => void;
  onMutate?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async ({ email }: { email: string }) => {
      return resetPassword(supabaseUserClientComponentClient, email);
    },
    {
      onMutate: () => {
        toastRef.current = toast.loading('Sending password reset email...');
        onMutate?.();
      },
      onSuccess: () => {
        toast.success('Check your email for the password reset link!', {
          id: toastRef.current ?? undefined,
        });

        toastRef.current = null;
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(String(error), {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
        onError?.(error);
      },
    }
  );
};

export const useUpdatePassword = ({
  onSuccess,
  onMutate,
  onError,
}: {
  onSuccess?: () => void;
  onMutate?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async ({ password }: { password: string }) => {
      return updatePassword(supabaseUserClientComponentClient, password);
    },
    {
      onMutate: () => {
        toastRef.current = toast.loading('Updating password...');
        onMutate?.();
      },
      onSuccess: () => {
        toast.success('Password updated!', {
          id: toastRef.current ?? undefined,
        });

        toastRef.current = null;
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(String(error), {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
        onError?.(error);
      },
    }
  );
};

export const useSignInWithProvider = () => {
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async ({ provider }: { provider: AuthProvider }) => {
      return signInWithProvider(supabaseUserClientComponentClient, provider);
    },
    {
      onMutate: ({ provider }) => {
        toastRef.current = toast.loading(`Signing in with ${provider}...`);
      },
    }
  );
};

export const useSignUp = ({
  onSuccess,
  onMutate,
  onError,
}: {
  onSuccess?: () => void;
  onMutate?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async ({ email, password }: { email: string; password: string }) => {
      return signUp(supabaseUserClientComponentClient, email, password);
    },
    {
      onMutate: () => {
        toastRef.current = toast.loading('Signing up...');
        onMutate?.();
      },
      onSuccess: () => {
        toast.success('Signed up!', {
          id: toastRef.current ?? undefined,
        });

        toastRef.current = null;
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(String(error), {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
        onError?.(error);
      },
    }
  );
};
