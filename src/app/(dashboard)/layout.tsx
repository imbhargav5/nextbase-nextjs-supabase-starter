import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { Toaster } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 border-r bg-card">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Desktop Navbar */}
        <div className="hidden lg:block border-b bg-card">
          <Navbar />
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-b bg-card">
          <MobileNavigation />
        </div>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-64px)] bg-background">
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}