'use client';

import { LockKeyhole } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';

export const Password = ({
  onSubmit,
  isLoading,
  successMessage,
  label = 'Password',
  buttonLabel = 'Update password',
  className,
  style,
}: {
  onSubmit: (password: string) => void;
  isLoading: boolean;
  successMessage?: string;
  label?: string;
  buttonLabel?: string;
  className?: string;
  style?: CSSProperties;
}) => {
  const [password, setPassword] = useState('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(password);
      }}
      className={className}
      style={style}
    >
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="password">{label}</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <LockKeyhole aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id="password"
              name="password"
              type="password"
              value={password}
              disabled={isLoading}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="Create a secure password"
              required
            />
          </InputGroup>
        </Field>
        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? <Spinner aria-hidden="true" /> : null}
          {isLoading ? 'Updating...' : buttonLabel}
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
