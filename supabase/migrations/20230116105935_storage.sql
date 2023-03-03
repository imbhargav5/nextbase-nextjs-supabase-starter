CREATE TRIGGER on_auth_user_created_create_profile AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_auth_user_created();

CREATE TRIGGER on_auth_user_created_create_team AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_create_team_for_auth_user();

--  Create buckets
insert into storage.buckets (id, name)
values ('project-assets', 'project-assets')
ON CONFLICT DO NOTHING;

insert into storage.buckets (id, name)
values ('user-assets', 'user-assets')
ON CONFLICT DO NOTHING;

insert into storage.buckets (id, name, public)
values ('public-user-assets', 'public-user-assets', true)
ON CONFLICT DO NOTHING;

insert into storage.buckets (id, name, public)
values ('public-assets', 'public-assets', true)
ON CONFLICT DO NOTHING;

--  Create policies



drop policy if exists "Give users access to own folder 10fq7k5_0"
on "storage"."objects";
create policy "Give users access to own folder 10fq7k5_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'user-assets'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

drop policy if exists "Give users access to own folder 10fq7k5_1"
on "storage"."objects";
create policy "Give users access to own folder 10fq7k5_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'user-assets'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

drop policy if exists "Give users access to own folder 10fq7k5_2"
on "storage"."objects";
create policy "Give users access to own folder 10fq7k5_2"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'user-assets'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

drop policy if exists "Give users access to own folder 10fq7k5_3"
on "storage"."objects";
create policy "Give users access to own folder 10fq7k5_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'user-assets'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

drop policy if exists "Give users access to own folder 1plzjhd_0"
on "storage"."objects";
create policy "Give users access to own folder 1plzjhd_0"
on "storage"."objects"
as permissive
for select
to public
using (((bucket_id = 'public-user-assets'::text)));

drop policy if exists "Give users access to own folder 1plzjhd_1"
on "storage"."objects";
create policy "Give users access to own folder 1plzjhd_1"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'public-user-assets'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

drop policy if exists "Give users access to own folder 1plzjhd_2"
on "storage"."objects";
create policy "Give users access to own folder 1plzjhd_2"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'public-user-assets'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

drop policy if exists "Give users access to own folder 1plzjhd_3"
on "storage"."objects";
create policy "Give users access to own folder 1plzjhd_3"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'public-user-assets'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

drop policy if exists "anything 1plzjhd_0"
on "storage"."objects";
create policy "anything 1plzjhd_0"
on "storage"."objects"
as permissive
for update
to public
using (true);

drop policy if exists "anything 1plzjhd_1"
on "storage"."objects";
create policy "anything 1plzjhd_1"
on "storage"."objects"
as permissive
for select
to public
using (true);

drop policy if exists "anything 1plzjhd_2"
on "storage"."objects";
create policy "anything 1plzjhd_2"
on "storage"."objects"
as permissive
for delete
to public
using (true);

drop policy if exists "Public Access for public-assets 1plzjha_3"
on "storage"."objects";
create policy "Public Access for public-assets 1plzjha_3"
on storage.objects for select
using ( bucket_id = 'public-assets' );

INSERT INTO app_settings (id)
VALUES (1) ON CONFLICT DO NOTHING;


GRANT EXECUTE ON FUNCTION public.make_user_app_admin(uuid) TO PUBLIC;
REVOKE EXECUTE ON FUNCTION public.make_user_app_admin(uuid)
FROM anon;
REVOKE EXECUTE ON FUNCTION public.make_user_app_admin(uuid)
FROM authenticated;
GRANT EXECUTE ON FUNCTION public.make_user_app_admin(uuid) TO postgres;
GRANT EXECUTE ON FUNCTION public.make_user_app_admin(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.remove_app_admin_privilege_for_user(uuid) TO PUBLIC;
REVOKE EXECUTE ON FUNCTION public.remove_app_admin_privilege_for_user(uuid)
FROM anon;
REVOKE EXECUTE ON FUNCTION public.remove_app_admin_privilege_for_user(uuid)
FROM authenticated;
GRANT EXECUTE ON FUNCTION public.remove_app_admin_privilege_for_user(uuid) TO postgres;
GRANT EXECUTE ON FUNCTION public.remove_app_admin_privilege_for_user(uuid) TO service_role;