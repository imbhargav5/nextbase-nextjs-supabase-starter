import { CircleAlert } from 'lucide-react';
import Link from 'next/link';

import { AuthCard } from '@/components/Auth/AuthCard';
import { Button } from '@/components/ui/button';

export default function AuthErrorPage() {
  return (
    <AuthCard
      title="Authentication error"
      description="The authentication link could not be completed. It may have expired or already been used."
      icon={<CircleAlert aria-hidden="true" />}
    >
      <div className="grid gap-2">
        <Button asChild>
          <Link href="/login">Try signing in again</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
