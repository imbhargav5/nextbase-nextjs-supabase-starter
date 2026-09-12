import Footer from '@/components/Footer';
import Navbar from '@/app/Navbar';
import { type ReactNode } from 'react';

export default function ExternalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 overflow-x-clip">{children}</main>
      <Footer />
    </div>
  );
}
