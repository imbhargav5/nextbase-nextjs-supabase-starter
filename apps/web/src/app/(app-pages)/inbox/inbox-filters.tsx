'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Database } from '@/lib/database.types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Project = Database['public']['Tables']['projects']['Row'];

export function InboxFilters({
  projects,
  current,
}: {
  projects: Project[];
  current: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Input
        placeholder="Search description…"
        defaultValue={current.q ?? ''}
        className="max-w-xs"
        onKeyDown={(e) => {
          if (e.key === 'Enter')
            setParam('q', (e.target as HTMLInputElement).value);
        }}
      />
      <Select
        value={current.status ?? 'all'}
        onValueChange={(v) => setParam('status', v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="in_progress">In progress</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={current.type ?? 'all'}
        onValueChange={(v) => setParam('type', v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="bug">Bug</SelectItem>
          <SelectItem value="idea">Idea</SelectItem>
          <SelectItem value="question">Question</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={current.projectId ?? 'all'}
        onValueChange={(v) => setParam('projectId', v)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All projects</SelectItem>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
