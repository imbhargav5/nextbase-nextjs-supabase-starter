// do not cache this layout
export const dynamic = 'force-dynamic';

export const metadata = {
  icons: {
    icon: '/images/logo-black-main.ico',
  },
  title: 'Nextbase Open source',
  description: 'Nextbase Open source',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
