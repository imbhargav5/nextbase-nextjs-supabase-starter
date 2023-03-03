import { PropsOf } from '@headlessui/react/dist/types';
import { useState } from 'react';
import { Button } from '../Button';

export const Password = ({
  onSubmit,
  isLoading,
  successMessage,
  label = 'Password',
  buttonLabel = 'Update',
  withMaintenanceMode,
}: {
  onSubmit: (password: string) => void;
  isLoading: boolean;
  successMessage?: string;
  label?: string;
  buttonLabel?: string;
} & Pick<PropsOf<typeof Button>, 'withMaintenanceMode'>) => {
  const [password, setPassword] = useState<string>('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(password);
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
              id="password"
              name="password"
              type="password"
              value={password}
              disabled={isLoading}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="email"
              required
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          {isLoading ? (
            <Button
              withMaintenanceMode={withMaintenanceMode}
              disabled
              type="submit"
              className="flex w-full justify-center rounded border border-transparent cursor-not-allowed bg-yellow-300 py-2 px-4 text-sm font-medium text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Loading...
            </Button>
          ) : (
            <Button
              withMaintenanceMode={withMaintenanceMode}
              type="submit"
              className="flex w-full justify-center rounded border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {buttonLabel}
            </Button>
          )}
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
