'use client';

import { ReactNode, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { T } from '@/components/ui/Typography';

export function ClientLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    router.prefetch('/dashboard');
  }, []);
  return (
    <div className=" h-full dark:bg-gray-900/20">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="text-center flex flex-col items-center justify-center space-y-8 h-screen">
          <div>{children}</div>
        </div>
        <div className="mt-2 p-3">
          {/* Background Overlay */}

          {/* Blue Background Image */}
          <div
            className="gap-10 bg-cover flex flex-col justify-between rounded-xl w-full dark:bg-gray-800 bg-gray-100 bg-opacity-90 h-full px-10 pt-10 pb-10"
            // style={{ backgroundImage: `url(${LoginBackgroundLight.src})` }}
          >
            <div className=" space-y-8">
              <div>
                <Image
                  width="600"
                  src={'/assets/login-asset-dashboard.png'}
                  height="450"
                  alt="Login Header"
                />
              </div>

              <div className="w-[300px] md:w-[500px]">
                <T.H3 className="text-sm   md:text-2xl text-sm">
                  <p className="text-2xl md:text-5xl mb-0">＂</p>
                  We are now able to ship our product quicker, allowing us to
                  focus on building the features that matter most to our
                  customers and not worry about the infrastructure.
                </T.H3>
                <div className="mt-8 flex flex-col gap-2 md:flex md:justify-between">
                  <T.P>⭐️ ⭐️ ⭐️ ⭐️ ⭐️</T.P>
                  <T.P className="dark:text-gray-100 text-base font-[500]">
                    Jonathan Smith - CEO of Company
                  </T.P>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
