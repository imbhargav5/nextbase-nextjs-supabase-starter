'use client';

import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { createKitCheckoutSessionAction } from '@/data/user/kit-checkout';

interface KitCheckoutButtonProps {
  kitSlug: string;
  label?: string;
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function KitCheckoutButton({
  kitSlug,
  label = 'Get the kit',
  size = 'lg',
  className,
}: KitCheckoutButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { execute, isExecuting } = useAction(createKitCheckoutSessionAction, {
    onSuccess: ({ data }) => {
      if (data?.url) {
        setIsRedirecting(true);
        window.location.href = data.url;
        return;
      }
      toast.error('Checkout could not be started');
    },
    onError: ({ error }) => {
      const message =
        error.serverError ?? 'Checkout could not be started. Check Stripe configuration.';
      toast.error(message);
    },
  });

  function handleCheckout() {
    execute({ kitSlug });
  }

  return (
    <Button
      type="button"
      variant="brand"
      size={size}
      className={className}
      disabled={isExecuting || isRedirecting}
      onClick={handleCheckout}
    >
      {isExecuting || isRedirecting ? 'Redirecting…' : label}
    </Button>
  );
}
