import { getCachedLoggedInVerifiedSupabaseUser } from '@/rsc-data/supabase';
import { UpdatePassword } from './UpdatePassword';

export default async function UpdatePasswordPage() {
  await getCachedLoggedInVerifiedSupabaseUser();
  return <UpdatePassword />;
}
