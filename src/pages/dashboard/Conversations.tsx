import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search, Filter, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Conversations: React.FC = () => {
  // Sample conversation data
  const conversations = [
    {
      id: 1,
      name: 'John Smith',
      initials: 'JS',
      lastMessage: 'When will my car be ready?',
      time: '5m ago',
      unread: true
    },
    {
      id: 2,
      name: 'Amy Lee',
      initials: 'AL',
      lastMessage: 'I need to reschedule my appointment',
      time: '1h ago',
      unread: true
    },
    {
      id: 3,
      name: 'Tom Morgan',
      initials: 'TM',
      lastMessage: 'Do you have any openings today?',
      time: '3h ago',
      unread: false
    },
    {
      id: 4,
      name: 'Rita Kim',
      initials: 'RK',
      lastMessage: 'Thanks for the quick service',
      time: 'Yesterday',
      unread: false
    },
    {
      id: 5,
      name: 'Michael Johnson',
      initials: 'MJ',
      lastMessage: 'I have a question about my bill',
      time: 'Yesterday',
      unread: false
    },
    {
      id: 6,
      name: 'Sarah Williams',
      initials: 'SW',
      lastMessage: 'Can I get a quote for a new service?',
      time: '2 days ago',
      unread: false
    }
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-smarttext-navy">Conversations</h1>
          <p className="text-smarttext-slate">Manage and respond to customer messages</p>
        </div>
        <Button className="bg-smarttext-primary hover:bg-smarttext-hover flex items-center gap-2">
          <Plus size={16} />
          <span>New Conversation</span>
        </Button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-smarttext-slate" size={18} />
          <Input 
            placeholder="Search conversations..." 
            className="pl-10 bg-white border-gray-200"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          <span>Filter</span>
        </Button>
      </div>
      
      <Card className="overflow-hidden">
        <div className="divide-y divide-gray-100">
          {conversations.map((conversation) => (
            <div 
              key={conversation.id} 
              className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${conversation.unread ? 'bg-smarttext-primary' : 'bg-smarttext-slate'}`}>
                {conversation.initials}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${conversation.unread ? 'text-smarttext-navy font-semibold' : 'text-smarttext-navy'}`}>
                    {conversation.name}
                  </h4>
                  <span className="text-xs text-smarttext-slate whitespace-nowrap ml-2">
                    {conversation.time}
                  </span>
                </div>
                <p className={`text-sm truncate ${conversation.unread ? 'text-smarttext-navy' : 'text-smarttext-slate'}`}>
                  {conversation.lastMessage}
                </p>
              </div>
              {conversation.unread && (
                <div className="w-3 h-3 rounded-full bg-smarttext-primary flex-shrink-0"></div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Conversations;
