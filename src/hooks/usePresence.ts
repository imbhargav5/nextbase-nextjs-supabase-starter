'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/supabase-clients/client';

interface PresenceState {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  onlineAt: string;
}

export function useTeamPresence(teamId: string, currentUser: PresenceState) {
  const supabase = createClient();
  const [onlineUsers, setOnlineUsers] = useState<PresenceState[]>([]);

  useEffect(() => {
    const channel = supabase.channel(`presence:team:${teamId}`, {
      config: { presence: { key: currentUser.userId } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<PresenceState>();
        const users = Object.values(state).flat();
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track(currentUser);
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, [teamId, currentUser.userId]);

  return { onlineUsers };
}