-- Migration 024: OKR + Delegation Engine
-- ADDITIVE. References existing public.teams, public.profiles, public.tasks

-- Objectives table (company → department → individual cascade)
create table public.objectives (
  id            uuid primary key default gen_random_uuid(),
  team_id       uuid not null references public.teams(id) on delete cascade,
  owner_id      uuid not null references public.profiles(id),
  parent_id     uuid references public.objectives(id) on delete set null,
  -- parent_id enables company → department → individual cascade
  title         text not null,
  description   text,
  period        text not null, -- e.g. "Q1 2025", "FY2025", "Sprint 3"
  status        text default 'on_track'
    check (status in ('on_track','at_risk','off_track','completed','cancelled')),
  progress_pct  int default 0 check (progress_pct between 0 and 100),
  is_public     boolean default true, -- visible to all team members
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Key results table
create table public.key_results (
  id             uuid primary key default gen_random_uuid(),
  objective_id   uuid not null references public.objectives(id) on delete cascade,
  assigned_to    uuid references public.profiles(id) on delete set null,
  title          text not null,
  metric_type    text default 'percentage'
    check (metric_type in ('percentage','number','currency','boolean')),
  start_value    numeric(12,2) default 0,
  target_value   numeric(12,2) not null,
  current_value  numeric(12,2) default 0,
  unit           text, -- e.g. "users", "$", "%", "NPS points"
  status         text default 'on_track'
    check (status in ('on_track','at_risk','off_track','completed')),
  due_date       date,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- Key result check-ins (progress updates with notes)
create table public.kr_checkins (
  id            uuid primary key default gen_random_uuid(),
  kr_id         uuid not null references public.key_results(id) on delete cascade,
  user_id       uuid not null references public.profiles(id),
  new_value     numeric(12,2) not null,
  confidence    int check (confidence between 1 and 10),
  note          text,
  created_at    timestamptz default now()
);

-- Link tasks to key results (existing tasks table from Supplement 5)
create table public.kr_tasks (
  kr_id    uuid not null references public.key_results(id) on delete cascade,
  task_id  uuid not null references public.tasks(id) on delete cascade,
  primary key (kr_id, task_id)
);

-- Delegation log (tracks re-assignment chains on tasks)
-- Extends existing public.tasks — no modification to tasks table needed
create table public.task_delegation_log (
  id             uuid primary key default gen_random_uuid(),
  task_id        uuid not null references public.tasks(id) on delete cascade,
  delegated_from uuid not null references public.profiles(id),
  delegated_to   uuid not null references public.profiles(id),
  reason         text,
  delegated_at   timestamptz default now()
);

-- RLS
alter table public.objectives           enable row level security;
alter table public.key_results          enable row level security;
alter table public.kr_checkins          enable row level security;
alter table public.kr_tasks             enable row level security;
alter table public.task_delegation_log  enable row level security;

create policy "Team members see objectives"
  on public.objectives for select
  using (public.is_team_member(team_id));

create policy "Owners/captains/managers create objectives"
  on public.objectives for insert
  with check (
    public.get_team_role(team_id) in ('owner','captain','manager')
    and auth.uid() = owner_id
  );

create policy "Team members see key results"
  on public.key_results for select
  using (
    exists (
      select 1 from public.objectives o
      where o.id = objective_id and public.is_team_member(o.team_id)
    )
  );

create policy "Assignee or manager updates KR"
  on public.key_results for update
  using (
    assigned_to = auth.uid() or
    exists (
      select 1 from public.objectives o
      where o.id = objective_id
      and public.get_team_role(o.team_id) in ('owner','captain','manager')
    )
  );

create policy "Members submit checkins"
  on public.kr_checkins for insert
  with check (auth.uid() = user_id);

create policy "Team members see delegation log"
  on public.task_delegation_log for select
  using (
    delegated_from = auth.uid() or delegated_to = auth.uid() or
    exists (
      select 1 from public.tasks t
      where t.id = task_id
      and public.get_team_role(t.team_id) in ('owner','captain','manager')
    )
  );

-- Realtime: managers see KR updates as they happen
alter publication supabase_realtime add table public.key_results;
alter publication supabase_realtime add table public.kr_checkins;