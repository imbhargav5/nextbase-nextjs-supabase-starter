'use client';
import { T } from '@/components/ui/Typography';
import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDidMount } from 'rooks';

export default function HomePage() {
  const session = useSession();
  const router = useRouter();
  const [loadingState, setLoadingState] = useState<
    'loading' | 'logged-in' | 'logged-out'
  >('loading');

  // Intentionally not using useEffect here because we want to run this
  // code only once, on mount and not interrupt auth flow.
  useDidMount(() => {
    if (session?.user) {
      setLoadingState('logged-in');
      router.push('/dashboard');
    } else {
      setLoadingState('logged-out');
      router.push('/login');
    }
  });

  let content = <span>Please wait...</span>;
  if (loadingState === 'logged-in') {
    content = <span>Redirecting to dashboard...</span>;
  } else if (loadingState === 'logged-out') {
    content = (
      <div className="space-y-4">
        <T.P>Not logged in</T.P>
        <span>Redirecting to login...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      {content}
    </div>
  );
}
