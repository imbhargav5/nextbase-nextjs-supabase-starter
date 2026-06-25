CREATE OR REPLACE FUNCTION public.accept_invitation(p_token text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_inv public.workspace_invitations;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_inv
  FROM public.workspace_invitations
  WHERE token = p_token AND status = 'pending' AND expires_at > now();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation invalid or expired';
  END IF;

  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (v_inv.workspace_id, v_user_id, v_inv.role)
  ON CONFLICT (workspace_id, user_id) DO NOTHING;

  UPDATE public.workspace_invitations SET status = 'accepted' WHERE id = v_inv.id;
  RETURN v_inv.workspace_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_invitation_preview(p_token text)
RETURNS TABLE (workspace_name text, role text, valid boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
STABLE
AS $$
BEGIN
  RETURN QUERY
    SELECT w.name,
           i.role,
           (i.status = 'pending' AND i.expires_at > now()) AS valid
    FROM public.workspace_invitations i
    JOIN public.workspaces w ON w.id = i.workspace_id
    WHERE i.token = p_token
    LIMIT 1;
END;
$$;

REVOKE ALL ON FUNCTION public.accept_invitation(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.accept_invitation(text) TO authenticated;
REVOKE ALL ON FUNCTION public.get_invitation_preview(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_invitation_preview(text) TO authenticated;
