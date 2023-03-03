import { ReactNode } from 'react';

export type TabProps = { label: string; href: string; icon: ReactNode };

export type TabsNavigationProps = {
  tabs: Array<TabProps>;
};
