import { useGetIsAppInMaintenanceMode } from '@/utils/react-query-hooks';
import { createContext, useContext } from 'react';

export const MaintenanceModeContext = createContext<boolean>(false);

export function useMaintenanceMode() {
  return useContext(MaintenanceModeContext);
}

export function MaintenanceModeContextProvider({
  children,
  initialIsAppInMaintenanceMode,
}: {
  children: React.ReactNode;
  initialIsAppInMaintenanceMode: boolean;
}) {
  const { data: isInMaintenanceMode } = useGetIsAppInMaintenanceMode(
    initialIsAppInMaintenanceMode
  );
  return (
    <MaintenanceModeContext.Provider value={isInMaintenanceMode}>
      {children}
    </MaintenanceModeContext.Provider>
  );
}
