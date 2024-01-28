'use client';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Create a client
const queryClient = new QueryClient();
// This layout component can be used with React state, context and more as it is a client component.
export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-1">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <Toaster />
    </main>
  );
};
