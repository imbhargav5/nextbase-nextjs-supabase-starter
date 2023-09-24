'use client';

import { SunIcon, MoonIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeButton = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      aria-label="Toggle Dark Mode"
      className="flex items-center justify-center rounded-lg p-1 transition-all "
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? (
        <SunIcon className="h-5 w-5 text-orange-500" />
      ) : (
        <MoonIcon className="h-5 w-5 text-slate-800" />
      )}
    </button>
  );
};

export default ThemeButton;
