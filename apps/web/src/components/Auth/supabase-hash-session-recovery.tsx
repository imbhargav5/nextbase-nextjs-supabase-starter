'use client';

import { createClient } from '@/supabase-clients/client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Recovers implicit-flow magic links that land with `#access_token=…` on a
 * marketing page (when redirect URL was not allow-listed in Supabase).
 */
export function SupabaseHashSessionRecovery() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.hash.includes('access_token=')) {
      return;
    }

    const supabase = createClient();

    void (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      window.history.replaceState(null, '', pathname + window.location.search);

      const kitProductMatch = /^\/kit\/([^/]+)$/.exec(pathname);
      if (kitProductMatch) {
        router.replace(`/kit/${kitProductMatch[1]}/prompts`);
        return;
      }

      router.refresh();
    })();
  }, [pathname, router]);

  return null;
}
