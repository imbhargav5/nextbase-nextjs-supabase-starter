'use client';
import { Button } from '@/components/ui/button';
import { T } from '@/components/ui/Typography';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const ExternalNavigation = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center">
        <Link className="flex items-center space-x-2" href="/">
          <div className="flex items-center justify-center">
            <MountainIcon className="h-6 w-6" />
          </div>
          <T.H3 className="hidden lg:block text-xl font-semibold leading-tight mt-0">
            Nextbase Open Source
          </T.H3>
          <T.H3 className="block lg:hidden text-xl font-semibold leading-tight mt-0">
            Nextbase
          </T.H3>
        </Link>
        <nav className="ml-auto flex items-center gap-2 sm:gap-4">
          <Link
            className="text-sm hidden lg:inline-flex font-medium text-muted-foreground hover:text-foreground transition-colors"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-sm hidden lg:inline-flex font-medium text-muted-foreground hover:text-foreground transition-colors"
            href="#"
          >
            Pricing
          </Link>
          <Link
            className="text-sm hidden lg:inline-flex font-medium text-muted-foreground hover:text-foreground transition-colors"
            href="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            href="/login"
          >
            Login
          </Link>
          <Button variant="default" asChild>
            <Link
              href="https://usenextbase.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="hidden sm:inline">
                Premium Nextbase Starter Kits
              </span>
              <span className="sm:hidden">Premium</span>
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
