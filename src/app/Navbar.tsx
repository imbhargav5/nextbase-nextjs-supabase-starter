'use client';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';
// const DynamicLoginNavLink = dynamic(
//   () => import('./LoginNavLink').then((module) => module.LoginNavLink),
//   {
//     ssr: false,
//   }
// );

// export function Navbar() {
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     function onScroll() {
//       setIsScrolled(window.scrollY > 0);
//     }
//     onScroll();
//     window.addEventListener('scroll', onScroll, { passive: true });
//     return () => {
//       window.removeEventListener('scroll', onScroll);
//     };
//   }, []);

//   return (
//     <header
//       className={cn(
//         'sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none sm:px-6 lg:px-8',
//         isScrolled
//           ? 'dark:bg-slate-900/95 dark:backdrop-blur-sm dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75'
//           : 'dark:bg-transparent'
//       )}
//     >
//       <div className="mr-6 flex lg:hidden space-x-2">
//         <MobileNavigation />
//         <div className={cn('block lg:hidden', 'relative ')}>
//           <Link href="/" className="block" aria-label="Home page">
//             <img
//               src="https://usenextbase.com/logos/nextbase/Logo%2006.png"
//               className="h-9 block sm:h-9"
//               alt="Nextbase Logo"
//             />
//           </Link>
//         </div>
//       </div>

//       <div className={cn(' mx-auto w-full max-w-8xl flex justify-center ')}>
//         <div
//           className={cn(
//             'hidden lg:flex items-center gap-8 mx-auto ',
//             'relative '
//           )}
//         >
//           <Link href="/" aria-label="Home page">
//             <img
//               src="https://usenextbase.com/logos/nextbase/Logo%2006.png"
//               className="h-9 block sm:h-9"
//               alt="Nextbase Logo"
//             />
//           </Link>
//           <NavLink href="/" aria-label="Items">
//             Items
//           </NavLink>
//           <Suspense fallback={<div> Loading ... </div>}>
//             <DynamicLoginNavLink />
//           </Suspense>
//         </div>
//         <div className="-my-5 mr-6 sm:mr-8 md:mr-0"></div>
//         <div className="relative flex basis-0 justify-end gap-6 sm:gap-8 md:grow"></div>
//       </div>
//     </header>
//   );
// }

import Link from 'next/link';
// import { ThemeToggle } from '@/components/tailwind/ThemeToggle';

export const ExternalNavigation = () => {
  return (
    <header className="container mx-auto px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="/">
        <MountainIcon className="h-6 w-6" />
        <span className="hidden lg:block ml-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Nextbase Open Source
        </span>
        <span className="block lg:hidden ml-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Nextbase
        </span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <Link
          className="text-sm hidden lg:block font-medium hover:underline underline-offset-4"
          href="#"
        >
          Features
        </Link>
        <Link
          className="text-sm hidden lg:block font-medium hover:underline underline-offset-4"
          href="#"
        >
          Pricing
        </Link>
        <Link
          className="text-sm hidden lg:block font-medium hover:underline underline-offset-4"
          href="#"
        >
          About
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="https://usenextbase.com"
          target="_blank"
        >
          <Button className="inline-flex items-center gap-2 justify-center rounded-md bg-linear-to-r from-blue-500 to-purple-500 px-6 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:from-blue-600 hover:to-purple-600 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Premium Nextbase Starter Kits <ExternalLinkIcon />
          </Button>
        </Link>
      </nav>
    </header>
  );
};
function MountainIcon(props) {
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
