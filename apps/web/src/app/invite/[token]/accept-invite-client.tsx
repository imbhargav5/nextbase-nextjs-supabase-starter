'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { acceptInvitationAction } from '@/data/user/members';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Preview = { workspace_name: string; role: string; valid: boolean } | null;

export function AcceptInviteClient({ token, preview }: { token: string; preview: Preview }) {
  const router = useRouter();
  const accept = useAction(acceptInvitationAction, {
    onSuccess: () => {
      toast.success('Joined workspace');
      router.push('/inbox');
      router.refresh();
    },
    onError: ({ error }) => toast.error(error.serverError ?? 'Could not accept invite'),
  });

  if (!preview || !preview.valid) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Invitation unavailable</CardTitle>
          <CardDescription>This invite link is invalid, expired, or already used.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Join {preview.workspace_name}</CardTitle>
        <CardDescription>You were invited as {preview.role}.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          disabled={accept.status === 'executing'}
          onClick={() => accept.execute({ token })}
        >
          Accept invitation
        </Button>
      </CardContent>
    </Card>
  );
}
