import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { T } from '@/components/ui/Typography';
import { ArrowRight, Github, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent dark:from-primary/10 dark:via-transparent dark:to-transparent"></div>
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <Badge variant="outline" className="inline-flex items-center">
                <span className="text-primary">Nextbase</span>
                <span className="mx-1.5 text-muted-foreground">•</span>
                <span>Open Source Starter Kit</span>
              </Badge>
              <T.H1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-balance">
                Build faster with
                <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                  {' '}
                  Nextbase
                </span>
              </T.H1>
              <T.P className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. This
                open source starter kit by the Nextbase team provides everything
                you need to launch your next project.
              </T.P>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/login">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://github.com/imbhargav5/nextbase-nextjs-supabase-starter">
                  <Github className="mr-2 h-4 w-4" /> Star on GitHub
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 md:mt-24 flex justify-center">
            <div className="relative w-full max-w-5xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary rounded-xl blur opacity-25"></div>
              <div className="relative overflow-hidden rounded-xl border bg-background shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent"></div>
                <Image
                  src="https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1600&auto=format&fit=crop"
                  alt="Dashboard preview"
                  className="w-full h-auto"
                  width={1600}
                  height={900}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4 max-w-[850px]">
              <T.H2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl text-balance">
                Feature-rich, Developer-first
              </T.H2>
              <T.P className="text-lg text-muted-foreground md:text-xl">
                Lorem ipsum dolor sit amet, an open source starter kit built by
                the Nextbase team, consectetur adipiscing elit. Sed euismod,
                diam sit amet dictum ultrices.
              </T.P>
            </div>

            <div className="w-full grid max-w-6xl gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="h-full flex flex-col transition-shadow hover:shadow-lg"
                >
                  <CardHeader className="flex-none">
                    <div className="flex justify-center mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="text-center text-xl">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-start">
                    <CardDescription className="text-center text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="w-full py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col gap-6">
              <Badge variant="outline" className="w-fit">
                <Star className="mr-1.5 h-3.5 w-3.5 text-chart-1 fill-chart-1" />
                <span>Why developers love Nextbase</span>
              </Badge>
              <T.H2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl text-balance">
                Built for developers, by developers
              </T.H2>
              <T.P className="text-lg text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. The
                Nextbase open source starter kit provides a solid foundation for
                your next web application. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris.
              </T.P>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/login">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#">View Documentation</Link>
                </Button>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent opacity-50 blur-3xl"></div>
              <div className="relative overflow-hidden rounded-xl border bg-background shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1600&auto=format&fit=crop"
                  alt="Developer experience"
                  className="w-full h-auto"
                  width={1200}
                  height={800}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4 max-w-[800px]">
              <T.H2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl text-balance">
                Ready to get started?
              </T.H2>
              <T.P className="mx-auto max-w-[700px] text-lg text-primary-foreground/90 md:text-xl">
                Lorem ipsum dolor sit amet, this open source starter kit by
                Nextbase team is all you need. Consectetur adipiscing elit, sed
                do eiusmod tempor incididunt.
              </T.P>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/login">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="#">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const features = [
  {
    title: 'Type-Safe',
    description:
      'Full TypeScript support with type-safe database queries and API routes for confidence in your code.',
    icon: (
      <svg
        className="h-6 w-6 text-primary"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" x2="20" y1="19" y2="19" />
      </svg>
    ),
  },
  {
    title: 'Modern Stack',
    description:
      'Built with Next.js 14, TypeScript, Supabase, and Tailwind CSS for a future-proof foundation.',
    icon: (
      <svg
        className="h-6 w-6 text-primary"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
        <rect height="7" rx="2" ry="2" width="18" x="3" y="2" />
        <line x1="7" x2="7" y1="11" y2="15" />
        <line x1="11" x2="11" y1="11" y2="15" />
        <line x1="7" x2="7" y1="2" y2="6" />
      </svg>
    ),
  },
  {
    title: 'UI Components',
    description:
      'Beautiful, accessible components built with Radix UI and customizable with Tailwind CSS.',
    icon: (
      <svg
        className="h-6 w-6 text-primary"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect height="14" rx="2" ry="2" width="14" x="8" y="8" />
        <line x1="4" x2="8" y1="16" y2="16" />
        <line x1="4" x2="8" y1="20" y2="20" />
        <line x1="16" x2="16" y1="4" y2="8" />
        <line x1="20" x2="20" y1="4" y2="8" />
      </svg>
    ),
  },
  {
    title: 'Authentication',
    description:
      'Complete auth flows including magic links, OAuth providers, and protected routes out of the box.',
    icon: (
      <svg
        className="h-6 w-6 text-primary"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: 'API Integration',
    description:
      'Server actions, API routes, and database queries set up and ready for your application logic.',
    icon: (
      <svg
        className="h-6 w-6 text-primary"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="19" x2="5" y1="12" y2="12" />
      </svg>
    ),
  },
  {
    title: 'Fast Deployment',
    description:
      'Deploy to Vercel with one click and have your production-ready app live in minutes.',
    icon: (
      <svg
        className="h-6 w-6 text-primary"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
];
