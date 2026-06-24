'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function InstallSnippet({
  origin,
  publicKey,
}: {
  origin: string;
  publicKey: string;
}) {
  const snippet = `<script async src="${origin}/widget.js" data-project-key="${publicKey}"></script>`;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Install snippet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <pre className="overflow-x-auto rounded bg-muted p-3 text-sm">{snippet}</pre>
        <Button
          variant="secondary"
          onClick={() => {
            navigator.clipboard.writeText(snippet);
            toast.success('Snippet copied');
          }}
        >
          Copy snippet
        </Button>
      </CardContent>
    </Card>
  );
}
