import { getOrganizationById } from '@/utils/supabase-queries';
import createClient from '@/utils/supabase-server';
import { ReactNode } from 'react';
import { OrganizationClientLayout } from './OrganizationClientLayout';
import { notFound } from 'next/navigation';

export default async function Layout({
  children,
  params,
}: { children: ReactNode } & {
  params: {
    organizationId: string;
  };
}) {
  try {
    const supabase = createClient();
    const organizationByIdData = await getOrganizationById(
      supabase,
      params.organizationId
    );

    return <OrganizationClientLayout>{children}</OrganizationClientLayout>;
  } catch (error) {
    return notFound();
  }
}
