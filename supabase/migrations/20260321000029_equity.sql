-- Migration 029: Equity Display Layer
-- ADDITIVE. Extends existing public.team_members and public.org_nodes.
-- THIS IS DISPLAY ONLY — no legal enforcement, not a cap table tool.
-- Legal cap tables must use Pulley, Carta, or Cake Equity.

-- Equity pool definition per team
create table public.equity_pools (
  id              uuid primary key default gen_random_uuid(),
  team_id         uuid not null references public.teams(id) on delete cascade,
  total_shares    bigint not null default 10000000,
  pool_name       text default 'Common Stock',
  currency        text default 'USD',
  last_valuation  numeric(15,2),
  valuation_date  date,
  external_tool   text check (external_tool in ('pulley','carta','cake','capdesk','other')),
  external_url    text, -- deep link to external cap table tool
  created_at      timestamptz default now(),
  unique (team_id)
);

-- Individual equity grants (display layer only)
create table public.equity_grants (
  id              uuid primary key default gen_random_uuid(),
  pool_id         uuid not null references public.equity_pools(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  grant_type      text default 'common'
    check (grant_type in (
      'common','preferred','option','safe','warrant','phantom'
    )),
  shares          bigint not null,
  grant_date      date not null,
  cliff_months    int default 12,
  vest_months     int default 48,
  strike_price    numeric(10,6), -- for options
  notes           text,
  is_visible_to_recipient boolean default true,
  created_by      uuid not null references public.profiles(id),
  created_at      timestamptz default now()
);

-- RLS
alter table public.equity_pools   enable row level security;
alter table public.equity_grants  enable row level security;

create policy "Team members see pool summary"
  on public.equity_pools for select
  using (public.is_team_member(team_id));

create policy "Owners manage equity pool"
  on public.equity_pools for all
  using (public.get_team_role(team_id) = 'owner');

-- Recipients see their own grant; owners/captains see all
create policy "Grantees and owners see grants"
  on public.equity_grants for select
  using (
    user_id = auth.uid() and is_visible_to_recipient = true
    or
    exists (
      select 1 from public.equity_pools p
      where p.id = pool_id
      and public.get_team_role(p.team_id) in ('owner','captain')
    )
  );