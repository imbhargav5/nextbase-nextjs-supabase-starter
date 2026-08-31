import type { ReactNode } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  icon,
  className,
}: AuthCardProps) {
  return (
    <Card className={cn('w-full border-border/70 shadow-sm', className)}>
      <CardHeader className="space-y-3">
        {icon ? (
          <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/50 text-foreground">
            {icon}
          </div>
        ) : null}
        <div className="space-y-1.5">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="leading-6">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer ? (
        <CardFooter className="border-t bg-muted/30 py-4">{footer}</CardFooter>
      ) : null}
    </Card>
  );
}
