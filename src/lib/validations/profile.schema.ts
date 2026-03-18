import { z } from 'zod';

export const profileUpdateSchema = z.object({
  display_name: z.string().min(2, 'Display name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  headline: z.string().max(100, 'Headline must be less than 100 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  skills: z.array(z.string()).optional(),
  avatar_url: z.string().optional(),
  banner_url: z.string().optional(),
});

export const userSearchSchema = z.object({
  q: z.string().optional(),
  skills: z.array(z.string()).optional(),
  location: z.string().optional(),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type UserSearchInput = z.infer<typeof userSearchSchema>;