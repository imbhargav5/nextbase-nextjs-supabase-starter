-- Migration 007: Row Level Security Policies

alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.team_invites enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.reactions enable row level security;
alter table public.channels enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.departments enable row level security;
alter table public.org_nodes enable row level security;
alter table public.titles enable row level security;

-- Helper: get current user's team role
create or replace function public.get_team_role(t_id uuid)
returns text language sql security definer as $$
  select team_role from public.team_members
  where team_id = t_id and user_id = auth.uid()
  limit 1;
$$;

-- Helper: is current user a member of a team
create or replace function public.is_team_member(t_id uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.team_members
    where team_id = t_id and user_id = auth.uid()
  );
$$;

-- PROFILES
create policy "Public profiles visible to all"
  on public.profiles for select to authenticated using (true);
create policy "Users update own profile"
  on public.profiles for update to authenticated using (auth.uid() = id);

-- TEAMS
create policy "Public teams visible to authenticated users"
  on public.teams for select to authenticated using (is_public = true or is_team_member(id));
create policy "Authenticated users create teams"
  on public.teams for insert to authenticated with check (auth.uid() = owner_id);
create policy "Owner or captain updates team"
  on public.teams for update to authenticated using (
    get_team_role(id) in ('owner','captain')
  );
create policy "Owner deletes team"
  on public.teams for delete to authenticated using (owner_id = auth.uid());

-- TEAM MEMBERS
create policy "Members see their team roster"
  on public.team_members for select to authenticated using (is_team_member(team_id));
create policy "Owner/captain manage members"
  on public.team_members for all to authenticated using (
    get_team_role(team_id) in ('owner','captain')
  );

-- POSTS
create policy "Public posts visible to authenticated users"
  on public.posts for select to authenticated using (
    visibility = 'public'
    or author_id = auth.uid()
    or (visibility = 'team' and team_id is not null and is_team_member(team_id))
  );
create policy "Authenticated users create posts"
  on public.posts for insert to authenticated with check (auth.uid() = author_id);
create policy "Authors update own posts"
  on public.posts for update to authenticated using (author_id = auth.uid());
create policy "Authors delete own posts"
  on public.posts for delete to authenticated using (author_id = auth.uid());

-- MESSAGES
create policy "Team members read channel messages"
  on public.messages for select to authenticated using (
    exists (
      select 1 from public.channels c
      where c.id = channel_id and is_team_member(c.team_id)
    )
  );
create policy "Team members send messages"
  on public.messages for insert to authenticated with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.channels c
      where c.id = channel_id and is_team_member(c.team_id)
    )
  );
create policy "Sender edits own messages"
  on public.messages for update to authenticated using (sender_id = auth.uid());
create policy "Sender deletes own messages"
  on public.messages for delete to authenticated using (sender_id = auth.uid());

-- NOTIFICATIONS
create policy "Users see own notifications"
  on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "Users update own notifications"
  on public.notifications for update to authenticated using (user_id = auth.uid());

-- CHANNELS
create policy "Team members see channels"
  on public.channels for select to authenticated using (is_team_member(team_id));
create policy "Owners/captains manage channels"
  on public.channels for all to authenticated using (
    get_team_role(team_id) in ('owner','captain','manager')
  );

-- ORG NODES
create policy "Team members view org chart"
  on public.org_nodes for select to authenticated using (is_team_member(team_id));
create policy "Owners/captains/managers edit org chart"
  on public.org_nodes for all to authenticated using (
    get_team_role(team_id) in ('owner','captain','manager')
  );

-- TITLES
create policy "Anyone reads system titles"
  on public.titles for select to authenticated using (team_id is null or is_team_member(team_id));
create policy "Owners/captains create custom titles"
  on public.titles for insert to authenticated with check (
    team_id is not null and
    get_team_role(team_id) in ('owner','captain')
  );
