import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PhoneMissed, Search, Filter, ArrowUpDown, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';

const MissedCalls: React.FC = () => {
  // Sample missed calls data
  const missedCalls = [
    {
      id: 1,
      phoneNumber: '(555) 123-4567',
      date: 'Today',
      time: '2:30 PM',
      duration: '0:15',
      status: 'Not Called Back'
    },
    {
      id: 2,
      phoneNumber: '(555) 987-6543',
      date: 'Today',
      time: '11:15 AM',
      duration: '0:32',
      status: 'Not Called Back'
    },
    {
      id: 3,
      phoneNumber: '(555) 456-7890',
      date: 'Yesterday',
      time: '4:45 PM',
      duration: '0:08',
      status: 'Not Called Back'
    },
    {
      id: 4,
      phoneNumber: '(555) 234-5678',
      date: 'Yesterday',
      time: '1:20 PM',
      duration: '0:22',
      status: 'Called Back'
    },
    {
      id: 5,
      phoneNumber: '(555) 876-5432',
      date: '2 days ago',
      time: '3:10 PM',
      duration: '0:45',
      status: 'Called Back'
    }
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-smarttext-navy">Missed Calls</h1>
          <p className="text-smarttext-slate">Track and follow up on missed customer calls</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-smarttext-slate" size={18} />
          <Input 
            placeholder="Search phone numbers..." 
            className="pl-10 bg-white border-gray-200"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          <span>Filter</span>
        </Button>
      </div>
      
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left p-4 text-smarttext-slate font-medium text-sm">
                  <div className="flex items-center gap-1">
                    <span>Phone Number</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="text-left p-4 text-smarttext-slate font-medium text-sm">
                  <div className="flex items-center gap-1">
                    <span>Date & Time</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="text-left p-4 text-smarttext-slate font-medium text-sm">Duration</th>
                <th className="text-left p-4 text-smarttext-slate font-medium text-sm">Status</th>
                <th className="text-right p-4 text-smarttext-slate font-medium text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {missedCalls.map((call) => (
                <tr key={call.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-smarttext-navy font-medium">{call.phoneNumber}</td>
                  <td className="p-4 text-smarttext-slate">
                    {call.date}, {call.time}
                  </td>
                  <td className="p-4 text-smarttext-slate">{call.duration}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      call.status === 'Called Back' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button 
                      size="sm" 
                      variant={call.status === 'Called Back' ? 'ghost' : 'outline'} 
                      className={call.status === 'Called Back' ? 'text-smarttext-slate' : 'text-smarttext-primary border-smarttext-primary'}
                      disabled={call.status === 'Called Back'}
                    >
                      <Phone size={16} className="mr-1" />
                      {call.status === 'Called Back' ? 'Called' : 'Call Back'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default MissedCalls;
