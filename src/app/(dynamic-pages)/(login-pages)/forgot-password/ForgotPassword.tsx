'use client';
import { Email } from '@/components/Auth/Email';
import { T } from '@/components/ui/Typography';
import { useResetPassword } from '@/utils/react-query-hooks';
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
        <div className="flex flex-col items-start gap-0 w-[320px]">
          <T.H4>Forgot Password</T.H4>
          <T.P className="text-muted-foreground">
            Enter your email to recieve a Magic Link to reset your password.
          </T.P>
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
