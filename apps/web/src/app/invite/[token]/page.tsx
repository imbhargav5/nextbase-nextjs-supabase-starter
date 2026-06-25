import { getCachedIsUserLoggedIn } from '@/rsc-data/supabase';
import { createSupabaseClient } from '@/supabase-clients/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { AcceptInviteClient } from './accept-invite-client';

async function InviteContent({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const isLoggedIn = await getCachedIsUserLoggedIn().catch(() => false);
  if (!isLoggedIn) {
    redirect(`/login?next=${encodeURIComponent(`/invite/${token}`)}`);
  }
  const supabase = await createSupabaseClient();
  const { data } = await supabase.rpc('get_invitation_preview', { p_token: token });
  const preview = data?.[0] ?? null;
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <AcceptInviteClient token={token} preview={preview} />
    </div>
  );
}

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  return (
    <Suspense>
      <InviteContent params={params} />
    </Suspense>
  );
}
