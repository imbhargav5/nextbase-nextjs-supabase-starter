-- Migration 002: Org Chart, Departments, Titles

create table public.departments (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references public.teams(id) on delete cascade,
  name        text not null,
  color       text default '#6366f1',
  icon        text,
  description text,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

create table public.titles (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  level       int default 0,
  category    text default 'general'
              check (category in ('executive','technical','legal','finance','hr','operations','marketing','general')),
  is_custom   boolean default false,
  team_id     uuid references public.teams(id) on delete cascade,
  created_at  timestamptz default now()
);

create table public.org_nodes (
  id             uuid primary key default gen_random_uuid(),
  team_id        uuid not null references public.teams(id) on delete cascade,
  user_id        uuid not null references public.profiles(id) on delete cascade,
  department_id  uuid references public.departments(id) on delete set null,
  title_id       uuid references public.titles(id) on delete set null,
  custom_title   text,
  parent_node_id uuid references public.org_nodes(id) on delete set null,
  sort_order     int default 0,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now(),
  unique (team_id, user_id)
);

-- Add FK from team_members to departments/titles (after both tables exist)
alter table public.team_members
  add constraint fk_department foreign key (department_id)
    references public.departments(id) on delete set null,
  add constraint fk_title foreign key (title_id)
    references public.titles(id) on delete set null;