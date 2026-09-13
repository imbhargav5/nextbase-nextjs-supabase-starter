'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';
import { releaseFramePreviewScrollLock } from '@/lib/kits/frame-preview-scroll-lock';

type NguyenThemeContextValue = {
  isDark: boolean;
  toggleTheme: () => void;
};

const NguyenThemeContext = createContext<NguyenThemeContextValue | null>(null);

export function useNguyenTheme() {
  const context = useContext(NguyenThemeContext);

  if (!context) {
    throw new Error('useNguyenTheme must be used within NguyenThemeProvider');
  }

  return context;
}

export function NguyenThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.body.classList.add('nguyen-template-page');
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

    const isFramePreview =
      new URLSearchParams(window.location.search).get('frame') === '1';
    if (!isFramePreview) {
      releaseFramePreviewScrollLock();
    }

    return () => {
      document.body.classList.remove('nguyen-template-page');
      document.documentElement.style.colorScheme = '';
    };
  }, [isDark]);

  return (
    <NguyenThemeContext
      value={{
        isDark,
        toggleTheme: () => setIsDark((current) => !current),
      }}
    >
      <div
        data-template="nguyen"
        data-theme={isDark ? 'dark' : 'light'}
        className={cn(
          'nguyen-template relative min-h-screen bg-background text-foreground antialiased',
          isDark && 'dark',
        )}
      >
        {children}
      </div>
    </NguyenThemeContext>
  );
}
