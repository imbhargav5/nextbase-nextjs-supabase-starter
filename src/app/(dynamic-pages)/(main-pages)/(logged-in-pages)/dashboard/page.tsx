import { Suspense } from 'react';
import Link from 'next/link';
import { 
  PlusCircle, 
  Lock, 
  Globe, 
  ArrowRight, 
  LayoutDashboard,
  Clock
} from 'lucide-react';

import { T } from '@/components/ui/Typography';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { getAllItems } from '@/data/anon/items';
import { getAllPrivateItems } from '@/data/anon/privateItems';

export const dynamic = 'force-dynamic';

async function ItemsStats() {
  const items = await getAllItems();
  const privateItems = await getAllPrivateItems();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <CardDescription>All items in your database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{items.length + privateItems.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {items.length} public, {privateItems.length} private
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Public Items</CardTitle>
          <CardDescription>Visible to everyone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{items.length}</div>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
            <Clock className="h-3 w-3" />
            <span>Cleared every 24 hours</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Private Items</CardTitle>
          <CardDescription>Only visible to you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{privateItems.length}</div>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
            <Lock className="h-3 w-3" />
            <span>Secure and persistent</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsSkeletons() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-3 w-[100px] mt-1" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[60px]" />
            <Skeleton className="h-3 w-[120px] mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <T.H1>Dashboard</T.H1>
          <T.Subtle>Overview of your items and quick actions</T.Subtle>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/new">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> New Private Item
            </Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={<StatsSkeletons />}>
        <ItemsStats />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-t-4 border-t-blue-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <CardTitle>Public Items</CardTitle>
            </div>
            <CardDescription>
              Manage your public items that are visible to everyone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Public items are stored in an open database and are automatically cleared every 24 hours.
              Anyone can view these items without logging in.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/new">
              <Button variant="outline" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> New Item
              </Button>
            </Link>
            <Link href="/dashboard/public">
              <Button variant="secondary" className="flex items-center gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="border-t-4 border-t-green-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-500" />
              <CardTitle>Private Items</CardTitle>
            </div>
            <CardDescription>
              Manage your private items that are only visible to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Private items are secure and only visible when you're logged in.
              They are stored persistently and won't be automatically cleared.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard/new">
              <Button variant="outline" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> New Item
              </Button>
            </Link>
            <Link href="/dashboard/private">
              <Button variant="secondary" className="flex items-center gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
