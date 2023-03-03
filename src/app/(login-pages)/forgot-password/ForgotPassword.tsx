'use client';
import { Email } from '@/components/presentational/tailwind/Auth/Email';
import {
  useResetPassword,
  useSignInWithMagicLink,
} from '@/utils/react-query-hooks';
import { useState } from 'react';

export function ForgotPassword() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const magicLinkMutation = useResetPassword({
    onSuccess: () => {
      setSuccessMessage('A magic link has been sent to your email!');
    },
  });

  return (
    <div className="container h-full grid items-center text-left max-w-lg mx-auto overflow-auto">
      <div className="space-y-8 ">
        {/* <Auth providers={['twitter']} supabaseClient={supabase} /> */}
        <div className="space-y-2 ">
          <h1 className="text-2xl  text-gray-700">Reset password</h1>
          <p className="text-gray-400 max-w-sm text-sm ">
            Enter your email to receive a magic link to reset your password.
          </p>
        </div>

        <Email
          onSubmit={(email) => {
            magicLinkMutation.mutate({
              email,
            });
          }}
          successMessage={successMessage}
          isLoading={magicLinkMutation.isLoading}
          view="forgot-password"
        />
      </div>
    </div>
  );
}
