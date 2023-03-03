/**
 *
 * NProgress
 *
 */
import { useCallback, useRef } from 'react';
import * as NProgress from 'nprogress';
import * as React from 'react';
import { errors } from '@/utils/errors';

// window.navigation typescript polyfill
declare global {
  interface Window {
    navigation: {
      addEventListener: (
        eventName: string,
        callback: (event: Event) => void
      ) => void;
      removeEventListener: (
        eventName: string,
        callback: (event: Event) => void
      ) => void;
    };
  }
}

export interface NavigationProgressProps {
  /**
   * The color of the bar.
   * @default "#29D"
   */
  color?: string;
  /**
   * The start position of the bar.
   * @default 0.3
   */
  startPosition?: number;
  /**
   * The stop delay in milliseconds.
   * @default 200
   */
  stopDelayMs?: number;
  /**
   * The height of the bar.
   * @default 3
   */
  height?: number;
  /**
   * Whether to show the bar on shallow routes.
   * @default true
   */
  showOnShallow?: boolean;
  /**
   * The other NProgress configuration options to pass to NProgress.
   * @default null
   */
  options?: Partial<NProgress.NProgressOptions>;
  /**
   * The nonce attribute to use for the `style` tag.
   * @default undefined
   */
  nonce?: string;

  /**
   * Use your custom CSS tag instead of the default one.
   * This is useful if you want to use a different style or minify the CSS.
   * @default (css) => <style nonce={nonce}>{css}</style>
   */
  transformCSS?: (css: string) => JSX.Element;
}

const NavigationProgressBar = ({
  color = '#29D',
  startPosition = 0.3,
  stopDelayMs = 200,
  height = 3,
  options,
  nonce,
  transformCSS = (css) => <style nonce={nonce}>{css}</style>,
}: NavigationProgressProps) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const routeChangeStart = useCallback(() => {
    NProgress.set(startPosition);
    NProgress.start();
  }, [startPosition]);

  const routeChangeEnd = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      NProgress.done(true);
    }, stopDelayMs);
  }, [stopDelayMs]);

  const routeChangeError = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      NProgress.done(true);
    }, stopDelayMs);
  }, [stopDelayMs]);

  React.useEffect(() => {
    const { navigation } = window;
    if (options) {
      NProgress.configure(options);
    }
    if (navigation) {
      navigation.addEventListener('navigate', routeChangeStart);
      navigation.addEventListener('navigateerror', routeChangeError);
      navigation.addEventListener('navigatesuccess', routeChangeEnd);
      return () => {
        navigation.removeEventListener('navigate', routeChangeStart);
        navigation.removeEventListener('navigateerror', routeChangeError);
        navigation.removeEventListener('navigatesuccess', routeChangeEnd);
      };
    }
    return () => {
      errors.add('navigation api not found');
    };
  }, [options, routeChangeEnd, routeChangeError, routeChangeStart]);

  return transformCSS(`
     #nprogress {
       pointer-events: none;
     }
     #nprogress .bar {
       background: ${color};
       position: fixed;
       z-index: 9999;
       top: 0;
       left: 0;
       width: 100%;
       height: ${height}px;
     }
     #nprogress .peg {
       display: block;
       position: absolute;
       right: 0px;
       width: 100px;
       height: 100%;
       box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
       opacity: 1;
       -webkit-transform: rotate(3deg) translate(0px, -4px);
       -ms-transform: rotate(3deg) translate(0px, -4px);
       transform: rotate(3deg) translate(0px, -4px);
     }
     #nprogress .spinner {
       display: block;
       position: fixed;
       z-index: 1031;
       top: 15px;
       right: 15px;
     }
     #nprogress .spinner-icon {
       width: 18px;
       height: 18px;
       box-sizing: border-box;
       border: solid 2px transparent;
       border-top-color: ${color};
       border-left-color: ${color};
       border-radius: 50%;
       -webkit-animation: nprogresss-spinner 400ms linear infinite;
       animation: nprogress-spinner 400ms linear infinite;
     }
     .nprogress-custom-parent {
       overflow: hidden;
       position: relative;
     }
     .nprogress-custom-parent #nprogress .spinner,
     .nprogress-custom-parent #nprogress .bar {
       position: absolute;
     }
     @-webkit-keyframes nprogress-spinner {
       0% {
         -webkit-transform: rotate(0deg);
       }
       100% {
         -webkit-transform: rotate(360deg);
       }
     }
     @keyframes nprogress-spinner {
       0% {
         transform: rotate(0deg);
       }
       100% {
         transform: rotate(360deg);
       }
     }
   `);
};

export default React.memo(NavigationProgressBar);
