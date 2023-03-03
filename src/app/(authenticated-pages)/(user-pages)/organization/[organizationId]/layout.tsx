import { getOrganizationById } from '@/utils/supabase-queries';
import createClient from '@/utils/supabase-server';
import { ReactNode } from 'react';
import { OrganizationClientLayout } from './OrganizationClientLayout';

export default async function Layout({
  children,
  params,
}: { children: ReactNode } & {
  params: {
    organizationId: string;
  };
}) {
  const supabase = createClient();
  const organizationByIdData = await getOrganizationById(
    supabase,
    params.organizationId
  );
  return (
    <OrganizationClientLayout
      initialOrganizationByIdData={organizationByIdData}
    >
      {children}
    </OrganizationClientLayout>
  );
}
