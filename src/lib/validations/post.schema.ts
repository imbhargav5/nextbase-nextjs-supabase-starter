import { z } from 'zod';

export const postCreateSchema = z.object({
  content: z.string().min(1, 'Post content cannot be empty').max(5000, 'Post content must be less than 5000 characters'),
  rich_content: z.record(z.any()).optional(),
  media_urls: z.array(z.string()).optional(),
  visibility: z.enum(['public', 'team', 'private']).default('public'),
  team_id: z.string().uuid().optional(),
});

export const postUpdateSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  rich_content: z.record(z.any()).optional(),
  media_urls: z.array(z.string()).optional(),
  visibility: z.enum(['public', 'team', 'private']).optional(),
});

export const commentCreateSchema = z.object({
  post_id: z.string().uuid(),
  content: z.string().min(1, 'Comment content cannot be empty').max(1000, 'Comment content must be less than 1000 characters'),
  parent_id: z.string().uuid().optional(),
});

export const reactionSchema = z.object({
  post_id: z.string().uuid(),
  type: z.enum(['like', 'fire', 'clap', 'trophy']),
});

export type PostCreateInput = z.infer<typeof postCreateSchema>;
export type PostUpdateInput = z.infer<typeof postUpdateSchema>;
export type CommentCreateInput = z.infer<typeof commentCreateSchema>;
export type ReactionInput = z.infer<typeof reactionSchema>;