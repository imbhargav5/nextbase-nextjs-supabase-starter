CREATE OR REPLACE FUNCTION public.get_workspace_members(p_workspace_id uuid)
RETURNS TABLE (user_id uuid, email text, role text, created_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
STABLE
AS $$
BEGIN
  IF NOT public.is_workspace_member(p_workspace_id) THEN
    RETURN;
  END IF;
  RETURN QUERY
    SELECT m.user_id, u.email::text, m.role, m.created_at
    FROM public.workspace_members m
    JOIN auth.users u ON u.id = m.user_id
    WHERE m.workspace_id = p_workspace_id
    ORDER BY m.created_at ASC;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_workspace_members(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_workspace_members(uuid) TO authenticated;
