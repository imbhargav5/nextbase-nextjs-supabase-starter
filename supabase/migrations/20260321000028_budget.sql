-- Migration 028: Budget & Resource Tracking
-- ADDITIVE. References existing public.teams, public.tasks, public.profiles

-- Budget envelopes per team (or per project)
create table public.budgets (
  id           uuid primary key default gen_random_uuid(),
  team_id      uuid not null references public.teams(id) on delete cascade,
  name         text not null,
  description  text,
  total_amount numeric(12,2) not null,
  currency     text default 'USD',
  period       text, -- e.g. "Q1 2025", "FY2025", "Project Alpha"
  status       text default 'active'
    check (status in ('active','locked','closed')),
  created_by   uuid not null references public.profiles(id),
  created_at   timestamptz default now()
);

-- Budget line items (allocated against tasks or categories)
create table public.budget_items (
  id           uuid primary key default gen_random_uuid(),
  budget_id    uuid not null references public.budgets(id) on delete cascade,
  task_id      uuid references public.tasks(id) on delete set null,
  -- references existing tasks table from Supplement 5
  engagement_id uuid references public.vendor_engagements(id) on delete set null,
  -- references new vendor engagements from Part 3
  category     text not null,
  description  text not null,
  estimated    numeric(12,2) not null default 0,
  actual       numeric(12,2) default 0,
  status       text default 'allocated'
    check (status in ('allocated','committed','spent','cancelled')),
  created_at   timestamptz default now()
);

-- Time tracking against tasks (extends existing tasks table)
create table public.time_entries (
  id           uuid primary key default gen_random_uuid(),
  task_id      uuid not null references public.tasks(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  hours        numeric(5,2) not null check (hours > 0 and hours <= 24),
  description  text,
  logged_date  date not null default current_date,
  created_at   timestamptz default now()
);

-- RLS
alter table public.budgets       enable row level security;
alter table public.budget_items  enable row level security;
alter table public.time_entries  enable row level security;

create policy "Team members see budgets"
  on public.budgets for select
  using (public.is_team_member(team_id));

create policy "Managers manage budgets"
  on public.budgets for all
  using (public.get_team_role(team_id) in ('owner','captain','manager'));

create policy "Team members see budget items"
  on public.budget_items for select
  using (exists(
    select 1 from public.budgets b
    where b.id = budget_id and public.is_team_member(b.team_id)
  ));

create policy "Members log their own time"
  on public.time_entries for insert
  with check (auth.uid() = user_id);

create policy "Team members see time entries"
  on public.time_entries for select
  using (exists(
    select 1 from public.tasks t
    where t.id = task_id and public.is_team_member(t.team_id)
  ));