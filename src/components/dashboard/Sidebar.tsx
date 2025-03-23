
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/use-media-query';
import Logo from '@/components/ui/Logo';
import { 
  Home, MessageSquare, PhoneMissed, Settings, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageSquare, label: 'Conversations', path: '/dashboard/conversations' },
    { icon: PhoneMissed, label: 'Missed Calls', path: '/dashboard/missed-calls' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={cn(
        "bg-smarttext-navy text-smarttext-light fixed left-0 top-0 z-30 h-screen transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
        isMobile && !isCollapsed ? "translate-x-0" : isMobile && isCollapsed ? "-translate-x-full" : ""
      )}
    >
      <div className="flex flex-col h-full">
        <div className={cn(
          "flex items-center p-4 h-16",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && <Logo variant="light" className="transition-opacity duration-150" />}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-smarttext-slate/20 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        
        <nav className="flex-grow py-6">
          <ul className="space-y-2 px-3">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={cn(
                    "sidebar-link",
                    isActive(item.path) && "active"
                  )}
                >
                  <item.icon size={20} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-smarttext-slate/20">
          <Link
            to="/"
            className="sidebar-link text-smarttext-hover hover:text-smarttext-light"
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
