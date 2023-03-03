import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { classNames } from '@/utils/classNames';
import { Anchor } from '@/components/Anchor';

export function UserSidebarMenu() {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="absolute right-4 bottom-12 z-10 mt-2 w-56 origin-bottom-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <Anchor
                href="/settings"
                className={classNames(
                  active ? 'bg-blue-100 text-gray-900' : 'text-gray-700',
                  'block px-4 py-2 text-sm'
                )}
              >
                Account settings
              </Anchor>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Anchor
                href="/settings/security"
                className={classNames(
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'block px-4 py-2 text-sm'
                )}
              >
                Security Settings
              </Anchor>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Anchor
                href="/api/logout"
                prefetch={false}
                className={classNames(
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'block w-full px-4 py-2 text-left text-sm'
                )}
              >
                Sign out
              </Anchor>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Transition>
  );
}
