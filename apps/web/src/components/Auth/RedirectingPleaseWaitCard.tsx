'use client';
import { Settings } from 'lucide-react';

import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface RedirectingPleaseWaitCardProps {
  message: string;
  heading: string;
}

export function RedirectingPleaseWaitCard({
  message,
  heading,
}: RedirectingPleaseWaitCardProps) {
  return (
    <div>
      <Card className="w-full md:min-w-[440px] mx-auto mt-10 items-center">
        <CardHeader>
          <Settings className="size-10 mx-auto mb-4" />
          <CardTitle className="text-center">{heading}</CardTitle>
          <CardDescription className="text-center">{message}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
