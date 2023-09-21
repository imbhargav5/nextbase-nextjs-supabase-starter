import { classNames } from '@/utils/classNames';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export const EmailAndPassword = ({
  onSubmit,
  view,
  isLoading,
}: {
  onSubmit: (data: { email: string; password: string }) => void;
  view: 'sign-in' | 'sign-up';
  isLoading: boolean;
}) => {
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
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-muted-foreground">
            Email address
          </Label>
          <div className="mt-1">
            <input
              id={`${view}-email`}
              name="email"
              type="email"
              disabled={isLoading}
              value={email}
              placeholder="placeholder@email.com"
              onChange={(event) => setEmail(event.target.value)}
              autoComplete={'email'}
              required
              className="block w-full appearance-none rounded-md border bg-gray-50/10 dark:bg-gray-800/20 h-10 px-3 py-3 placeholder-muted-foreground shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="password" className="text-muted-foreground">
            Password
          </Label>
          <div className="mt-1">
            <input
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
              className="block w-full appearance-none rounded-md border bg-gray-50/10 dark:bg-gray-800/20 h-10 px-3 py-3 placeholder-muted-foreground shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          {view === 'sign-in' ? (
            <div className="text-sm">
              <Link
                href="/sign-up"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
              >
                Sign up instead?
              </Link>
            </div>
          ) : (
            <div className="text-sm">
              <Link
                href="/login"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
              >
                Login instead?
              </Link>
            </div>
          )}

          {view === 'sign-in' ? (
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-muted-foreground dark:hover:text-gray-600"
              >
                Forgot your password?
              </Link>
            </div>
          ) : null}
        </div>
        <div>
          {isLoading ? (
            <Button
              disabled
              type="submit"
              className={classNames(
                'flex w-full justify-center rounded-lg border border-transparent py-3 text-white dark:text-black px-4 text-sm font-medium  shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
                isLoading
                  ? 'bg-yellow-300 dark:bg-yellow-700 '
                  : 'bg-black dark:bg-white hover:bg-gray-900 dark:hover:bg-gray-100  '
              )}
            >
              Loading...
            </Button>
          ) : (
            <Button
              type="submit"
              className={classNames(
                'flex w-full justify-center rounded-lg border border-transparent py-2 text-white dark:text-black px-4 text-sm font-medium  shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
                isLoading
                  ? 'bg-yellow-300 dark:bg-yellow-700 '
                  : 'bg-black dark:bg-white hover:bg-gray-900 dark:hover:bg-gray-100  '
              )}
            >
              {view === 'sign-in' ? 'Login' : 'Sign up'}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};
