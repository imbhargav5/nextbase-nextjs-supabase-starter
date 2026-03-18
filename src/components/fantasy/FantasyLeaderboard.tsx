'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Users } from 'lucide-react';
import { calculateTeamFantasyPoints, getFantasyRankColor, getFantasyRankIcon } from '@/lib/fantasyScoring';
import { TeamMember } from '@/lib/fantasyScoring';

interface FantasyLeaderboardProps {
  teamMembers: TeamMember[];
}

export function FantasyLeaderboard({ teamMembers }: FantasyLeaderboardProps) {
  const leaderboard = calculateTeamFantasyPoints(teamMembers);

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Fantasy Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.user_id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                index === 0 ? 'bg-yellow-50 border-yellow-200' :
                index === 1 ? 'bg-blue-50 border-blue-200' :
                index === 2 ? 'bg-green-50 border-green-200' :
                'hover:bg-accent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getFantasyRankIcon(entry.total_points)}</span>
                  <span className={`font-bold ${getFantasyRankColor(entry.total_points)}`}>
                    #{entry.rank}
                  </span>
                </div>
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={entry.avatar_url || '/default-avatar.png'} alt={entry.display_name} />
                  <AvatarFallback>{entry.display_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="font-semibold">{entry.display_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {entry.total_points} points
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  <Star className="mr-1 h-3 w-3" />
                  {entry.stats.messages_sent} msgs
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Users className="mr-1 h-3 w-3" />
                  {entry.stats.posts_created} posts
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}