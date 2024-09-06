import Footer from '@/components/Footer';
import { Inter, Roboto_Mono } from 'next/font/google';
import { ClientLayout } from './ClientLayout';
import './globals.css';
import { ExternalNavigation } from './Navbar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const metadata = {
  title: 'Nextbase Open source starter',
  description: 'Built with Next.js, Supabase, and Tailwind CSS',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <head />
      <body>
        <div className="flex pt-2 flex-col min-h-screen bg-white dark:bg-gray-900">
          <ExternalNavigation />
          <ClientLayout>{children}</ClientLayout>
          <Footer />
        </div>
      </body>
    </html>
  );
}
