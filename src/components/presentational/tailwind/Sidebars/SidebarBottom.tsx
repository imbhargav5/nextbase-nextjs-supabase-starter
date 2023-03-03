import { Menu } from '@headlessui/react';
import Image from 'next/image';
import { UserSidebarMenu } from '../UserSidebarMenu';

export const SidebarBottom = ({
  avatarUrl,
  userFullname,
}: {
  avatarUrl: string;
  userFullname: string;
}) => {
  return (
    <div className="border-t cursor-pointer border-gray-200">
      <Menu as="div" className="relative">
        <Menu.Button
          as="div"
          className="w-full items-center px-2 py-3 self-end text-sm flex space-x-2"
        >
          <Image
            width="32"
            height="32"
            src={avatarUrl}
            className="w-8 h-8 rounded-full object-cover"
            alt="User avatar"
          />
          <div className="space-y-1">
            <p className="text-xs">{userFullname}</p>
          </div>
        </Menu.Button>
        <UserSidebarMenu />
      </Menu>
    </div>
  );
};
