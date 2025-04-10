/**
 * v0 by Vercel.
 * @see https://v0.dev/t/uVG77qDcbLd
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { ArrowRight, Github, Star } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-transparent to-transparent dark:from-blue-900/20 dark:via-transparent dark:to-transparent"></div>
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-sm font-medium dark:border-gray-800">
                <span className="text-blue-600 dark:text-blue-400">
                  Nextbase
                </span>
                <span className="mx-1 text-gray-400 dark:text-gray-600">•</span>
                <span>Open Source Starter Kit</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Build faster with
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {' '}
                  Nextbase
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl lg:text-xl dark:text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. This
                open source starter kit by the Nextbase team provides everything
                you need to launch your next project.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-white shadow transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="https://github.com/imbhargav5/nextbase-nextjs-supabase-starter"
                className="inline-flex h-12 items-center justify-center rounded-md border border-gray-200 bg-white px-6 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              >
                <Github className="mr-2 h-4 w-4" /> Star on GitHub
              </Link>
            </div>
          </div>

          <div className="mt-16 grid place-items-center">
            <div className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-gray-900/0 dark:from-gray-900/80"></div>
              <img
                src="https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1600&auto=format&fit=crop"
                alt="Dashboard preview"
                className="w-full h-auto object-cover aspect-video"
                width="1600"
                height="900"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-[850px]">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Feature-rich, Developer-first
              </h2>
              <p className="text-gray-500 dark:text-gray-400 md:text-xl">
                Lorem ipsum dolor sit amet, an open source starter kit built by
                the Nextbase team, consectetur adipiscing elit. Sed euismod,
                diam sit amet dictum ultrices.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-8 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
                >
                  <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-sm font-medium dark:border-gray-800">
                <Star className="mr-1 h-3.5 w-3.5 text-yellow-500" />
                <span className="text-gray-900 dark:text-gray-50">
                  Why developers love Nextbase
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Built for developers, by developers
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. The
                Nextbase open source starter kit provides a solid foundation for
                your next web application. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow-sm transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  Get Started
                </Link>
                <Link
                  href="#"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                >
                  View Documentation
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 -z-10 bg-gradient-to-b from-gray-100 to-white opacity-50 blur-2xl dark:from-gray-900/70 dark:to-black/70"></div>
              <img
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1600&auto=format&fit=crop"
                alt="Developer experience"
                className="w-full rounded-xl border border-gray-200 shadow-lg dark:border-gray-800"
                width="550"
                height="400"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-950 text-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to get started?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed">
                Lorem ipsum dolor sit amet, this open source starter kit by
                Nextbase team is all you need. Consectetur adipiscing elit, sed
                do eiusmod tempor incididunt.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-md bg-white px-6 text-sm font-medium text-gray-900 shadow transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="inline-flex h-12 items-center justify-center rounded-md border border-gray-800 bg-transparent px-6 text-sm font-medium text-gray-50 shadow-sm transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
              >
                Learn More
              </Link>
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
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    icon: (
      <svg
        className="h-6 w-6 text-blue-600 dark:text-blue-500"
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
      'The Nextbase starter kit uses the latest technologies to ensure your project is future-proof.',
    icon: (
      <svg
        className="h-6 w-6 text-blue-600 dark:text-blue-500"
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
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    icon: (
      <svg
        className="h-6 w-6 text-blue-600 dark:text-blue-500"
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
      'Built by the Nextbase team with security in mind. Lorem ipsum dolor sit amet, consectetur.',
    icon: (
      <svg
        className="h-6 w-6 text-blue-600 dark:text-blue-500"
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
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    icon: (
      <svg
        className="h-6 w-6 text-blue-600 dark:text-blue-500"
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
      'Lorem ipsum dolor sit amet, open source starter kit by Nextbase team, consectetur adipiscing elit.',
    icon: (
      <svg
        className="h-6 w-6 text-blue-600 dark:text-blue-500"
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
