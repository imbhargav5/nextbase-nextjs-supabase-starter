'use client';
import { useGetIsAppInMaintenanceMode } from '@/utils/react-query-hooks';

export function MaintenanceModeBanner({
  initialIsAppInMaintenanceMode,
}: {
  initialIsAppInMaintenanceMode: boolean;
}) {
  const { data: isAppInMaintenanceMode } = useGetIsAppInMaintenanceMode(
    initialIsAppInMaintenanceMode
  );

  if (!isAppInMaintenanceMode) {
    return null;
  }
  return (
    <div className="flex-auto flex-grow-0 select-none opacity-75 bg-yellow-100 text-gray-900 text-xs text-center py-1 flex items-center justify-center">
      <span className="font-semibold">
        The App is currently in maintenance mode and is read-only. Please check
        back later.
      </span>
    </div>
  );
}
