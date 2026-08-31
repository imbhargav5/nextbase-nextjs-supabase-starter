'use client';

import { Mail } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';

export const Email = ({
  onSubmit,
  view,
  isLoading,
  successMessage,
  label = 'Email address',
  defaultValue,
  className,
  style,
}: {
  onSubmit: (email: string) => void;
  view: 'sign-in' | 'sign-up' | 'update-email' | 'forgot-password';
  isLoading: boolean;
  successMessage?: string | null;
  label?: string;
  defaultValue?: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const [email, setEmail] = useState(defaultValue ?? '');

  const buttonLabelText = useMemo(() => {
    switch (view) {
      case 'sign-in':
        return 'Send magic link';
      case 'sign-up':
        return 'Sign up with magic link';
      case 'update-email':
        return 'Update email';
      case 'forgot-password':
        return 'Send reset link';
    }
  }, [view]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(email);
      }}
      data-testid="magic-link-form"
      className={className}
      style={style}
    >
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor={`${view}-email`}>{label}</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Mail aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id={`${view}-email`}
              name="email"
              type="email"
              value={email}
              disabled={isLoading}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="email@example.com"
              required
            />
          </InputGroup>
        </Field>
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? <Spinner aria-hidden="true" /> : null}
          {isLoading ? 'Sending...' : buttonLabelText}
        </Button>
        {successMessage ? (
          <p className="text-center text-sm text-muted-foreground" role="status">
            {successMessage}
          </p>
        ) : null}
      </FieldGroup>
    </form>
  );
};
