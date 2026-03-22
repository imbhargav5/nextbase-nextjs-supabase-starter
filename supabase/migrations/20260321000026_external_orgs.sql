-- Migration 026: External Parties & Vendor Layer
-- ADDITIVE. References existing public.profiles, public.teams,
--           public.channels, public.tasks, public.documents

-- External organization profiles
create table public.external_orgs (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text unique not null,
  description     text,
  category        text not null
    check (category in (
      'manufacturing','legal','marketing_agency','design_studio',
      'logistics','it_services','consulting','finance','pr',
      'recruitment','research','other'
    )),
  sub_categories  text[] default '{}',
  website         text,
  email           text,
  phone           text,
  location        text,
  country         text,
  logo_url        text,
  banner_url      text,
  is_verified     boolean default false,
  is_public       boolean default true,
  avg_rating      numeric(3,2) default 0,
  review_count    int default 0,
  tags            text[] default '{}',
  created_by      uuid not null references public.profiles(id),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Users who represent an external org (can be multiple contacts)
create table public.external_org_contacts (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.external_orgs(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  role        text default 'contact', -- e.g. "Account Manager", "Project Lead"
  is_primary  boolean default false,
  added_at    timestamptz default now(),
  unique (org_id, user_id)
);

-- A team engaging an external org for a project
create table public.vendor_engagements (
  id              uuid primary key default gen_random_uuid(),
  team_id         uuid not null references public.teams(id) on delete cascade,
  org_id          uuid not null references public.external_orgs(id),
  title           text not null,
  description     text,
  status          text default 'active'
    check (status in ('proposed','active','on_hold','completed','cancelled')),
  category        text,
  estimated_value numeric(12,2),
  currency        text default 'USD',
  starts_at       date,
  ends_at         date,
  channel_id      uuid references public.channels(id),
  -- Shared channel created from existing channels table (same schema)
  created_by      uuid not null references public.profiles(id),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Deliverable milestones within a vendor engagement
create table public.vendor_milestones (
  id               uuid primary key default gen_random_uuid(),
  engagement_id    uuid not null references public.vendor_engagements(id) on delete cascade,
  title            text not null,
  description      text,
  acceptance_criteria text,
  due_date         date,
  status           text default 'pending'
    check (status in ('pending','submitted','approved','revision_required')),
  submitted_by     uuid references public.profiles(id),
  approved_by      uuid references public.profiles(id),
  submitted_at     timestamptz,
  approved_at      timestamptz,
  sort_order       int default 0,
  created_at       timestamptz default now()
);

-- Invoice requests from external orgs
create table public.vendor_invoices (
  id              uuid primary key default gen_random_uuid(),
  engagement_id   uuid not null references public.vendor_engagements(id) on delete cascade,
  milestone_id    uuid references public.vendor_milestones(id),
  submitted_by    uuid not null references public.profiles(id),
  amount          numeric(12,2) not null,
  currency        text default 'USD',
  description     text not null,
  line_items      jsonb, -- [{ description, quantity, unit_price, total }]
  status          text default 'pending'
    check (status in ('pending','approved','disputed','paid')),
  due_date        date,
  notes           text,
  created_at      timestamptz default now()
);

-- RFP (Request for Proposal) posts
create table public.rfp_posts (
  id              uuid primary key default gen_random_uuid(),
  team_id         uuid not null references public.teams(id) on delete cascade,
  created_by      uuid not null references public.profiles(id),
  title           text not null,
  description     text not null,
  category        text not null,
  budget_min      numeric(12,2),
  budget_max      numeric(12,2),
  currency        text default 'USD',
  deadline        date,
  requirements    text[],
  is_public       boolean default true,
  status          text default 'open'
    check (status in ('open','reviewing','closed','awarded')),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- External org responses to RFPs
create table public.rfp_responses (
  id          uuid primary key default gen_random_uuid(),
  rfp_id      uuid not null references public.rfp_posts(id) on delete cascade,
  org_id      uuid not null references public.external_orgs(id) on delete cascade,
  submitted_by uuid not null references public.profiles(id),
  proposal    text not null,
  proposed_budget numeric(12,2),
  timeline_days int,
  attachments jsonb,
  status      text default 'submitted'
    check (status in ('submitted','shortlisted','rejected','awarded')),
  submitted_at timestamptz default now(),
  unique (rfp_id, org_id)
);

-- Ratings for external orgs (after engagement completion)
create table public.vendor_ratings (
  id            uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.vendor_engagements(id) on delete cascade,
  org_id        uuid not null references public.external_orgs(id),
  rated_by      uuid not null references public.profiles(id),
  rating        int not null check (rating between 1 and 5),
  quality       int check (quality between 1 and 5),
  communication int check (communication between 1 and 5),
  timeliness    int check (timeliness between 1 and 5),
  review_text   text,
  created_at    timestamptz default now(),
  unique (engagement_id, rated_by)
);

-- RLS
alter table public.external_orgs          enable row level security;
alter table public.external_org_contacts  enable row level security;
alter table public.vendor_engagements     enable row level security;
alter table public.vendor_milestones      enable row level security;
alter table public.vendor_invoices        enable row level security;
alter table public.rfp_posts              enable row level security;
alter table public.rfp_responses          enable row level security;
alter table public.vendor_ratings         enable row level security;

-- Public orgs visible to all
create policy "Public orgs visible to all"
  on public.external_orgs for select using (is_public = true);

-- Org contacts see and manage their org
create policy "Contacts manage their org"
  on public.external_orgs for all
  using (exists(
    select 1 from public.external_org_contacts
    where org_id = id and user_id = auth.uid()
  ));

-- Team members see their engagements
create policy "Team members see engagements"
  on public.vendor_engagements for select
  using (public.is_team_member(team_id));

-- Team owners/captains/managers manage engagements
create policy "Managers manage engagements"
  on public.vendor_engagements for all
  using (public.get_team_role(team_id) in ('owner','captain','manager'));

-- Org contacts also see engagements they're part of
create policy "Vendor contacts see their engagements"
  on public.vendor_engagements for select
  using (exists(
    select 1 from public.external_org_contacts c
    where c.org_id = org_id and c.user_id = auth.uid()
  ));

-- Milestones visible to team + vendor
create policy "Engagement parties see milestones"
  on public.vendor_milestones for select
  using (exists(
    select 1 from public.vendor_engagements e
    where e.id = engagement_id
    and (public.is_team_member(e.team_id)
      or exists(
        select 1 from public.external_org_contacts c
        where c.org_id = e.org_id and c.user_id = auth.uid()
      )
    )
  ));

-- Public RFPs visible to all
create policy "Public RFPs visible"
  on public.rfp_posts for select
  using (is_public = true or public.is_team_member(team_id));