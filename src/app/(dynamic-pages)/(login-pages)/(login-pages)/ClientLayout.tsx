'use client';

import type { ReactNode } from 'react';

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full ">
      <div className="grid">
        <div className="text-center flex flex-col items-center justify-center space-y-8 h-screen">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
