'use client';
import { createContext, useContext } from 'react';

type OrganizationIdLayoutContextType = {
  organizationId: string;
};
export const OrganizationIdLayoutContext =
  createContext<OrganizationIdLayoutContextType>({
    organizationId: '',
  });

export function useOrganizationIdLayoutContext() {
  return useContext(OrganizationIdLayoutContext);
}

export function OrganizationIdLayoutContextProvider({
  children,
  organizationId,
}: {
  children: React.ReactNode;
  organizationId: string;
}) {
  return (
    <OrganizationIdLayoutContext.Provider
      value={{ organizationId: organizationId }}
    >
      {children}
    </OrganizationIdLayoutContext.Provider>
  );
}
