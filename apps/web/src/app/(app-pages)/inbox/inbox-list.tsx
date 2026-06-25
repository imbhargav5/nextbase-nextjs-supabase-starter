import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type ReportRow = {
  id: string;
  type: string;
  status: string;
  description: string;
  created_at: string;
  project: { name: string } | null;
};

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  new: 'default',
  in_progress: 'secondary',
  done: 'outline',
};

export function InboxList({ reports }: { reports: ReportRow[] }) {
  if (reports.length === 0) {
    return <p className="text-muted-foreground">No feedback yet.</p>;
  }
  return (
    <div className="divide-y rounded-md border">
      {reports.map((r) => (
        <Link
          key={r.id}
          href={`/inbox/${r.id}`}
          className="flex items-center gap-3 p-3 hover:bg-muted/50"
        >
          <Badge variant={statusVariant[r.status] ?? 'default'}>
            {r.status}
          </Badge>
          <Badge variant="outline">{r.type}</Badge>
          <span className="flex-1 truncate">
            {r.description || '(no description)'}
          </span>
          <span className="text-xs text-muted-foreground">
            {r.project?.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(r.created_at).toLocaleDateString()}
          </span>
        </Link>
      ))}
    </div>
  );
}
