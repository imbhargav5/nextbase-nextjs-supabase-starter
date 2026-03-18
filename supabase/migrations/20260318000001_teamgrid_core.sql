-- Migration 001: Core User & Team Models

-- Extend auth.users with profile data
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  username        text unique not null,
  display_name    text not null,
  avatar_url      text,
  banner_url      text,
  bio             text,
  headline        text,
  location        text,
  skills          text[] default '{}',
  system_role     text not null default 'user'
                  check (system_role in ('user','moderator','admin','superadmin')),
  is_verified     boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table public.teams (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  description text,
  avatar_url  text,
  banner_url  text,
  is_public   boolean default true,
  max_size    int default 11,
  owner_id    uuid not null references public.profiles(id) on delete restrict,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table public.team_members (
  id           uuid primary key default gen_random_uuid(),
  team_id      uuid not null references public.teams(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  team_role    text not null default 'player'
               check (team_role in ('owner','captain','manager','player','viewer')),
  access_level text not null default 'member'
               check (access_level in ('admin','member','readonly')),
  position     text,
  department_id uuid,
  title_id     uuid,
  stats        jsonb default '{"score":0,"posts_this_week":0,"reactions_received":0,"messages_this_week":0,"contributions":0}',
  joined_at    timestamptz default now(),
  unique (team_id, user_id)
);

create table public.team_invites (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references public.teams(id) on delete cascade,
  sender_id   uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  status      text not null default 'pending'
              check (status in ('pending','accepted','declined','expired')),
  position    text,
  message     text,
  expires_at  timestamptz not null default (now() + interval '7 days'),
  created_at  timestamptz default now()
);