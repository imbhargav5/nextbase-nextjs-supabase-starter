BEGIN;
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

SELECT plan(6);

SELECT has_table('public', 'workspace_invitations', 'workspace_invitations table exists');
SELECT col_type_is('public', 'workspace_invitations', 'token', 'text', 'token is text');

INSERT INTO auth.users (id, email) VALUES
  ('88888888-8888-8888-8888-888888888888', 'admin@p.com'),
  ('99999999-9999-9999-9999-999999999999', 'outsider@p.com');
INSERT INTO public.workspaces (id, name, slug, owner_id) VALUES
  ('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3', 'WS I', 'ws-i', '88888888-8888-8888-8888-888888888888');
INSERT INTO public.workspace_members (workspace_id, user_id, role) VALUES
  ('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3', '88888888-8888-8888-8888-888888888888', 'owner');

SET LOCAL role authenticated;
SET LOCAL request.jwt.claim.sub = '88888888-8888-8888-8888-888888888888';
SELECT lives_ok(
  $$ INSERT INTO public.workspace_invitations (workspace_id, email, role, token, expires_at)
     VALUES ('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3', 'new@p.com', 'member', 'inv_test', now() + interval '7 days') $$,
  'admin can create an invitation'
);

SET LOCAL request.jwt.claim.sub = '99999999-9999-9999-9999-999999999999';
SELECT results_eq(
  'SELECT count(*) FROM public.workspace_invitations',
  ARRAY[0::bigint],
  'non-member cannot read invitations'
);

SET LOCAL request.jwt.claim.sub = '99999999-9999-9999-9999-999999999999';
SELECT lives_ok(
  $$ SELECT public.accept_invitation('inv_test') $$,
  'invitee can accept a valid invitation'
);
SELECT results_eq(
  $$ SELECT count(*) FROM public.workspace_members
     WHERE workspace_id = 'f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3'
       AND user_id = '99999999-9999-9999-9999-999999999999' $$,
  ARRAY[1::bigint],
  'accepting an invitation creates a membership'
);

SELECT * FROM finish();
ROLLBACK;
