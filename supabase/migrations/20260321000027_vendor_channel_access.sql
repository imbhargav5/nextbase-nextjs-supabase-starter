-- Migration 027: Vendor Channel Access
-- ADDITIVE: extends existing channel RLS with vendor contact access
-- Drop existing channel select policy and replace with extended version
-- that also grants vendor contact access to engagement channels

drop policy if exists "Team members see channels" on public.channels;

create policy "Team members or vendor contacts see channels"
  on public.channels for select
  using (
    public.is_team_member(team_id)
    or
    exists (
      select 1 from public.vendor_engagements ve
      join public.external_org_contacts c on c.org_id = ve.org_id
      where ve.channel_id = public.channels.id
      and c.user_id = auth.uid()
    )
  );

-- All other channel policies (insert/update/delete) remain unchanged