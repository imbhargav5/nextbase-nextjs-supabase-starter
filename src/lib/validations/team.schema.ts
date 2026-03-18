import { z } from 'zod';

export const teamCreateSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  avatar_url: z.string().optional(),
  banner_url: z.string().optional(),
  is_public: z.boolean().default(true),
  max_size: z.number().min(2).max(50).default(11),
});

export const teamUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  avatar_url: z.string().optional(),
  banner_url: z.string().optional(),
  is_public: z.boolean().optional(),
  max_size: z.number().min(2).max(50).optional(),
});

export const memberUpdateSchema = z.object({
  team_role: z.enum(['owner', 'captain', 'manager', 'player', 'viewer']).optional(),
  access_level: z.enum(['admin', 'member', 'readonly']).optional(),
  position: z.string().optional(),
  department_id: z.string().uuid().optional(),
  title_id: z.string().uuid().optional(),
});

export const inviteSchema = z.object({
  receiver_id: z.string().uuid(),
  position: z.string().optional(),
  message: z.string().optional(),
  expires_at: z.date().optional(),
});

export const orgNodeSchema = z.object({
  user_id: z.string().uuid(),
  department_id: z.string().uuid().optional(),
  title_id: z.string().uuid().optional(),
  custom_title: z.string().optional(),
  parent_node_id: z.string().uuid().optional(),
  sort_order: z.number().default(0),
});

export type TeamCreateInput = z.infer<typeof teamCreateSchema>;
export type TeamUpdateInput = z.infer<typeof teamUpdateSchema>;
export type MemberUpdateInput = z.infer<typeof memberUpdateSchema>;
export type InviteInput = z.infer<typeof inviteSchema>;
export type OrgNodeInput = z.infer<typeof orgNodeSchema>;