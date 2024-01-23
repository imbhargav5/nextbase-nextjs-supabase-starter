'use client';
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
//           ? 'dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75'
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
//         <div className="relative flex basis-0 justify-end gap-6 sm:gap-8 md:flex-grow"></div>
//       </div>
//     </header>
//   );
// }

import { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Menu from 'lucide-react/dist/esm/icons/menu';
import { Button } from '@/components/ui/button';
import { Anchor } from '@/components/Anchor';
// import { ThemeToggle } from '@/components/tailwind/ThemeToggle';

export const ExternalNavigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname ? pathname === '/' : false;

  return (
    <header className="sticky inset-x-0 w-full top-0 bg-white/80 dark:bg-slate-900/90  z-50 border-b border-gray-200/20 dark:border-gray-700/40 backdrop-blur">
      <div className="inset-0" onClick={() => setMobileMenuOpen(false)} />
      <nav
        className="flex items-center w-full h-[54px] md:container justify-between px-6 md:px-8"
        aria-label="Global"
      >
        <div className="flex space-x-8">
          <Link href="/" className="font-bold text-xl ">
            <div className="relative flex space-x-2 w-10 h-10 md:w-fit items-center justify-center text-black dark:text-white dark:-ml-4 -ml-2">
              <Image
                src={'/logos/acme-logo-dark.png'}
                width={40}
                height={40}
                alt="logo"
                className="dark:hidden block h-8 w-8"
              />
              <Image
                src={'/logos/acme-logo-light.png'}
                width={40}
                height={40}
                alt="logo"
                className="hidden dark:block h-8 w-8"
              />
              <span className="hidden font-bold lg:inline-block">acme</span>
            </div>
          </Link>
        </div>
        <div className="flex space-x-10 items-center lg:-mr-2">
          {/* <ThemeToggle /> */}
          {isHome && (
            <div className="ml-6 hidden lg:block">
              <Anchor href="/login">
                <Button variant="default" size="default" className="group">
                  Log In
                  <svg
                    className="ml-2 -mr-1 w-5 h-5 group-hover:translate-x-1 transition"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </Anchor>
            </div>
          )}
        </div>
        <Menu
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="hover:cursor-pointer lg:hidden -mr-2"
        />
      </nav>
      {mobileMenuOpen && (
        <ul className="md:hidden w-full shadow-2xl py-2 flex flex-col items-start font-medium pb-2">
          <hr className="w-full h-2" />
          <Anchor href="/login" className="px-4 w-full">
            <Button variant="default" size="default" className="group w-full">
              Log In
              <svg
                className="ml-2 -mr-1 w-5 h-5 group-hover:translate-x-1 transition"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </Anchor>
        </ul>
      )}
    </header>
  );
};
