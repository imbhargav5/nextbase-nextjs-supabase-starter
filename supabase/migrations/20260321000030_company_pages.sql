-- Migration 030: Public Company Pages
-- ADDITIVE. Extends existing public.teams.
-- Public company page (opt-in extension of a team)

-- Public company page (opt-in extension of a team)
create table public.company_pages (
  id               uuid primary key default gen_random_uuid(),
  team_id          uuid not null references public.teams(id) on delete cascade,
  tagline          text,
  industry         text,
  stage            text check (stage in (
    'idea','mvp','pre_seed','seed','series_a',
    'series_b','growth','public','nonprofit','other'
  )),
  founded_year     int,
  employee_range   text check (employee_range in (
    '1-5','6-10','11-25','26-50','51-100',
    '101-250','251-500','500+'
  )),
  website          text,
  linkedin_url     text,
  twitter_url      text,
  locations        text[],
  tech_stack       text[],
  is_hiring        boolean default false,
  is_published     boolean default false,
  view_count       int default 0,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now(),
  unique (team_id)
);

-- Open positions (team is hiring)
create table public.open_positions (
  id              uuid primary key default gen_random_uuid(),
  team_id         uuid not null references public.teams(id) on delete cascade,
  title           text not null,
  department      text,
  location        text,
  is_remote       boolean default true,
  type            text default 'full_time'
    check (type in ('full_time','part_time','contract','internship','agency')),
  compensation    text, -- e.g. "$80k-$120k" or "Equity only"
  description     text not null,
  requirements    text[],
  skills_needed   text[],
  apply_url       text, -- external link or null for in-platform apply
  is_active       boolean default true,
  posted_at       timestamptz default now(),
  closes_at       timestamptz,
  created_at      timestamptz default now()
);

-- Applications via platform (if apply_url is null)
create table public.position_applications (
  id           uuid primary key default gen_random_uuid(),
  position_id  uuid not null references public.open_positions(id) on delete cascade,
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  cover_note   text,
  resume_path  text, -- Supabase Storage (documents bucket — already exists)
  status       text default 'submitted'
    check (status in ('submitted','reviewing','interview','offer','rejected')),
  submitted_at timestamptz default now(),
  unique (position_id, applicant_id)
);

-- RLS
alter table public.company_pages         enable row level security;
alter table public.open_positions        enable row level security;
alter table public.position_applications enable row level security;

create policy "Published company pages visible to all"
  on public.company_pages for select
  using (is_published = true or public.is_team_member(team_id));

create policy "Team owner manages company page"
  on public.company_pages for all
  using (public.get_team_role(team_id) in ('owner','captain'));

create policy "Active positions visible to all"
  on public.open_positions for select
  using (is_active = true or public.is_team_member(team_id));

create policy "Managers manage positions"
  on public.open_positions for all
  using (public.get_team_role(team_id) in ('owner','captain','manager'));

create policy "Applicants see own applications"
  on public.position_applications for select
  using (applicant_id = auth.uid() or
    public.get_team_role(
      (select team_id from public.open_positions p where p.id = position_id)
    ) in ('owner','captain','manager')
  );