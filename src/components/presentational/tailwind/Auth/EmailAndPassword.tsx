import { Anchor } from '@/components/Anchor';
import { PropsOf } from '@headlessui/react/dist/types';
import { useState } from 'react';
import { Button } from '../Button';

export const EmailAndPassword = ({
  onSubmit,
  view,
  isLoading,
  withMaintenanceMode,
}: {
  onSubmit: (data: { email: string; password: string }) => void;
  view: 'sign-in' | 'sign-up';
  isLoading: boolean;
} & Pick<PropsOf<typeof Button>, 'withMaintenanceMode'>) => {
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
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              id={`${view}-email`}
              name="email"
              type="email"
              disabled={isLoading}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete={'email'}
              required
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              id={`${view}-password`}
              name="password"
              type="password"
              disabled={isLoading}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={
                view === 'sign-in' ? 'current-password' : 'new-password'
              }
              required
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          {view === 'sign-in' ? (
            <div className="text-sm">
              <Anchor
                href="/sign-up"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up instead?
              </Anchor>
            </div>
          ) : (
            <div className="text-sm">
              <Anchor
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Login instead?
              </Anchor>
            </div>
          )}

          {view === 'sign-in' ? (
            <div className="text-sm">
              <Anchor
                href="/forgot-password"
                className="font-medium text-gray-400 hover:text-gray-700"
              >
                Forgot your password?
              </Anchor>
            </div>
          ) : null}
        </div>
        <div>
          {isLoading ? (
            <Button
              disabled
              type="submit"
              withMaintenanceMode={withMaintenanceMode}
              className="flex w-full justify-center rounded border border-transparent cursor-not-allowed bg-yellow-300 py-2 px-4 text-sm font-medium text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Loading...
            </Button>
          ) : (
            <Button
              type="submit"
              withMaintenanceMode={withMaintenanceMode}
              className="flex w-full justify-center rounded border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {view === 'sign-in' ? 'Login' : 'Sign up'}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};
