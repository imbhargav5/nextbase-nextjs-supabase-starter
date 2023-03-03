import { Switch } from '@headlessui/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function PricingModeToggle({
  mode,
  onChange,
}: {
  mode: 'month' | 'year';
  onChange: (mode: 'month' | 'year') => void;
}) {
  const enabled = mode === 'year';
  const setEnabled = (enabled: boolean) => {
    onChange(enabled ? 'year' : 'month');
  };
  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={classNames(
          enabled ? 'bg-green-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-3">
        <span className="text-sm font-medium text-gray-900">Annual</span>
        <span className="text-sm text-gray-500"> (save 10%)</span>
      </Switch.Label>
    </Switch.Group>
  );
}
