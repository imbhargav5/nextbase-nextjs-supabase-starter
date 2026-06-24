'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createProjectAction } from '@/data/user/projects';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function CreateProjectForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { execute, status } = useAction(createProjectAction, {
    onSuccess: ({ data }) => {
      toast.success('Project created');
      setOpen(false);
      setName('');
      router.refresh();
      if (data?.projectId) router.push(`/projects/${data.projectId}`);
    },
    onError: ({ error }) => toast.error(error.serverError ?? 'Failed'),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            execute({ name });
          }}
          className="space-y-4"
        >
          <Input
            placeholder="My website"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit" disabled={status === 'executing' || name.length === 0}>
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
