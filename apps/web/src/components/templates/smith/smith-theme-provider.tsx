import { Instrument_Serif, Inter } from 'next/font/google';
import { type ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-smith-body',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic', 'normal'],
  variable: '--font-smith-display',
});

interface SmithThemeProviderProps {
  children: ReactNode;
}

export function SmithThemeProvider({ children }: SmithThemeProviderProps) {
  return (
    <div
      className={`smith-template min-h-screen ${inter.variable} ${instrumentSerif.variable} font-[family-name:var(--font-smith-body)]`}
    >
      {children}
    </div>
  );
}

export function smithDisplayClass() {
  return 'font-[family-name:var(--font-smith-display)] italic';
}
