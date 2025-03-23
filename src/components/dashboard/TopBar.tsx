
import React, { useState } from 'react';
import { Bell, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface TopBarProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar, isSidebarCollapsed }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New message from John Smith", time: "5 min ago" },
    { id: 2, text: "2 missed calls from Auto Shop Customer", time: "1 hour ago" },
  ]);

  return (
    <header className={cn(
      "bg-white border-b border-gray-200 h-16 fixed top-0 right-0 z-20 w-full transition-all duration-300",
      isSidebarCollapsed ? "md:ml-20 md:w-[calc(100%-5rem)]" : "md:ml-64 md:w-[calc(100%-16rem)]"
    )}>
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 mr-2 rounded-full text-smarttext-navy hover:bg-smarttext-light transition-colors md:hidden"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-smarttext-navy">Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="py-3 flex flex-col items-start">
                    <span>{notification.text}</span>
                    <span className="text-xs text-gray-500 mt-1">{notification.time}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No new notifications
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-smarttext-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-smarttext-primary text-white flex items-center justify-center">
                  JS
                </div>
                <span className="hidden md:inline-block">John Smith</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
