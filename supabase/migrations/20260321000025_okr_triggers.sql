-- Migration 025: OKR Triggers
-- Auto-calculates objective progress % when any KR is updated

create or replace function public.update_objective_progress()
returns trigger language plpgsql security definer as $$
declare
  obj_id uuid;
  avg_progress numeric;
begin
  obj_id := new.objective_id;
  
  -- Average progress across all KRs for this objective
  select avg(
    case when metric_type = 'boolean' then
      case when current_value >= target_value then 100 else 0 end
    else
      least(100, (current_value - start_value) / nullif(target_value - start_value, 0) * 100)
    end
  ) into avg_progress
  from public.key_results
  where objective_id = obj_id;
  
  update public.objectives
  set progress_pct = coalesce(avg_progress::int, 0),
      updated_at = now()
  where id = obj_id;
  
  return new;
end;
$$;

create trigger on_kr_updated
  after update on public.key_results
  for each row execute function public.update_objective_progress();