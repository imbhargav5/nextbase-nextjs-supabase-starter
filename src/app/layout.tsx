import { ClientLayout } from './ClientLayout';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import Banner from './Banner';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <head />
      <body>
        <Banner />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
