'use client';

import RouterProgressionContext from '@/contexts/RouterProgressionContext';
import Link from 'next/link';
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  forwardRef,
  useContext,
  Ref,
  ForwardedRef,
} from 'react';

/**
 * The original Link component from Next.js no longer has router events.
 * This component is a wrapper around the Link component that adds the router events.
 * Helpful for adding a loading bar to the top of the page.
 */
export const Anchor = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<typeof Link>
>((props, ref) => {
  const startChange = useContext(RouterProgressionContext);
  const { href, ...otherProps } = props;
  const useLink = href.toString().startsWith('/');
  if (useLink)
    return (
      <Link
        ref={ref}
        href={href}
        onClick={() => {
          const { pathname, search, hash } = window.location;
          if (href !== pathname + search + hash) startChange();
        }}
        {...otherProps}
      ></Link>
    );
  return <a href={href.toString()} {...otherProps}></a>;
});
