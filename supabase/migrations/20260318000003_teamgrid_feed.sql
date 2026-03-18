-- Migration 003: Feed, Posts, Comments, Reactions

create table public.posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.profiles(id) on delete cascade,
  team_id     uuid references public.teams(id) on delete cascade,
  content     text not null,
  rich_content jsonb,
  media_urls  text[] default '{}',
  visibility  text not null default 'public'
              check (visibility in ('public','team','private')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table public.comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  author_id   uuid not null references public.profiles(id) on delete cascade,
  parent_id   uuid references public.comments(id) on delete cascade,
  content     text not null,
  created_at  timestamptz default now()
);

create table public.reactions (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null check (type in ('like','fire','clap','trophy')),
  created_at  timestamptz default now(),
  unique (post_id, user_id)
);