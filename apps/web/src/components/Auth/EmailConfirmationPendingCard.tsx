'use client';
import { ArrowLeftIcon, Fingerprint, MailIcon } from 'lucide-react';

import type React from 'react';

import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

interface IConfirmationPendingCardProps {
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
}: IConfirmationPendingCardProps) {
  const router = useRouter();
  return (
    <div>
      <Card className="w-full md:min-w-[440px] mx-auto mt-10 items-center">
        <CardHeader>
          {type === 'reset-password' ? (
            <Fingerprint className="size-10 mx-auto mb-4" />
          ) : (
            <MailIcon className="size-10 mx-auto mb-4" />
          )}
          <CardTitle className="text-center">{heading}</CardTitle>
          <CardDescription className="text-center">{message}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button
            variant="secondary"
            onClick={() => {
              resetSuccessMessage(null);
              router.push(
                type === 'login'
                  ? '/login'
                  : type === 'sign-up'
                  ? '/sign-up'
                  : '/login'
              );
            }}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            {type === 'sign-up' ? 'Back to sign up' : 'Back to login'}
          </Button>
        </CardFooter>
      </Card>
      {type === 'sign-up' && resendEmail && (
        <p className="text-center mt-4">
          Didnt receive the email?{' '}
          <Button
            className="font-bold px-0"
            variant="link"
            onClick={resendEmail}
          >
            Click to resend
          </Button>
        </p>
      )}
    </div>
  );
}
