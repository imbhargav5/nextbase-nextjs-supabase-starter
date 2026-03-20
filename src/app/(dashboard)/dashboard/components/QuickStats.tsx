import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, TrendingUp, Calendar } from 'lucide-react';

export function QuickStats() {
  const stats = [
    {
      title: 'Active Teams',
      value: '3',
      change: '+1 this week',
      icon: Users,
      color: 'bg-blue-500',
      ariaLabel: 'Active teams count',
    },
    {
      title: 'Messages Today',
      value: '24',
      change: '+8 from yesterday',
      icon: MessageSquare,
      color: 'bg-green-500',
      ariaLabel: 'Messages sent today',
    },
    {
      title: 'Post Engagement',
      value: '156',
      change: '+23%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      ariaLabel: 'Post engagement metrics',
    },
    {
      title: 'Upcoming Events',
      value: '2',
      change: 'This week',
      icon: Calendar,
      color: 'bg-orange-500',
      ariaLabel: 'Upcoming events count',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={stat.title}
            role="article"
            aria-label={stat.ariaLabel}
            className="transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-primary/50"
          >
            <CardHeader className="flex flex-col space-y-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div 
                  className={`p-2 rounded-lg ${stat.color} bg-opacity-20`}
                  aria-hidden="true"
                >
                  <Icon className={`h-4 w-4 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold tabular-nums">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </div>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
