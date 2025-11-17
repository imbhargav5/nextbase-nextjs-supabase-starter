import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { getCachedLoggedInVerifiedSupabaseUser } from '@/rsc-data/supabase';
import { redirect } from 'next/navigation';
import { ReactNode, Suspense } from 'react';

async function SidebarWrapper() {
  try {
    const { user } = await getCachedLoggedInVerifiedSupabaseUser();
    return (
      <AppSidebar
        user={{
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0],
        }}
      />
    );
  } catch (error) {
    redirect('/login');
  }
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
      <Suspense
        fallback={<Sidebar variant="inset" collapsible="icon"></Sidebar>}
      >
        <SidebarWrapper />
      </Suspense>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {heading}
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
