import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getCachedLoggedInVerifiedSupabaseUser } from '@/rsc-data/supabase';
import { Home, List, Lock, PlusCircle, User } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  try {
    await getCachedLoggedInVerifiedSupabaseUser();
  } catch (error) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-3 px-4 flex justify-between items-center">
          <Link
            href="/"
            className="font-semibold text-lg flex items-center gap-2"
          >
            <Home className="h-5 w-5" />
            <span>Nextbase</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/items"
              className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <List className="h-4 w-4" />
              <span>Public Items</span>
            </Link>
            <Link
              href="/private-items"
              className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <Lock className="h-4 w-4" />
              <span>Private Items</span>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/new" className="flex items-center gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New Item</span>
              </Link>
            </Button>

            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
