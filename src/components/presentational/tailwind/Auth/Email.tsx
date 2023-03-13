import { Anchor } from '@/components/Anchor';
import { classNames } from '@/utils/classNames';
import { PropsOf } from '@headlessui/react/dist/types';
import { useMemo } from 'react';
import { useState } from 'react';
import { Button } from '../Button';

export const Email = ({
  onSubmit,
  view,
  isLoading,
  successMessage,
  label = 'Email address',
  withMaintenanceMode,
  defaultValue,
}: {
  onSubmit: (email: string) => void;
  view: 'sign-in' | 'sign-up' | 'update-email' | 'forgot-password';
  isLoading: boolean;
  successMessage?: string;
  label?: string;
  defaultValue?: string;
} & Pick<PropsOf<typeof Button>, 'withMaintenanceMode'>) => {
  const [email, setEmail] = useState<string>(defaultValue ?? '');

  const buttonLabelText = useMemo(() => {
    switch (view) {
      case 'sign-in':
        return 'Login';
      case 'sign-up':
        return 'Sign up';
      case 'update-email':
        return 'Update Email';
      case 'forgot-password':
        return 'Reset password';
    }
  }, [view]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(email);
      }}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
          <div>
            <input
              id={`${view}-email`}
              name="email"
              type="email"
              value={email}
              disabled={isLoading}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete={'email'}
              required
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          {view === 'forgot-password' ? (
            <div className="text-sm">
              <Anchor
                href="/"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Log in instead?
              </Anchor>
            </div>
          ) : null}
        </div>
        <div>
          <Button
            withMaintenanceMode={withMaintenanceMode}
            type="submit"
            className={classNames(
              'flex w-full justify-center rounded border border-transparent py-2 px-4 text-sm font-medium  shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
              isLoading
                ? 'bg-yellow-300  focus:ring-yellow-500 text-black'
                : 'bg-blue-500  hover:bg-blue-600  text-white focus:ring-blue-500 '
            )}
          >
            {buttonLabelText}
          </Button>
        </div>
        <div>
          {successMessage ? (
            <p className="text-sm text-green-500 text-center">
              {successMessage}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
};
