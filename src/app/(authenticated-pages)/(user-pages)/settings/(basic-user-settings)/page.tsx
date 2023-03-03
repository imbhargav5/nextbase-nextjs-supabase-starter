import { AccountSettings } from './AccountSettings';

import { errors } from '@/utils/errors';

import { getUserProfile } from '@/utils/supabase-queries';

import createClient from '@/utils/supabase-server';

export default async function AccountSettingsPage() {
  const supabaseClient = createClient();
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) {
    errors.add(error);
    return <p>Error: An error occurred.</p>;
  }
  if (!data.user) {
    // This is unreachable because the user is authenticated
    // But we need to check for it anyway for TypeScript.
    return <p>No user</p>;
  }
  const userProfile = await getUserProfile(supabaseClient, data.user.id);

  return <AccountSettings userProfile={userProfile} />;
}
