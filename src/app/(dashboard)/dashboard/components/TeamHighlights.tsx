import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Calendar, MessageSquare } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const teams = [
  {
    id: 1,
    name: 'Product Team',
    avatar: '/avatars/product-team.jpg',
    members: 8,
    totalMembers: 11,
    activity: 85,
    recentActivity: 'Sarah posted about new feature',
    nextMeeting: 'Today at 2:00 PM',
  },
  {
    id: 2,
    name: 'Engineering',
    avatar: '/avatars/engineering-team.jpg',
    members: 12,
    totalMembers: 15,
    activity: 92,
    recentActivity: 'Mike resolved 3 bugs',
    nextMeeting: 'Tomorrow at 10:00 AM',
  },
  {
    id: 3,
    name: 'Marketing',
    avatar: '/avatars/marketing-team.jpg',
    members: 6,
    totalMembers: 8,
    activity: 67,
    recentActivity: 'Campaign launched successfully',
    nextMeeting: 'Friday at 3:00 PM',
  },
];

export function TeamHighlights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Your Teams
        </CardTitle>
        <CardDescription>
          Quick overview of your team activity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {teams.map((team) => (
          <div key={team.id} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={team.avatar} alt={team.name} />
                <AvatarFallback>{team.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{team.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {team.members}/{team.totalMembers}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{team.recentActivity}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Activity: {team.activity}%
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {team.nextMeeting}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Progress value={team.activity} className="w-20" />
              <button className="text-xs text-primary hover:underline">
                View details
              </button>
            </div>
          </div>
        ))}
        
        <div className="pt-2 border-t">
          <button className="w-full text-center text-sm text-muted-foreground hover:text-foreground">
            View all teams
          </button>
        </div>
      </CardContent>
    </Card>
  );
}