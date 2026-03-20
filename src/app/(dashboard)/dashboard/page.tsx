import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, MessageSquare, BarChart3 } from 'lucide-react';
import { RecentActivity } from './components/RecentActivity';
import { TeamHighlights } from './components/TeamHighlights';
import { QuickStats } from './components/QuickStats';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Welcome back! Here's what's happening with your teams and network.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <MessageSquare className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
        <QuickStats />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Left Column - Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <RecentActivity />
        </div>

        {/* Right Column - Team Highlights */}
        <div className="lg:col-span-1 space-y-6">
          <TeamHighlights />
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Get started with TeamGrid
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Invite team members
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Create a new team
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Explore org chart
              </Button>
              <Button variant="outline" className="w-full justify-start">
                View notifications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
