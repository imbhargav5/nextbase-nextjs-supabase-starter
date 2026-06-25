'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  addCommentAction,
  assignReportAction,
  createLabelAction,
  toggleReportLabelAction,
  updateReportStatusAction,
} from '@/data/user/feedback';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

// Shapes returned by getFeedbackReport / getAssignableMembers / getLabels.
export type ReportDetail = {
  id: string;
  type: string;
  status: 'new' | 'in_progress' | 'done';
  description: string;
  reporter_name: string | null;
  reporter_email: string | null;
  page_url: string | null;
  browser: string | null;
  os: string | null;
  screen_size: string | null;
  assignee_id: string | null;
  screenshotUrl: string | null;
  comments: {
    id: string;
    body: string;
    created_at: string;
    author_id: string;
  }[];
  report_labels: {
    label: { id: string; name: string; color: string } | null;
  }[];
};
type Member = { user_id: string; email: string; role: string };
type Label = { id: string; name: string; color: string };

export function ReportDetailClient({
  report,
  members,
  labels,
}: {
  report: ReportDetail;
  members: Member[];
  labels: Label[];
}) {
  const router = useRouter();
  const [comment, setComment] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const attachedIds = new Set(
    report.report_labels.map((rl) => rl.label?.id).filter(Boolean) as string[]
  );

  const refresh = () => router.refresh();
  const status = useAction(updateReportStatusAction, {
    onSuccess: refresh,
    onError: ({ error }) => toast.error(error.serverError ?? 'Action failed'),
  });
  const assign = useAction(assignReportAction, {
    onSuccess: refresh,
    onError: ({ error }) => toast.error(error.serverError ?? 'Action failed'),
  });
  const toggleLabel = useAction(toggleReportLabelAction, {
    onSuccess: refresh,
    onError: ({ error }) => toast.error(error.serverError ?? 'Action failed'),
  });
  const addComment = useAction(addCommentAction, {
    onSuccess: () => {
      setComment('');
      refresh();
    },
    onError: ({ error }) => toast.error(error.serverError ?? 'Failed'),
  });
  const createLabel = useAction(createLabelAction, {
    onSuccess: () => {
      setNewLabel('');
      router.refresh();
    },
    onError: ({ error }) => toast.error(error.serverError ?? 'Failed'),
  });

  return (
    <div className="grid flex-1 gap-6 p-4 md:grid-cols-3 md:p-6">
      <div className="space-y-4 md:col-span-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{report.type}</Badge>
          <h1 className="text-xl font-semibold">Feedback</h1>
        </div>
        <p className="whitespace-pre-wrap">
          {report.description || '(no description)'}
        </p>
        {report.screenshotUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={report.screenshotUrl}
            alt="Annotated screenshot"
            className="rounded border"
          />
        ) : (
          <p className="text-muted-foreground">No screenshot.</p>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[...report.comments]
              .sort((a, b) => a.created_at.localeCompare(b.created_at))
              .map((c) => (
                <div key={c.id} className="rounded bg-muted p-2 text-sm">
                  <div className="text-xs text-muted-foreground">
                    {new Date(c.created_at).toLocaleString()}
                  </div>
                  <div className="whitespace-pre-wrap">{c.body}</div>
                </div>
              ))}
            <Textarea
              rows={3}
              placeholder="Add an internal comment…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              disabled={
                addComment.status === 'executing' || comment.trim().length === 0
              }
              onClick={() =>
                addComment.execute({ reportId: report.id, body: comment })
              }
            >
              Comment
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={report.status}
              onValueChange={(v) =>
                status.execute({
                  reportId: report.id,
                  status: v as ReportDetail['status'],
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignee</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={report.assignee_id ?? 'unassigned'}
              onValueChange={(v) =>
                assign.execute({
                  reportId: report.id,
                  assigneeId: v === 'unassigned' ? null : v,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.user_id} value={m.user_id}>
                    {m.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Labels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {labels.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  No labels yet.
                </span>
              )}
              {labels.map((label) => {
                const attached = attachedIds.has(label.id);
                return (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() =>
                      toggleLabel.execute({
                        reportId: report.id,
                        labelId: label.id,
                        attach: !attached,
                      })
                    }
                  >
                    <Badge variant={attached ? 'default' : 'outline'}>
                      {label.name}
                    </Badge>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="New label…"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newLabel.trim().length > 0)
                    createLabel.execute({ name: newLabel.trim() });
                }}
              />
              <Button
                variant="outline"
                disabled={
                  createLabel.status === 'executing' ||
                  newLabel.trim().length === 0
                }
                onClick={() => createLabel.execute({ name: newLabel.trim() })}
              >
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div>URL: {report.page_url ?? '—'}</div>
            <div>Browser: {report.browser ?? '—'}</div>
            <div>OS: {report.os ?? '—'}</div>
            <div>Screen: {report.screen_size ?? '—'}</div>
            <div>
              Reporter: {report.reporter_name ?? '—'}{' '}
              {report.reporter_email ? `(${report.reporter_email})` : ''}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
