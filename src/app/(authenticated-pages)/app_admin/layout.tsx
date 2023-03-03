import { AppSupabaseClient } from '@/types';
import { errors } from '@/utils/errors';
import { getIsAppAdmin, getUserProfile } from '@/utils/supabase-queries';
import createClient from '@/utils/supabase-server';
import { User } from '@supabase/supabase-js';
import { ClientLayout } from './ClientLayout';

async function fetchData(supabaseClient: AppSupabaseClient, authUser: User) {
  const [isUserAppAdmin, userProfile] = await Promise.all([
    getIsAppAdmin(supabaseClient, authUser),
    getUserProfile(supabaseClient, authUser.id),
  ]);

  return { isUserAppAdmin, userProfile };
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    errors.add(error);
    return <p>Error: An error occurred.</p>;
  }
  if (!data.user) {
    // This is unreachable because the user is authenticated
    // But we need to check for it anyway for TypeScript.
    return <p>No user</p>;
  }

  try {
    const { isUserAppAdmin, userProfile } = await fetchData(
      supabase,
      data.user
    );

    if (!isUserAppAdmin) {
      return <p>Unauthorized</p>;
    }
    return <ClientLayout userProfile={userProfile}>{children}</ClientLayout>;
  } catch (fetchDataError) {
    errors.add(fetchDataError);
    return <p>Error: An error occurred.</p>;
  }
}
