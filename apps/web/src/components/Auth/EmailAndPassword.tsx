'use client';

import { LockKeyhole, Mail } from 'lucide-react';
import type { ComponentProps } from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export const EmailAndPassword = ({
  onSubmit,
  view,
  isLoading,
  className,
  ...buttonProps
}: {
  onSubmit: (data: { email: string; password: string }) => void;
  view: 'sign-in' | 'sign-up';
  isLoading: boolean;
} & Omit<ComponentProps<typeof Button>, 'children' | 'type'>) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ email, password });
      }}
      data-testid="password-form"
    >
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor={`${view}-email`}>Email address</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Mail aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id={`${view}-email`}
              name="email"
              type="email"
              disabled={isLoading}
              value={email}
              data-strategy="email-password"
              placeholder="email@example.com"
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor={`${view}-password`}>Password</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <LockKeyhole aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id={`${view}-password`}
              name="password"
              type="password"
              disabled={isLoading}
              value={password}
              placeholder={view === 'sign-in' ? 'Enter your password' : 'Create a password'}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={view === 'sign-in' ? 'current-password' : 'new-password'}
              required
            />
          </InputGroup>
          {view === 'sign-in' ? (
            <div className="flex justify-end">
              <Button variant="link" className="h-auto px-0 text-xs" asChild>
                <a href="/forgot-password">Forgot password?</a>
              </Button>
            </div>
          ) : null}
        </Field>
        <Button
          {...buttonProps}
          disabled={isLoading || buttonProps.disabled}
          type="submit"
          className={cn('w-full', className)}
        >
          {isLoading ? <Spinner aria-hidden="true" /> : null}
          {isLoading
            ? 'Loading...'
            : view === 'sign-in'
              ? 'Sign in'
              : 'Create account'}
        </Button>
      </FieldGroup>
    </form>
  );
};
