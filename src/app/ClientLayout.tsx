'use client';
import { Toaster } from 'react-hot-toast';
import ReactNoSSR from 'react-no-ssr';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Create a client
const queryClient = new QueryClient();
export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-lg mx-auto py-16">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <ReactNoSSR>
        <Toaster />
      </ReactNoSSR>
    </div>
  );
};
