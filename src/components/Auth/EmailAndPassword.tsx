import { Button } from '@/components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { ComponentProps } from 'react';

export const EmailAndPassword = ({
  onSubmit,
  view,
  isLoading,
}: {
  onSubmit: (data: { email: string; password: string }) => void;
  view: 'sign-in' | 'sign-up';
  isLoading: boolean;
} & ComponentProps<typeof Button>) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          email,
          password,
        });
      }}
      data-testid="password-form"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-foreground">
            Email address
          </Label>
          <div className="mt-1">
            <InputGroup>
              <InputGroupAddon>
                <Mail className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupInput
                id={`${view}-email`}
                name="email"
                type="email"
                disabled={isLoading}
                value={email}
                data-strategy="email-password"
                placeholder="placeholder@email.com"
                onChange={(event) => setEmail(event.target.value)}
                autoComplete={'email'}
                required
              />
            </InputGroup>
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="password" className="text-foreground">
            Password
          </Label>
          <div className="mt-1">
            <InputGroup>
              <InputGroupAddon>
                <Lock className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupInput
                id={`${view}-password`}
                name="password"
                type="password"
                disabled={isLoading}
                value={password}
                placeholder="Type your password"
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={
                  view === 'sign-in' ? 'current-password' : 'new-password'
                }
                required
              />
            </InputGroup>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {view === 'sign-in' ? (
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-muted-foreground dark:hover:text-gray-600 hover:text-foreground"
              >
                Forgot your password?
              </Link>
            </div>
          ) : null}
        </div>
        <div className="space-y-2">
          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading ? (
              <>
                <Spinner className="h-4 w-4 mr-2" />
                <span>Loading...</span>
              </>
            ) : (
              <span>{view === 'sign-in' ? 'Login' : 'Sign up'}</span>
            )}
          </Button>
          <div className="w-full text-center">
            {view === 'sign-in' ? (
              <div className="text-sm">
                <Link
                  href="/sign-up"
                  className="font-medium text-muted-foreground hover:text-foreground"
                >
                  Don't have an account? Sign up
                </Link>
              </div>
            ) : (
              <div className="text-sm">
                <Link
                  href="/login"
                  className="font-medium text-muted-foreground hover:text-foreground"
                >
                  Already have an account? Log in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
