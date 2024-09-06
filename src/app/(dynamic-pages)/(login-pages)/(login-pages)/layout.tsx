import { ClientLayout } from './ClientLayout';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
