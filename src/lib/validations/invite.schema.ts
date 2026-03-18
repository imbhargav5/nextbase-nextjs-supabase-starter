import { z } from 'zod';

export const inviteCreateSchema = z.object({
  receiver_id: z.string().uuid(),
  position: z.string().max(255).optional().nullable(),
  message: z.string().max(1000).optional().nullable(),
  expires_at: z.date().optional(),
});

export type InviteCreateInput = z.infer<typeof inviteCreateSchema>;

export const inviteResponseSchema = z.object({
  status: z.enum(['accepted', 'declined']),
});

export type InviteResponseInput = z.infer<typeof inviteResponseSchema>;
