import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Heart, Users, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const recentActivity = [
  {
    id: 1,
    type: 'post',
    user: { name: 'Sarah Johnson', avatar: '/avatars/sarah.jpg' },
    team: 'Product Team',
    content: 'Just shipped our new feature! 🚀',
    reactions: 12,
    comments: 3,
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 2,
    type: 'message',
    user: { name: 'Mike Chen', avatar: '/avatars/mike.jpg' },
    team: 'Engineering',
    content: 'Need help with the API integration',
    channel: '#backend',
    time: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 3,
    type: 'invite',
    user: { name: 'Alex Rodriguez', avatar: '/avatars/alex.jpg' },
    team: 'Marketing',
    action: 'invited',
    target: 'Jessica Lee',
    time: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 4,
    type: 'reaction',
    user: { name: 'Emily Davis', avatar: '/avatars/emily.jpg' },
    team: 'Design',
    content: 'Reacted to your post with 🔥',
    time: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          What's been happening across your teams
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <article 
              key={activity.id} 
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors focus-within:ring-2 focus-within:ring-primary/50"
              role="article"
              aria-label={`${activity.user.name} ${activity.type === 'post' ? 'posted' : activity.type === 'message' ? 'sent a message' : activity.type === 'invite' ? 'invited' : 'reacted'} in ${activity.team}`}
            >
              <Avatar className="h-10 w-10 flex-shrink-0" aria-hidden="true">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium truncate">{activity.user.name}</span>
                  <Badge variant="secondary" className="text-xs">{activity.team}</Badge>
                  <span className="text-xs text-muted-foreground" title={activity.time.toLocaleString()}>
                    {formatDistanceToNow(activity.time, { addSuffix: true })}
                  </span>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {activity.type === 'post' && (
                    <div className="space-y-2">
                      <p className="whitespace-pre-wrap">{activity.content}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1" aria-label={`${activity.reactions} reactions`}>
                          <Heart className="h-3 w-3" aria-hidden="true" />
                          <span>{activity.reactions}</span>
                        </span>
                        <span className="flex items-center gap-1" aria-label={`${activity.comments} comments`}>
                          <MessageCircle className="h-3 w-3" aria-hidden="true" />
                          <span>{activity.comments}</span>
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {activity.type === 'message' && (
                    <div className="space-y-1">
                      <p className="whitespace-pre-wrap">{activity.content}</p>
                      <Badge variant="outline" className="text-xs" aria-label={`Channel: ${activity.channel}`}>
                        {activity.channel}
                      </Badge>
                    </div>
                  )}
                  
                  {activity.type === 'invite' && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" aria-hidden="true" />
                      <span>
                        {activity.user.name} {activity.action} {activity.target} to {activity.team}
                      </span>
                    </div>
                  )}
                  
                  {activity.type === 'reaction' && (
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                      <span>{activity.content}</span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
