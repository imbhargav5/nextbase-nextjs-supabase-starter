-- Migration 005: Notifications

create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null
              check (type in ('invite','message','reaction','comment','team_update','role_change')),
  title       text not null,
  body        text,
  metadata    jsonb,
  is_read     boolean default false,
  created_at  timestamptz default now()
);

create index idx_notifications_user_unread on public.notifications(user_id, is_read, created_at desc);