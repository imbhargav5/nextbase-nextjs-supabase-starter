'use client';

import { motion } from 'motion/react';
import { useState, type ReactNode } from 'react';

import {
  slidingHighlightTransition,
} from '@/components/ui/sliding-highlight';
import { cn } from '@/lib/utils';

const AUTH_METHOD_TABS = [
  { value: 'password', label: 'Password' },
  { value: 'magic-link', label: 'Magic Link' },
  { value: 'social-login', label: 'Social' },
] as const;

export type AuthMethodTabValue = (typeof AUTH_METHOD_TABS)[number]['value'];

interface AuthMethodTabsProps {
  layoutId: string;
  defaultValue?: AuthMethodTabValue;
  children: (activeTab: AuthMethodTabValue) => ReactNode;
}

export function AuthMethodTabs({
  layoutId,
  defaultValue = 'password',
  children,
}: AuthMethodTabsProps) {
  const [activeTab, setActiveTab] = useState<AuthMethodTabValue>(defaultValue);

  return (
    <div>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="grid h-10 w-full grid-cols-3 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
      >
        {AUTH_METHOD_TABS.map((tab) => {
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              id={`${layoutId}-${tab.value}-tab`}
              aria-selected={isActive}
              aria-controls={`${layoutId}-${tab.value}-panel`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'relative inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-sm bg-background shadow-sm"
                  transition={slidingHighlightTransition}
                />
              ) : null}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${layoutId}-${activeTab}-panel`}
        aria-labelledby={`${layoutId}-${activeTab}-tab`}
        className="mt-6"
      >
        {children(activeTab)}
      </div>
    </div>
  );
}
