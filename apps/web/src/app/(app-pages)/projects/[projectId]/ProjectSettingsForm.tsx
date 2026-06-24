'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { updateProjectAction } from '@/data/user/projects';
import type { Database } from '@/lib/database.types';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Project = Database['public']['Tables']['projects']['Row'];

export function ProjectSettingsForm({ project }: { project: Project }) {
  const router = useRouter();
  const [domains, setDomains] = useState(project.allowed_domains.join('\n'));
  const [isActive, setIsActive] = useState(project.is_active);
  const { execute, status } = useAction(updateProjectAction, {
    onSuccess: () => {
      toast.success('Saved');
      router.refresh();
    },
    onError: ({ error }) => toast.error(error.serverError ?? 'Failed'),
  });

  const save = () =>
    execute({
      id: project.id,
      allowed_domains: domains
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean),
      is_active: isActive,
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Allowed domains (one per line; supports *.example.com)</Label>
          <Textarea
            rows={4}
            value={domains}
            onChange={(e) => setDomains(e.target.value)}
            placeholder={'example.com\n*.example.com\nlocalhost'}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <Label>Active</Label>
        </div>
        <Button onClick={save} disabled={status === 'executing'}>
          Save changes
        </Button>
      </CardContent>
    </Card>
  );
}
