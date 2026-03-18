import { Database } from '@/lib/database.types';

export type TeamMember = Database['public']['Tables']['team_members']['Row'] & {
  user: {
    display_name: string;
    avatar_url?: string;
  };
};

export interface FantasyStats {
  id: string;
  user_id: string;
  team_id: string;
  messages_sent: number;
  reactions_given: number;
  reactions_received: number;
  posts_created: number;
  comments_made: number;
  tasks_completed: number;
  last_updated: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  total_points: number;
  stats: FantasyStats;
}

export const SCORING_RULES = {
  message: 1,
  reaction_given: 0.5,
  reaction_received: 1,
  post_created: 5,
  comment_made: 2,
  task_completed: 10,
} as const;

export function calculateFantasyPoints(stats: FantasyStats): number {
  return (
    stats.messages_sent * SCORING_RULES.message +
    stats.reactions_given * SCORING_RULES.reaction_given +
    stats.reactions_received * SCORING_RULES.reaction_received +
    stats.posts_created * SCORING_RULES.post_created +
    stats.comments_made * SCORING_RULES.comment_made +
    stats.tasks_completed * SCORING_RULES.task_completed
  );
}

export function calculateTeamFantasyPoints(teamMembers: TeamMember[]): LeaderboardEntry[] {
  const leaderboard: LeaderboardEntry[] = teamMembers.map((member, index) => {
    const stats: FantasyStats = {
      id: member.id,
      user_id: member.user_id,
      team_id: member.team_id,
      messages_sent: member.messages_sent || 0,
      reactions_given: member.reactions_given || 0,
      reactions_received: member.reactions_received || 0,
      posts_created: member.posts_created || 0,
      comments_made: member.comments_made || 0,
      tasks_completed: member.tasks_completed || 0,
      last_updated: new Date().toISOString(),
    };

    return {
      rank: index + 1,
      user_id: member.user_id,
      display_name: member.user.display_name,
      avatar_url: member.user.avatar_url,
      total_points: calculateFantasyPoints(stats),
      stats,
    };
  });

  return leaderboard
    .sort((a, b) => b.total_points - a.total_points)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function getFantasyRankColor(points: number): string {
  if (points >= 100) return 'text-yellow-500';
  if (points >= 50) return 'text-blue-500';
  if (points >= 25) return 'text-green-500';
  return 'text-gray-500';
}

export function getFantasyRankIcon(points: number): string {
  if (points >= 100) return '🏆';
  if (points >= 50) return '🥈';
  if (points >= 25) return '🥉';
  return '⭐';
}