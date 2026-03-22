-- Migration 031: Rate Limits Table
-- ADDITIVE. Required for security.ts rate limiting functionality

create table public.rate_limits (
  id           uuid primary key default gen_random_uuid(),
  identifier   text not null,
  created_at   timestamptz default now()
);

-- Index for efficient rate limit queries
create index idx_rate_limits_identifier_created_at 
  on public.rate_limits (identifier, created_at);

-- RLS
alter table public.rate_limits enable row level security;

-- Allow anyone to insert rate limit records (for tracking)
create policy "Allow rate limit inserts"
  on public.rate_limits for insert
  with check (true);

-- Allow anyone to select rate limit records (for checking)
create policy "Allow rate limit selects"
  on public.rate_limits for select
  using (true);