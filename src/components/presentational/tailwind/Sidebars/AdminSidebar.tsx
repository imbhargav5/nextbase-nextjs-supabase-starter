'use client';
import { Anchor } from '@/components/Anchor';
import { classNames } from '@/utils/classNames';
import { useUser } from '@supabase/auth-helpers-react';
import { usePathname } from 'next/navigation';
import { FiArrowLeft, FiBriefcase, FiSettings, FiUsers } from 'react-icons/fi';

function Links() {
  const user = useUser();

  return (
    <div className="space-y-1 w-full">
      {user ? (
        <>
          <SidebarLink
            href="/dashboard"
            icon={<FiArrowLeft />}
            label="Back to Dashboard"
          />
          <SidebarLink
            href="/app_admin"
            icon={<FiSettings />}
            label="Application Settings"
          />
          <SidebarLink
            href="/app_admin/users"
            icon={<FiUsers />}
            label="Users"
          />
          <SidebarLink
            href="/app_admin/organizations"
            icon={<FiBriefcase />}
            label="Organizations"
          />
        </>
      ) : (
        <Anchor
          href="/login"
          className="flex py-1 text-gray-700 text-sm hover:text-gray-900"
        >
          Login
        </Anchor>
      )}
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Anchor
      href={href}
      className={classNames(
        `flex rounded px-2 py-1 items-center space-x-2 hover:bg-gray-200`,
        isActive ? 'bg-gray-200' : 'bg-transparent'
      )}
    >
      <span className="text-gray-900">{icon}</span>
      <span className="text-gray-600 text-sm hover:text-gray-900 ">
        {label}
      </span>
    </Anchor>
  );
}

export function AdminSidebar() {
  return (
    <nav className="flex px-2 items-center w-full">
      <Links />
      <div className="flex-grow"></div>
    </nav>
  );
}
