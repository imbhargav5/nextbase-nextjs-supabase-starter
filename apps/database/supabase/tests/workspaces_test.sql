BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

SELECT plan(14);

-- Schema
SELECT has_table('public', 'workspaces', 'workspaces table exists');
SELECT has_table('public', 'workspace_members', 'workspace_members table exists');
SELECT col_type_is('public', 'workspaces', 'owner_id', 'uuid', 'workspaces.owner_id is uuid');
SELECT col_type_is('public', 'workspace_members', 'role', 'text', 'workspace_members.role is text');

-- RLS enabled
SELECT is(
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.workspaces'::regclass),
  true,
  'RLS enabled on workspaces'
);
SELECT is(
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.workspace_members'::regclass),
  true,
  'RLS enabled on workspace_members'
);

SELECT has_function('public', 'is_workspace_member', ARRAY['uuid'], 'is_workspace_member(uuid) exists');
SELECT has_function('public', 'has_workspace_role', ARRAY['uuid', 'text[]'], 'has_workspace_role(uuid, text[]) exists');

-- Seed two users + two workspaces (as superuser, bypassing RLS)
INSERT INTO auth.users (id, email) VALUES
  ('11111111-1111-1111-1111-111111111111', 'owner-a@test.com'),
  ('22222222-2222-2222-2222-222222222222', 'owner-b@test.com');

INSERT INTO public.workspaces (id, name, slug, owner_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Workspace A', 'ws-a', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Workspace B', 'ws-b', '22222222-2222-2222-2222-222222222222');

INSERT INTO public.workspace_members (workspace_id, user_id, role) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'owner');

-- Act as user A
SET LOCAL role authenticated;
SET LOCAL request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';

SELECT results_eq(
  'SELECT count(*) FROM public.workspaces',
  ARRAY[1::bigint],
  'User A sees only their own workspace'
);

SELECT is(
  (SELECT name FROM public.workspaces LIMIT 1),
  'Workspace A',
  'User A sees Workspace A'
);

SELECT is(
  public.is_workspace_member('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  false,
  'User A is not a member of Workspace B'
);

SELECT results_eq(
  $$ WITH u AS (UPDATE public.workspaces SET name = 'Hacked'
       WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' RETURNING 1)
     SELECT count(*) FROM u $$,
  ARRAY[0::bigint],
  'User A cannot update Workspace B (0 rows affected)'
);

SELECT lives_ok(
  $$ SELECT public.create_workspace('Second WS', 'second-ws') $$,
  'User A can create a workspace via RPC'
);

SELECT results_eq(
  $$ SELECT count(*) FROM public.workspace_members
     WHERE user_id = '11111111-1111-1111-1111-111111111111' AND role = 'owner' $$,
  ARRAY[2::bigint],
  'create_workspace inserts an owner membership for the caller'
);

SELECT * FROM finish();
ROLLBACK;
