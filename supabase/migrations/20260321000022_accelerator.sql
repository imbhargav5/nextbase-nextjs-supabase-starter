-- Migration 022: Accelerator / Cohort System
-- ADDITIVE ONLY. References existing public.teams and public.profiles.
-- A cohort is a program run BY a host team, containing participant teams

-- A cohort is a program run BY a host team, containing participant teams
create table public.cohorts (
  id              uuid primary key default gen_random_uuid(),
  host_team_id    uuid not null references public.teams(id) on delete cascade,
  name            text not null,
  description     text,
  program_type    text default 'accelerator'
    check (program_type in (
      'accelerator','incubator','innovation_lab',
      'competition','internal_program','consulting_engagement'
    )),
  status          text default 'draft'
    check (status in ('draft','accepting','active','completed','archived')),
  starts_at       date,
  ends_at         date,
  max_teams       int default 20,
  application_url text, -- external apply link or null for invite-only
  is_public       boolean default false,
  banner_url      text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Teams enrolled in a cohort (participant teams)
create table public.cohort_teams (
  id            uuid primary key default gen_random_uuid(),
  cohort_id     uuid not null references public.cohorts(id) on delete cascade,
  team_id       uuid not null references public.teams(id) on delete cascade,
  status        text default 'active'
    check (status in ('applied','active','graduated','withdrawn')),
  applied_at    timestamptz default now(),
  graduated_at  timestamptz,
  unique (cohort_id, team_id)
);

-- Program phases (e.g. "Build", "Validate", "Pitch")
create table public.cohort_phases (
  id          uuid primary key default gen_random_uuid(),
  cohort_id   uuid not null references public.cohorts(id) on delete cascade,
  name        text not null,
  description text,
  phase_order int not null default 0,
  starts_at   date,
  ends_at     date,
  created_at  timestamptz default now()
);

-- Weekly team updates (YC-style partner meeting replacement)
create table public.cohort_updates (
  id              uuid primary key default gen_random_uuid(),
  cohort_id       uuid not null references public.cohorts(id) on delete cascade,
  team_id         uuid not null references public.teams(id) on delete cascade,
  phase_id        uuid references public.cohort_phases(id),
  week_number     int not null,
  revenue_this_wk numeric(12,2) default 0,
  revenue_last_wk numeric(12,2) default 0,
  active_users    int default 0,
  top_achievement text,
  biggest_blocker text,
  ask_for_help    text,
  morale          int check (morale between 1 and 5),
  submitted_by    uuid not null references public.profiles(id),
  submitted_at    timestamptz default now()
);

-- Mentor/Advisor assignments to cohort teams
create table public.cohort_mentors (
  id          uuid primary key default gen_random_uuid(),
  cohort_id   uuid not null references public.cohorts(id) on delete cascade,
  mentor_id   uuid not null references public.profiles(id) on delete cascade,
  team_id     uuid references public.teams(id) on delete cascade,
  -- null team_id = mentor for entire cohort, set = mentor for one team
  expertise   text[],
  is_lead     boolean default false,
  assigned_at timestamptz default now(),
  unique (cohort_id, mentor_id, team_id)
);

-- Demo Day: public pitch profiles for cohort teams
create table public.demo_day_profiles (
  id              uuid primary key default gen_random_uuid(),
  cohort_id       uuid not null references public.cohorts(id) on delete cascade,
  team_id         uuid not null references public.teams(id) on delete cascade,
  tagline         text not null,
  problem         text,
  solution        text,
  traction        text,
  team_bio        text,
  pitch_deck_path text, -- Supabase Storage path (documents bucket)
  video_url       text, -- external video or internal upload
  funding_ask     numeric(12,2),
  funding_stage   text check (funding_stage in (
    'pre_seed','seed','series_a','series_b','grant','none'
  )),
  is_published    boolean default false,
  view_count      int default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique (cohort_id, team_id)
);

-- Investor interest (users flagging interest in Demo Day companies)
create table public.investor_interest (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.demo_day_profiles(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  intent      text default 'interested'
    check (intent in ('interested','meeting_requested','passed')),
  note        text,
  created_at  timestamptz default now(),
  unique (profile_id, user_id)
);

-- RLS
alter table public.cohorts              enable row level security;
alter table public.cohort_teams         enable row level security;
alter table public.cohort_phases        enable row level security;
alter table public.cohort_updates       enable row level security;
alter table public.cohort_mentors       enable row level security;
alter table public.demo_day_profiles    enable row level security;
alter table public.investor_interest    enable row level security;

-- Anyone sees public cohorts
create policy "Public cohorts visible"
  on public.cohorts for select
  using (is_public = true or public.is_team_member(host_team_id));

-- Host team manages cohort
create policy "Host team manages cohort"
  on public.cohorts for all
  using (public.get_team_role(host_team_id) in ('owner','captain','manager'));

-- Cohort participants see their own data
create policy "Cohort team members see updates"
  on public.cohort_updates for select
  using (
    public.is_team_member(team_id) or
    exists (
      select 1 from public.cohorts c
      where c.id = cohort_id
      and public.is_team_member(c.host_team_id)
    )
  );

-- Public Demo Day profiles visible to all
create policy "Published demo profiles visible"
  on public.demo_day_profiles for select
  using (is_published = true or public.is_team_member(team_id));

-- Mentor access
create policy "Mentors see assigned teams"
  on public.cohort_mentors for select
  using (mentor_id = auth.uid() or
    exists (
      select 1 from public.cohorts c
      where c.id = cohort_id
      and public.is_team_member(c.host_team_id)
    )
  );