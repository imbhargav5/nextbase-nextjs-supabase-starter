'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { T } from '@/components/ui/Typography';
import { Label } from '@/components/ui/label';
import { CSSProperties, useState } from 'react';

export const Password = ({
  onSubmit,
  isLoading,
  successMessage,
  label = 'Password',
  buttonLabel = 'Update',
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
  const [password, setPassword] = useState<string>('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(password);
      }}
      className={className}
      style={style}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-muted-foreground">
            {label}
          </Label>
          <div>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              disabled={isLoading}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
        </div>
        <div>
          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading ? (
              <>
                <Spinner className="h-4 w-4 mr-2" />
                <span>Loading...</span>
              </>
            ) : (
              buttonLabel
            )}
          </Button>
        </div>
        <div>
          {successMessage ? (
            <T.P className="text-sm text-green-500 dark:text-green-400 text-center">
              {successMessage}
            </T.P>
          ) : null}
        </div>
      </div>
    </form>
  );
};
