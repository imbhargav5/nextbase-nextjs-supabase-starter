import { Suspense } from 'react';
import { getCachedLoggedInVerifiedSupabaseUser } from '@/rsc-data/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { UpdatePassword } from './UpdatePassword';

async function UpdatePasswordContent() {
  await getCachedLoggedInVerifiedSupabaseUser();
  return <UpdatePassword />;
}

export default function UpdatePasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 rounded-lg border p-6">
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      }
    >
      <UpdatePasswordContent />
    </Suspense>
  );
}
