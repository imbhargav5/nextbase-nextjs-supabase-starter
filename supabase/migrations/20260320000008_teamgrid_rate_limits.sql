-- Migration 008: Rate Limits Table

create table if not exists public.rate_limits (
  id uuid default gen_random_uuid() primary key,
  identifier text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.rate_limits enable row level security;

-- Create index for performance
create index if not exists idx_rate_limits_identifier_created_at 
on public.rate_limits (identifier, created_at);

-- RLS policies for rate limits
create policy "Admin access to rate limits"
  on public.rate_limits for all to authenticated using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- Clean up old entries function
create or replace function cleanup_rate_limits()
returns void language plpgsql security definer as $$
begin
  delete from public.rate_limits 
  where created_at < now() - interval '1 hour';
end;
$$;

-- Schedule cleanup (requires pg_cron extension)
-- select cron.schedule('cleanup-rate-limits', '0 * * * *', 'select cleanup_rate_limits();');