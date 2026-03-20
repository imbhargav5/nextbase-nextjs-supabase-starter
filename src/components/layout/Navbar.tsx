'use client';

import { useState } from 'react';
import {
  Bell,
  Search,
  Plus,
  MessageSquare,
  UserPlus,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="flex h-16 items-center justify-between px-6 border-b bg-background sticky top-0 z-50">
      {/* Left Side - Search */}
      <div className="flex items-center gap-4">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search users, teams, posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              aria-label="Notifications"
              aria-describedby="notifications-count"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              <Badge 
                id="notifications-count"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                aria-label="3 unread notifications"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-4">
              <h3 className="font-semibold mb-2">Notifications</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors">
                  <Avatar className="h-8 w-8" aria-hidden="true">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">John Doe invited you to join Team Alpha</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Actions */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            title="New Post"
            aria-label="Create new post"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            title="New Message"
            aria-label="Send new message"
          >
            <MessageSquare className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            title="Invite User"
            aria-label="Invite new user"
          >
            <UserPlus className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8" aria-hidden="true">
                <AvatarImage src="/default-avatar.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline font-medium">User Name</span>
              <Settings className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
