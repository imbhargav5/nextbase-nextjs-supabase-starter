
import { ExternalNavigation } from '@/app/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ExternalNavigation />
      <div className="max-w-xl">{children}</div>
    </>
  );
}
