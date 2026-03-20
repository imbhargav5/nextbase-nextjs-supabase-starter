'use client';

import { useState } from 'react';
import {
  Home,
  Users,
  MessagesSquare,
  Layout,
  Menu,
  Bell,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

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

export function MobileNavigation() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-background sticky top-0 z-50">
      {/* Left Side - Menu & Search */}
      <div className="flex items-center gap-2 flex-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex h-16 items-center border-b px-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-lg font-semibold">TG</span>
                  </div>
                  <span className="text-lg font-semibold">TeamGrid</span>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-auto py-4">
                <nav className="space-y-1 px-2" role="navigation" aria-label="Main menu">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* User Section */}
              <div className="border-t p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10" aria-hidden="true">
                    <AvatarImage src="/default-avatar.png" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">User Name</div>
                    <div className="text-xs text-muted-foreground">user@example.com</div>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search..."
            className="pl-10"
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          aria-label="Messages"
        >
          <MessagesSquare className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
