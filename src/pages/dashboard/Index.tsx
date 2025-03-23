
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Users, MessageSquare, PhoneMissed, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-smarttext-navy">Welcome, John Smith</h1>
        <p className="text-smarttext-slate">Here's what's happening with your business today</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="dashboard-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-smarttext-slate text-sm font-medium">Total Customers</p>
              <h3 className="text-3xl font-bold text-smarttext-navy mt-2">152</h3>
              <p className="text-green-500 text-sm flex items-center mt-1">
                <TrendingUp size={16} className="mr-1" />
                <span>+12% this month</span>
              </p>
            </div>
            <div className="p-3 bg-smarttext-primary/10 rounded-lg">
              <Users size={24} className="text-smarttext-primary" />
            </div>
          </div>
        </Card>
        
        <Card className="dashboard-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-smarttext-slate text-sm font-medium">Active Conversations</p>
              <h3 className="text-3xl font-bold text-smarttext-navy mt-2">38</h3>
              <p className="text-green-500 text-sm flex items-center mt-1">
                <TrendingUp size={16} className="mr-1" />
                <span>+5% this week</span>
              </p>
            </div>
            <div className="p-3 bg-smarttext-primary/10 rounded-lg">
              <MessageSquare size={24} className="text-smarttext-primary" />
            </div>
          </div>
        </Card>
        
        <Card className="dashboard-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-smarttext-slate text-sm font-medium">Missed Calls</p>
              <h3 className="text-3xl font-bold text-smarttext-navy mt-2">7</h3>
              <p className="text-red-500 text-sm flex items-center mt-1">
                <TrendingUp size={16} className="mr-1" />
                <span>+2 since yesterday</span>
              </p>
            </div>
            <div className="p-3 bg-smarttext-primary/10 rounded-lg">
              <PhoneMissed size={24} className="text-smarttext-primary" />
            </div>
          </div>
        </Card>
        
        <Card className="dashboard-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-smarttext-slate text-sm font-medium">Response Rate</p>
              <h3 className="text-3xl font-bold text-smarttext-navy mt-2">98%</h3>
              <p className="text-green-500 text-sm flex items-center mt-1">
                <TrendingUp size={16} className="mr-1" />
                <span>+3% this month</span>
              </p>
            </div>
            <div className="p-3 bg-smarttext-primary/10 rounded-lg">
              <TrendingUp size={24} className="text-smarttext-primary" />
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-smarttext-navy">Recent Conversations</h3>
            <Button variant="ghost" className="text-smarttext-primary flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </Button>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg smooth-transition">
                <div className="w-10 h-10 rounded-full bg-smarttext-primary/20 flex items-center justify-center text-smarttext-primary font-bold">
                  {i === 1 ? 'JS' : i === 2 ? 'AL' : i === 3 ? 'TM' : 'RK'}
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium text-smarttext-navy">
                    {i === 1 ? 'John Smith' : i === 2 ? 'Amy Lee' : i === 3 ? 'Tom Morgan' : 'Rita Kim'}
                  </h4>
                  <p className="text-sm text-smarttext-slate truncate">
                    {i === 1 ? 'When will my car be ready?' : 
                     i === 2 ? 'I need to reschedule my appointment' : 
                     i === 3 ? 'Do you have any openings today?' : 
                     'Thanks for the quick service'}
                  </p>
                </div>
                <div className="text-xs text-smarttext-slate whitespace-nowrap">
                  {i === 1 ? '5m ago' : i === 2 ? '1h ago' : i === 3 ? '3h ago' : 'Yesterday'}
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-smarttext-navy">Missed Calls</h3>
            <Button variant="ghost" className="text-smarttext-primary flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </Button>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg smooth-transition">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                  <PhoneMissed size={18} />
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium text-smarttext-navy">
                    {i === 1 ? '(555) 123-4567' : i === 2 ? '(555) 987-6543' : '(555) 456-7890'}
                  </h4>
                  <p className="text-sm text-smarttext-slate">
                    {i === 1 ? 'Today, 2:30 PM' : i === 2 ? 'Today, 11:15 AM' : 'Yesterday, 4:45 PM'}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="text-smarttext-primary border-smarttext-primary">
                  Call Back
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
