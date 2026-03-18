export const PERMISSIONS = {
  'team:delete':             ['owner'],
  'team:edit_settings':      ['owner', 'captain'],
  'team:invite_members':     ['owner', 'captain', 'manager'],
  'team:remove_member':      ['owner', 'captain'],
  'team:assign_roles':       ['owner', 'captain'],
  'team:assign_titles':      ['owner', 'captain'],
  'team:manage_org_chart':   ['owner', 'captain', 'manager'],
  'team:manage_departments': ['owner', 'captain'],
  'team:create_channels':    ['owner', 'captain', 'manager'],
  'team:post_as_team':       ['owner', 'captain', 'manager', 'player'],
  'team:view_workspace':     ['owner', 'captain', 'manager', 'player'],
  'team:readonly':           ['viewer'],
  'org:edit_nodes':          ['owner', 'captain', 'manager'],
  'system:ban_user':         ['admin', 'superadmin'],
  'system:manage_titles':    ['admin', 'superadmin'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function canDo(teamRole: string, permission: Permission): boolean {
  return (PERMISSIONS[permission] as string[]).includes(teamRole);
}