'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/supabase-clients/client';

export function useTypingIndicator(channelId: string, userId: string, displayName: string) {
  const supabase = createClient();
  const channelRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const channel = supabase.channel(`typing:${channelId}`);
    channelRef.current = channel;
    channel.subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [channelId, supabase]);

  const startTyping = useCallback(() => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId, displayName, isTyping: true },
    });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => stopTyping(), 3000);
  }, [userId, displayName]);

  const stopTyping = useCallback(() => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId, displayName, isTyping: false },
    });
  }, [userId, displayName]);

  return { startTyping, stopTyping };
}