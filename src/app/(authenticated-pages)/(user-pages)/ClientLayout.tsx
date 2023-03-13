'use client';
import { Anchor } from '@/components/Anchor';
import { AppSidebar } from '@/components/presentational/tailwind/Sidebars/AppSidebar';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { Table } from '@/types';
import { getUserAvatarUrl } from '@/utils/helpers';
import { useState } from 'react';
import { UserOnboardingFlow } from './UserOnboardingFlow';
import ReactNoSSR from 'react-no-ssr';
import { useWindowSize } from 'rooks';
import Confetti from 'react-confetti';
import { useUserProfile } from '@/utils/react-query-hooks';
import { PRODUCT_NAME } from '@/constants';
import { UserSidebarMenuNew } from '@/components/presentational/tailwind/UserSidebarMenu';

export function ClientLayout({
  children,
  isUserAppAdmin,
  userProfile: initialUserProfile,
}: {
  children: React.ReactNode;
  isUserAppAdmin: boolean;
  userProfile: Table<'user_profiles'>;
}) {
  const user = useLoggedInUser();
  const { data } = useUserProfile(initialUserProfile);
  const userProfile = data ?? initialUserProfile;
  const avatarUrl = getUserAvatarUrl({
    email: user.email,
    profileAvatarUrl: userProfile.avatar_url,
  });
  const { innerHeight, innerWidth } = useWindowSize();

  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  if (!userProfile.full_name) {
    return (
      <UserOnboardingFlow
        onSuccess={() => {
          setShowConfetti(true);
        }}
        userProfile={userProfile}
      />
    );
  }

  return (
    <div
      className="h-screen grid overflow-hidden"
      style={{
        gridTemplateRows: 'auto 1fr',
      }}
    >
      <div
        className="bg-gray-100 space-x-2 items-center grid grid-cols-4 px-2 py-1"
        style={{
          gridTemplateColumns: 'auto auto 1fr auto',
        }}
      >
        <div className="flex px-4 items-center">
          <Anchor
            href="/app_admin"
            className="text-gray-900 text-sm font-semibold flex items-center space-x-2"
          >
            <span>{PRODUCT_NAME}</span>
          </Anchor>
        </div>
        <AppSidebar isUserAppAdmin={isUserAppAdmin} />
        <div />
        <UserSidebarMenuNew
          avatarUrl={avatarUrl}
          userFullname={userProfile.full_name}
        />
        {/* <SidebarBottom
          avatarUrl={avatarUrl}
          userFullname={userProfile.full_name}
        /> */}
      </div>
      <div className="overflow-auto bg-white  h-full">{children}</div>
      <ReactNoSSR>
        {showConfetti ? (
          <Confetti
            confettiSource={{
              x: innerWidth / 2,
              y: innerHeight / 3,
              w: 0,
              h: 0,
            }}
            numberOfPieces={150}
            gravity={0.1}
            initialVelocityY={20}
            initialVelocityX={20}
            recycle={false}
            tweenDuration={1000}
            run={true}
            width={innerWidth}
            height={innerHeight}
          />
        ) : null}{' '}
      </ReactNoSSR>
    </div>
  );
}
