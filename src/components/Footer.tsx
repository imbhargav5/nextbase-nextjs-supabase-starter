import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { T } from '@/components/ui/Typography';
import {
  Dribbble,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Twitter,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-muted/50 py-8 sm:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 pb-12 md:pb-16">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={'/logos/acme-logo-dark.png'}
                className="dark:hidden"
                width={32}
                height={32}
                alt="Acme Logo"
              />
              <Image
                src={'/logos/acme-logo-light.png'}
                className="hidden dark:block"
                width={32}
                height={32}
                alt="Acme Logo"
              />
              <T.H3 className="text-xl">Acme</T.H3>
            </Link>

            <T.P className="text-sm text-muted-foreground">
              Acme Inc. 123 Acme Street, London, UK, SW1A 1AA
            </T.P>

            <Separator />

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="https://discord.com/invite/RxNDVewS74"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discord"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="https://twitter.com/usenextbase"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="https://www.linkedin.com/in/codewithbhargav/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <T.H4 className="text-sm font-semibold uppercase">Resources</T.H4>
            <nav className="flex flex-col space-y-2.5">
              <Link
                href="https://usenextbase.com"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                NextBase
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <T.H4 className="text-sm font-semibold uppercase">Follow us</T.H4>
            <nav className="flex flex-col space-y-2.5">
              <Link
                href="https://github.com/imbhargav5"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Github
              </Link>
              <Link
                href="https://twitter.com/codewithbhargav"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Twitter
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <T.H4 className="text-sm font-semibold uppercase">Legal</T.H4>
            <nav className="flex flex-col space-y-2.5">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms &amp; Conditions
              </Link>
            </nav>
          </div>
        </div>

        <Separator className="my-6 lg:my-8" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <T.Small className="text-muted-foreground">
            © 2023{' '}
            <Link
              href="https://usenextbase.com"
              target="_blank"
              className="hover:text-foreground transition-colors"
            >
              Arni Creative Private Limited
            </Link>
            . All Rights Reserved.
          </T.Small>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login" aria-label="Dribbble">
                <Dribbble className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
