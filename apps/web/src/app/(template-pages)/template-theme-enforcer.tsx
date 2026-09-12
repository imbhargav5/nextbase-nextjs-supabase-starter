'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

export function TemplateThemeEnforcer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setTheme, theme } = useTheme();
  const previousThemeRef = useRef<string | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (previousThemeRef.current === undefined && theme) {
      previousThemeRef.current = theme;
    }

    if (theme !== 'dark') {
      setTheme('dark');
    }
  }, [mounted, setTheme, theme]);

  useEffect(() => {
    return () => {
      const previousTheme = previousThemeRef.current;

      if (previousTheme && previousTheme !== 'dark') {
        setTheme(previousTheme);
      }
    };
  }, [setTheme]);

  return children;
}
