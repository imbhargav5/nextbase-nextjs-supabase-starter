'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  MessagesSquare,
  Layout,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import Image from 'next/image';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Discover',
    href: '/discover',
    icon: Users,
  },
  {
    name: 'Teams',
    href: '/teams',
    icon: Layout,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className="flex h-full flex-col border-r bg-background"
      aria-label="Main navigation"
    >
      {/* Logo/Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Image 
              src="/logos/nextbase_navlogo_small.svg" 
              alt="TeamGrid" 
              width={24} 
              height={24} 
            />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-semibold">TeamGrid</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="lg:hidden"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu className="h-5 w-5" aria-hidden="true" /> : <X className="h-5 w-5" aria-hidden="true" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-1" role="navigation" aria-label="Main menu">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {!isCollapsed && item.name}
              </Link>
            );
          })}
        </nav>

        {/* Teams Section */}
        {!isCollapsed && (
          <div className="mt-8">
            <div className="flex items-center justify-between px-1 pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Teams
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                aria-label="Create new team"
              >
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <div className="space-y-1">
              {/* Team items would go here */}
              <div 
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="TeamGrid Dev team"
              >
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-medium">TG</span>
                </div>
                <span>TeamGrid Dev</span>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* User Menu */}
      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/default-avatar.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="ml-3 flex flex-col items-start">
                  <span className="text-sm font-medium">User Name</span>
                  <span className="text-xs text-muted-foreground">user@example.com</span>
                </div>
              )}
              {!isCollapsed && (
                <LogOut className="ml-auto h-4 w-4 text-muted-foreground" aria-hidden="true" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
