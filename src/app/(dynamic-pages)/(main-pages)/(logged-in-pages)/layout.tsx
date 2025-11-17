import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { getCachedIsUserLoggedIn } from '@/rsc-data/supabase';
import { redirect } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import { AppSidebar } from './app-sidebar';

async function ChildrenWrapper({ children }: { children: ReactNode }) {
  const isLoggedIn = await getCachedIsUserLoggedIn();
  if (!isLoggedIn) {
    redirect('/login');
  }
  return <>{children}</>;
}

export default async function Layout({
  children,
  heading,
}: {
  children: ReactNode;
  heading: ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {heading}
        </header>
        <Suspense fallback={null}>
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
