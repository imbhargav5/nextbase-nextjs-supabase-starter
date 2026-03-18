import { Node, Edge } from '@xyflow/react';

export interface User {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  headline?: string;
  location?: string;
  skills?: string[];
  system_role: 'user' | 'moderator' | 'admin' | 'superadmin';
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatar_url?: string;
  banner_url?: string;
  is_public: boolean;
  max_size: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  team_role: 'owner' | 'captain' | 'manager' | 'player' | 'viewer';
  access_level: 'admin' | 'member' | 'readonly';
  position?: string;
  department_id?: string;
  title_id?: string;
  stats: {
    score: number;
    posts_this_week: number;
    reactions_received: number;
    messages_this_week: number;
    contributions: number;
  };
  joined_at: string;
}

export interface OrgMemberNodeData {
  user: User;
  role: string;
  department: string;
  departmentColor: string;
}

export interface OrgMemberNode extends Node<OrgMemberNodeData> {}

export interface OrgMemberEdge extends Edge {}

export interface Post {
  id: string;
  team_id?: string;
  author_id: string;
  content: string;
  rich_content?: Record<string, any>;
  media_urls?: string[];
  visibility: 'public' | 'team' | 'private';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  channel_id: string;
  author_id: string;
  content: string;
  rich_content?: Record<string, any>;
  media_urls?: string[];
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Reaction {
  id: string;
  post_id?: string;
  message_id?: string;
  author_id: string;
  type: 'like' | 'fire' | 'clap' | 'trophy';
  created_at: string;
}

export interface Notification {
  id: string;
  recipient_id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  read_at?: string;
  created_at: string;
}