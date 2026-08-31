import Footer from '@/components/Footer';
import Navbar from '@/app/Navbar';
import { type ReactNode } from 'react';

export default function ExternalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
