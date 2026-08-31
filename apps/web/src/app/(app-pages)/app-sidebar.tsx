import { Suspense } from 'react';
import Link from 'next/link';

import { Brand } from '@/components/brand';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { getCachedLoggedInVerifiedSupabaseUser } from '@/rsc-data/supabase';
import { AppSidebarContent } from './app-sidebar-client';

async function SidebarHeaderContent() {
  'use cache';

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild tooltip="Nextbase home">
            <Link href="/">
              <Brand showTagline />
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}

async function SidebarContentWrapper() {
  const { user } = await getCachedLoggedInVerifiedSupabaseUser();
  return <AppSidebarContent user={user} />;
}

export async function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeaderContent />
      <Suspense fallback={null}>
        <SidebarContentWrapper />
      </Suspense>
    </Sidebar>
  );
}
