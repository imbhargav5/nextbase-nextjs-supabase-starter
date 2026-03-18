-- Migration 008: Default Department Auto-Seed Function

-- Called automatically when a team is created via trigger
create or replace function public.seed_default_departments()
returns trigger language plpgsql security definer as $$
begin
  insert into public.departments (team_id, name, color, icon, sort_order) values
    (new.id, 'Executive',     '#1e293b', '👑', 0),
    (new.id, 'Engineering',   '#6366f1', '⚙️',  1),
    (new.id, 'DevOps',        '#0ea5e9', '🔧', 2),
    (new.id, 'Product',       '#8b5cf6', '🎯', 3),
    (new.id, 'Marketing',     '#f59e0b', '📣', 4),
    (new.id, 'Sales',         '#10b981', '📈', 5),
    (new.id, 'Legal',         '#dc2626', '⚖️',  6),
    (new.id, 'Finance',       '#059669', '💰', 7),
    (new.id, 'HR',            '#ec4899', '🤝', 8),
    (new.id, 'Manufacturing', '#78716c', '🏭', 9),
    (new.id, 'Production',    '#f97316', '📦', 10),
    (new.id, 'Design',        '#a855f7', '🎨', 11);

  -- Auto-add owner as first member with owner role
  insert into public.team_members (team_id, user_id, team_role, access_level)
  values (new.id, new.owner_id, 'owner', 'admin');

  -- Auto-create #general channel
  insert into public.channels (team_id, name, description)
  values (new.id, 'general', 'General team discussion');

  return new;
end;
$$;

create trigger on_team_created
  after insert on public.teams
  for each row execute function public.seed_default_departments();