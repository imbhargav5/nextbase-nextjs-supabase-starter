import { Suspense } from 'react';
import { getCachedLoggedInVerifiedSupabaseUser } from '@/rsc-data/supabase';
import { UpdatePassword } from './UpdatePassword';

async function UpdatePasswordContent() {
  await getCachedLoggedInVerifiedSupabaseUser();
  return <UpdatePassword />;
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdatePasswordContent />
    </Suspense>
  );
}
