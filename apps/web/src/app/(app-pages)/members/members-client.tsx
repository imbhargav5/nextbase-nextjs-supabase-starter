'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  createInvitationAction,
  removeMemberAction,
  revokeInvitationAction,
  updateMemberRoleAction,
} from '@/data/user/members';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Member = { user_id: string; email: string; role: string };
type Invitation = { id: string; email: string; role: string; token: string };

export function MembersClient({
  members,
  invitations,
  origin,
  canManage,
}: {
  members: Member[];
  invitations: Invitation[];
  origin: string;
  canManage: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');

  const refresh = () => router.refresh();
  const invite = useAction(createInvitationAction, {
    onSuccess: ({ data }) => {
      if (data?.token) {
        navigator.clipboard.writeText(`${origin}/invite/${data.token}`);
        toast.success('Invite link copied to clipboard');
      }
      setEmail('');
      refresh();
    },
    onError: ({ error }) => toast.error(error.serverError ?? 'Failed'),
  });
  const revoke = useAction(revokeInvitationAction, { onSuccess: refresh });
  const updateRole = useAction(updateMemberRoleAction, {
    onSuccess: refresh,
    onError: ({ error }) => toast.error(error.serverError ?? 'Failed'),
  });
  const remove = useAction(removeMemberAction, {
    onSuccess: refresh,
    onError: ({ error }) => toast.error(error.serverError ?? 'Failed'),
  });

  return (
    <div className="space-y-6">
      {canManage && (
        <Card>
          <CardHeader><CardTitle>Invite a teammate</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap items-end gap-2">
            <Input
              placeholder="teammate@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-xs"
            />
            <Select value={role} onValueChange={(v) => setRole(v as 'admin' | 'member')}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button
              disabled={invite.status === 'executing' || !email.includes('@')}
              onClick={() => invite.execute({ email, role })}
            >
              Generate invite link
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Current members</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {members.map((m) => (
            <div key={m.user_id} className="flex items-center justify-between gap-2">
              <span>{m.email}</span>
              {canManage ? (
                <div className="flex items-center gap-2">
                  <Select
                    value={m.role}
                    onValueChange={(v) =>
                      updateRole.execute({
                        userId: m.user_id,
                        role: v as 'owner' | 'admin' | 'member',
                      })
                    }
                  >
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove.execute({ userId: m.user_id })}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">{m.role}</span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {canManage && invitations.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Pending invitations</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {invitations.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between gap-2">
                <span>{inv.email} ({inv.role})</span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`${origin}/invite/${inv.token}`);
                      toast.success('Invite link copied');
                    }}
                  >
                    Copy link
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => revoke.execute({ invitationId: inv.id })}
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
