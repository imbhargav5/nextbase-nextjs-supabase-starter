import { MarketingSiteShell } from '@/components/marketing/marketing-site-shell';
import { type ReactNode } from 'react';

export default function ExternalLayout({ children }: { children: ReactNode }) {
  return <MarketingSiteShell>{children}</MarketingSiteShell>;
}
