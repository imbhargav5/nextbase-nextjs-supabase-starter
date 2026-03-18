'use client';

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/supabase-clients/client';

export function useRealtimeMessages(channelId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          // Append new message to query cache without a full refetch
          queryClient.setQueryData(
            ['messages', channelId],
            (old = []) => [...(old as Message[]), payload.new]
          );
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'messages',
          filter: `channel_id=eq.${channelId}` 
        },
        (payload) => {
          queryClient.setQueryData(
            ['messages', channelId],
            (old = []) => (old as Message[]).map(m => m.id === payload.new.id ? payload.new : m)
          );
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'DELETE', 
          schema: 'public', 
          table: 'messages',
          filter: `channel_id=eq.${channelId}` 
        },
        (payload) => {
          queryClient.setQueryData(
            ['messages', channelId],
            (old = []) => (old as Message[]).filter(m => m.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [channelId, supabase, queryClient]);
}