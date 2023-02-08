import { ClientLayout } from './ClientLayout';
import './output.css';
// do not cache this layout
export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
