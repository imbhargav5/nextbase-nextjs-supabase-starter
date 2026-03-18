-- Migration 004: Channels, Messages (replaces Socket.io persistence)

create table public.channels (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references public.teams(id) on delete cascade,
  name        text not null,
  description text,
  is_private  boolean default false,
  created_at  timestamptz default now()
);

create table public.messages (
  id          uuid primary key default gen_random_uuid(),
  channel_id  uuid not null references public.channels(id) on delete cascade,
  sender_id   uuid not null references public.profiles(id) on delete cascade,
  content     text not null,
  rich_content jsonb,
  attachments jsonb,
  parent_id   uuid references public.messages(id) on delete cascade,
  is_edited   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Index for fast channel message queries
create index idx_messages_channel_created on public.messages(channel_id, created_at desc);