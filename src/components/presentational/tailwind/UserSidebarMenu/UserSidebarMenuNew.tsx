'use client';

import {
  Briefcase,
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import Image from 'next/image';
import { classNames } from '@/utils/classNames';
import { Anchor } from '@/components/Anchor';

export function UserSidebarMenuNew({
  avatarUrl,
  userFullname,
}: {
  avatarUrl: string;
  userFullname: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full items-center px-2  py-3  text-sm flex space-x-2"
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
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Anchor
              href="/settings"
              className={classNames('text-gray-700 text-sm')}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </Anchor>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Anchor
              href="/settings/security"
              className={classNames('text-gray-700 text-sm')}
            >
              <Lock className="mr-2 h-4 w-4" />
              <span>Security Settings</span>
            </Anchor>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem> */}

          {/* <DropdownMenuItem>
            <Keyboard className="mr-2 h-4 w-4" />
            <span>Keyboard shortcuts</span>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Anchor
              href="/dashboard"
              className={classNames('text-gray-700 text-sm')}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Anchor>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Anchor
              href="/organization-create"
              className={classNames('text-gray-700 text-sm')}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>New Organization</span>
            </Anchor>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Anchor
            href="/api/logout"
            className={classNames('text-gray-700 text-sm')}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </Anchor>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
