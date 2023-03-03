'use client';

import { MaintenanceModeBanner } from '@/components/presentational/tailwind/MaintenanceModeBanner';
import { useMaintenanceMode } from '@/contexts/MaintenanceModeContext';
import { ReactNode, useEffect } from 'react';
import SignInGraphic from '@public/mockups/sign-in-graphic.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const initialIsAppInMaintenanceMode = useMaintenanceMode();
  const router = useRouter();
  useEffect(() => {
    router.prefetch('/dashboard');
  }, []);
  return (
    <div
      className="grid h-screen"
      style={{
        gridTemplateRows: 'auto 1fr',
      }}
    >
      <div className="row-auto">
        <MaintenanceModeBanner
          initialIsAppInMaintenanceMode={initialIsAppInMaintenanceMode}
        />
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div className="text-center flex flex-col items-center justify-center space-y-8 border-r border-blue-100">
          <div>{children}</div>
        </div>
        <div className="relative bg-gray-900 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1515266591878-f93e32bc5937?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
            className="absolute opacity-10 object-center w-full h-full object-cover inset-0"
          />
          <div
            className="grid z-10  space-y-4 maxW"
            style={{
              width: 480,
              height: 'auto',
              maxWidth: '90%',
            }}
          >
            <Image src={SignInGraphic} alt="auth-graphic" />
          </div>
        </div>
      </div>
    </div>
  );
}
