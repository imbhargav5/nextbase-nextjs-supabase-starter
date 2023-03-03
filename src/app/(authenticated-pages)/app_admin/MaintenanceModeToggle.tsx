'use client';
import H3 from '@/components/presentational/tailwind/Text/H3';
import { useMaintenanceMode } from '@/contexts/MaintenanceModeContext';
import { classNames } from '@/utils/classNames';
import {
  useDisableMaintenanceModeMutation,
  useEnableMaintenanceModeMutation,
} from '@/utils/react-query-hooks-app-admin';
import { Switch } from '@headlessui/react';

export function MaintenanceModeToggle() {
  const isInMaintenanceMode = useMaintenanceMode();

  const { mutate: enableMaintenanceModeMutation, isLoading: isEnabling } =
    useEnableMaintenanceModeMutation({});
  const { mutate: disableMaintenanceModeMutation, isLoading: isDisabling } =
    useDisableMaintenanceModeMutation({});

  const toggleMaintenanceMode = async (checked: boolean) => {
    if (checked) {
      return enableMaintenanceModeMutation();
    }
    return disableMaintenanceModeMutation();
  };

  return (
    <div className="flex space-x-4">
      <div className="space-y-4">
        <div className="space-y-2 max-w-xl">
          <H3>Maintenance mode</H3>
          <p className="text-gray-500 text-sm">
            You can put your site into maintenance mode here. This will show a
            maintenance page to all logged in users. You can modify the message
            shown in the{' '}
            <span className="bg-gray-200 text-gray-700 p-0.5 rounded">
              MaintenanceModeBanner
            </span>{' '}
            component.
          </p>
        </div>
      </div>
      <Switch.Group as="div" className="flex items-center">
        <Switch
          disabled={isEnabling || isDisabling}
          checked={isInMaintenanceMode}
          onChange={toggleMaintenanceMode}
          className={classNames(
            isInMaintenanceMode ? 'bg-green-600' : 'bg-gray-200',
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none'
          )}
        >
          <span
            aria-hidden="true"
            className={classNames(
              isInMaintenanceMode ? 'translate-x-5' : 'translate-x-0',
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
            )}
          />
        </Switch>
      </Switch.Group>
    </div>
  );
}
