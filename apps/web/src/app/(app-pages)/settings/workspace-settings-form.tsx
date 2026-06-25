'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateWorkspaceAction } from '@/data/user/workspaces';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function WorkspaceSettingsForm({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(name);
  const { execute, status } = useAction(updateWorkspaceAction, {
    onSuccess: () => {
      toast.success('Workspace updated');
      router.refresh();
    },
    onError: ({ error }) => toast.error(error.serverError ?? 'Failed'),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>General</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Workspace name</Label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input value={slug} disabled />
        </div>
        <Button
          disabled={status === 'executing' || value.trim().length === 0}
          onClick={() => execute({ name: value })}
        >
          Save
        </Button>
      </CardContent>
    </Card>
  );
}
