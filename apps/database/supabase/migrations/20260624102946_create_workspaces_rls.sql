CREATE OR REPLACE FUNCTION public.is_workspace_member(p_workspace_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members m
    WHERE m.workspace_id = p_workspace_id
      AND m.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.current_workspace_role(p_workspace_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
STABLE
AS $$
  SELECT m.role FROM public.workspace_members m
  WHERE m.workspace_id = p_workspace_id
    AND m.user_id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_workspace_role(p_workspace_id uuid, p_roles text[])
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members m
    WHERE m.workspace_id = p_workspace_id
      AND m.user_id = auth.uid()
      AND m.role = ANY (p_roles)
  );
$$;

-- workspaces policies (no INSERT policy: creation goes through create_workspace RPC)
CREATE POLICY workspaces_select ON public.workspaces
  FOR SELECT USING (public.is_workspace_member(id));
CREATE POLICY workspaces_update ON public.workspaces
  FOR UPDATE USING (public.has_workspace_role(id, ARRAY['owner', 'admin']))
  WITH CHECK (public.has_workspace_role(id, ARRAY['owner', 'admin']));
CREATE POLICY workspaces_delete ON public.workspaces
  FOR DELETE USING (public.has_workspace_role(id, ARRAY['owner']));

-- workspace_members policies
CREATE POLICY members_select ON public.workspace_members
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY members_insert ON public.workspace_members
  FOR INSERT WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));
CREATE POLICY members_update ON public.workspace_members
  FOR UPDATE USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']))
  WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));
CREATE POLICY members_delete ON public.workspace_members
  FOR DELETE USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']));

CREATE OR REPLACE FUNCTION public.create_workspace(p_name text, p_slug text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_workspace_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.workspaces (name, slug, owner_id)
  VALUES (p_name, p_slug, v_user_id)
  RETURNING id INTO v_workspace_id;

  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (v_workspace_id, v_user_id, 'owner');

  RETURN v_workspace_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_workspace(text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.create_workspace(text, text) TO authenticated;
