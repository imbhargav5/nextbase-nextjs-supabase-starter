'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/supabase-clients/client';

export function useRealtimeNotifications(userId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.setQueryData(
            ['notifications', userId],
            (old = []) => [payload.new, ...(old as Notification[])]
          );
          // Update unread count in bell
          queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, supabase, queryClient]);
}