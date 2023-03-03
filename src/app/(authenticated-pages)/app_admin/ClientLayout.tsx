'use client';
import { Anchor } from '@/components/Anchor';
import { PageHeading } from '@/components/presentational/tailwind/PageHeading/PageHeading';
import { AdminSidebar } from '@/components/presentational/tailwind/Sidebars/AdminSidebar';
import { SidebarBottom } from '@/components/presentational/tailwind/Sidebars/SidebarBottom';
import { TabsNavigation } from '@/components/presentational/tailwind/TabsNavigation';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { Table } from '@/types';
import { getUserAvatarUrl } from '@/utils/helpers';
import { useUserProfile } from '@/utils/react-query-hooks';
import { useMemo } from 'react';
import { FiBriefcase, FiServer, FiSettings, FiUsers } from 'react-icons/fi';

export function ClientLayout({
  children,
  userProfile: initialUserProfile,
}: {
  children: React.ReactNode;
  userProfile: Table<'user_profiles'>;
}) {
  const user = useLoggedInUser();

  const { data: userProfile } = useUserProfile(initialUserProfile);
  const avatarUrl = getUserAvatarUrl({
    email: user.email,
    profileAvatarUrl: userProfile.avatar_url,
  });
  const tabs = useMemo(() => {
    return [
      {
        label: 'Application Settings',
        href: `/app_admin`,
        icon: <FiSettings />,
      },
      {
        label: 'Users',
        href: `/app_admin/users`,
        icon: <FiUsers />,
      },
      {
        label: 'Organizations',
        href: `/app_admin/organizations`,
        icon: <FiBriefcase />,
      },
    ];
  }, []);

  return (
    <div className="flex h-full">
      <div
        className="w-72 bg-gray-100 space-y-2 grid grid-rows-4"
        style={{
          gridTemplateRows: 'auto auto 1fr auto',
        }}
      >
        <div className="flex px-4 h-12 items-center">
          <Anchor
            href="/app_admin"
            className="text-gray-900 text-sm font-semibold flex items-center space-x-2"
          >
            <FiServer />
            <span>Admin Panel</span>
          </Anchor>
        </div>
        <AdminSidebar />
        <div></div>
        <SidebarBottom
          avatarUrl={avatarUrl}
          userFullname={userProfile.full_name}
        />
      </div>
      <div className="py-6 flex-1">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 md:px-8 bg-white space-y-4">
          <div className="space-y-2">
            <PageHeading title="Admin Dashboard"></PageHeading>
            <p className="select-none py-1 text-xs text-gray-500 ">
              You are currently in the Application Admin Dashboard area. All
              sections of this area are protected and only application admins
              can access this.
            </p>
          </div>
          <div className="space-y-6">
            <TabsNavigation tabs={tabs} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
