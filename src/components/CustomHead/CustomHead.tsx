import { ReactNode } from 'react';

export function CustomHead({ children }: { children: ReactNode }) {
  return (
    <>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content="Nextbase" />
      <link rel="icon" href="/logos/nextbase.png" />
      {children}
    </>
  );
}
