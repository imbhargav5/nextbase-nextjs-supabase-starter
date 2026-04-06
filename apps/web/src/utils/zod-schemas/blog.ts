import type { Database } from '@/lib/database.types';
import { z } from 'zod';

type BlogPostRow =
  Database['public']['Tables']['content_blog_posts']['Row'];
type BlogPostCommentRow =
  Database['public']['Tables']['content_blog_post_comments']['Row'];

export const blogCommentSchema = z.object({
  postId: z.string().uuid(),
  slug: z.string().min(1),
  body: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment cannot exceed 2000 characters'),
});

export type BlogCommentInput = z.infer<typeof blogCommentSchema>;

export interface BlogPostSummary {
  id: BlogPostRow['id'];
  slug: BlogPostRow['slug'];
  title: BlogPostRow['title'];
  excerpt: BlogPostRow['excerpt'];
  authorId: BlogPostRow['author_id'];
  publishedAt: BlogPostRow['published_at'];
  createdAt: BlogPostRow['created_at'];
  updatedAt: BlogPostRow['updated_at'];
  commentCount: number;
}

export interface BlogPostDetail extends BlogPostSummary {
  body: BlogPostRow['body'];
}

export interface BlogPostComment {
  id: BlogPostCommentRow['id'];
  postId: BlogPostCommentRow['blog_post_id'];
  authorId: BlogPostCommentRow['author_id'];
  body: BlogPostCommentRow['body'];
  createdAt: BlogPostCommentRow['created_at'];
  updatedAt: BlogPostCommentRow['updated_at'];
}

