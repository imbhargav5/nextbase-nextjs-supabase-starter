import { type ReactNode } from 'react';

import Footer from '@/components/Footer';
import { SiteNavbar } from '@/components/marketing/site-navbar';

interface MarketingSiteShellProps {
  children: ReactNode;
}

export function MarketingSiteShell({ children }: MarketingSiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />
      <main className="flex-1 overflow-x-clip">{children}</main>
      <Footer />
    </div>
  );
}
