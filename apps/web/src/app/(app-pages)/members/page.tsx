import { requireCurrentWorkspace } from '@/data/user/workspaces';
import { getMembers, getPendingInvitations } from '@/data/user/members';
import { headers } from 'next/headers';
import { MembersClient } from './members-client';

export default async function MembersPage() {
  const membership = await requireCurrentWorkspace();
  const [members, invitations] = await Promise.all([getMembers(), getPendingInvitations()]);
  const headerList = await headers();
  const host = headerList.get('host') ?? 'localhost:3000';
  const origin = `${host.startsWith('localhost') ? 'http' : 'https'}://${host}`;
  const canManage = membership.role === 'owner' || membership.role === 'admin';
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Members</h1>
      <MembersClient members={members} invitations={invitations} origin={origin} canManage={canManage} />
    </div>
  );
}
