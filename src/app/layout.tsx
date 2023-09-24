import { ClientLayout } from './ClientLayout';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import Banner from './Banner';
import { Navbar } from './Navbar';
import Providers from './providers';

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
    <html
      lang="en"
      className={'light' + `${inter.variable} ${roboto_mono.variable}`}
      style={{ colorScheme: 'light' }}
    >
      <head />
      <body>
        <Providers>
          <Banner />
          <div className="space-y-4">
            <Navbar />
            <ClientLayout>{children}</ClientLayout>
          </div>
        </Providers>
      </body>
    </html>
  );
}
