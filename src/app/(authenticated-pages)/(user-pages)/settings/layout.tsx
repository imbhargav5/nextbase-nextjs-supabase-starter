'use client';
import { PageHeading } from '@/components/presentational/tailwind/PageHeading';
import { TabsNavigation } from '@/components/presentational/tailwind/TabsNavigation';
import { useMemo } from 'react';
import { FiLock, FiUser } from 'react-icons/fi';

export default function UserSettingsClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tabs = useMemo(() => {
    return [
      {
        label: 'Account Settings',
        href: `/settings`,
        icon: <FiUser />,
      },
      {
        label: 'Security',
        href: `/settings/security`,
        icon: <FiLock />,
      },
    ];
  }, []);

  return (
    <div className="space-y-6">
      <PageHeading title="User Settings" />
      <TabsNavigation tabs={tabs} />
      {children}
    </div>
  );
}
