'use client';

import { MaintenanceModeBanner } from '@/components/presentational/tailwind/MaintenanceModeBanner';
import { useMaintenanceMode } from '@/contexts/MaintenanceModeContext';
import { ReactNode } from 'react';

export function ClientLayout({ children }: { children: ReactNode }) {
  const initialIsAppInMaintenanceMode = useMaintenanceMode();
  return (
    <div className="flex flex-col h-full w-full">
      <MaintenanceModeBanner
        initialIsAppInMaintenanceMode={initialIsAppInMaintenanceMode}
      />
      <div className="flex-1">{children}</div>
    </div>
  );
}
