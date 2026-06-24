BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

SELECT plan(8);

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

SELECT * FROM finish();
ROLLBACK;
