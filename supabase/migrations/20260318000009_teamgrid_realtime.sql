-- Migration 009: Realtime Enable

-- Enable realtime on tables that need live updates
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.team_invites;
alter publication supabase_realtime add table public.reactions;
alter publication supabase_realtime add table public.team_members;