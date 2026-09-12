import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import {
  nguyenAssets,
  nguyenFooter,
  nguyenFooterColumns,
  nguyenSocialLinks,
} from './data';

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <title>X</title>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <title>LinkedIn</title>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const socialIcons = {
  Twitter: XIcon,
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
} as const;

export function NguyenFooter() {
  return (
    <footer className="relative -mt-25 overflow-hidden py-12 pt-37 md:py-25 md:pt-37">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 -z-10 h-full w-full bg-[url('/templates/nguyen/footer-blur-mobile.png')] mask-t-from-90% bg-cover bg-center bg-no-repeat md:bg-[url('/templates/nguyen/footer-blur-desktop.png')]"
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 md:grid-cols-6">
          <div className="md:col-span-2">
            <Link href="/templates/nguyen" className="inline-block">
              <Image
                src={nguyenAssets.logoLight}
                alt="Nguyen"
                width={130}
                height={40}
                className="dark:hidden"
              />
              <Image
                src={nguyenAssets.logoDark}
                alt="Nguyen"
                width={130}
                height={40}
                className="hidden dark:block"
              />
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {nguyenFooter.description}
            </p>

            <div className="mt-6 flex gap-4">
              {nguyenSocialLinks.map((social) => {
                const Icon = socialIcons[social.label as keyof typeof socialIcons];

                return (
                  <span
                    key={social.label}
                    aria-label={social.label}
                    className={cn(
                      'grid h-9 w-9 place-items-center rounded-full border bg-background text-muted-foreground',
                    )}
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                  </span>
                );
              })}
            </div>
          </div>

          {nguyenFooterColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      title={link.title}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {nguyenFooter.copyrightYear} {nguyenFooter.copyright}
          </p>

          <div className="flex gap-6 text-sm text-muted-foreground">
            {nguyenFooter.legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
