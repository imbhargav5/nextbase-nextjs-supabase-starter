import { AuthCard } from '@/components/Auth/AuthCard';
import { Spinner } from '@/components/ui/spinner';

interface RedirectingPleaseWaitCardProps {
  message: string;
  heading: string;
}

export function RedirectingPleaseWaitCard({
  message,
  heading,
}: RedirectingPleaseWaitCardProps) {
  return (
    <AuthCard
      title={heading}
      description={message}
      icon={<Spinner className="size-5" aria-hidden="true" />}
    >
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-2/3 animate-pulse rounded-full bg-primary" />
      </div>
    </AuthCard>
  );
}
