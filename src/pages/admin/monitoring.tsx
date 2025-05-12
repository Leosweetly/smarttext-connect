import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, MessageSquare, PhoneMissed, Brain, Bell } from 'lucide-react';

// Types for API responses
interface DailyStats {
  lastUpdated: string;
  allTime: {
    totalCalls: number;
    missedCalls: number;
    smsSent: number;
    smsFailed: number;
    openaiTokensUsed: number;
    ownerAlertsSent: number;
  };
  today: {
    totalCalls: number;
    missedCalls: number;
    smsSent: number;
    smsFailed: number;
    openaiTokensUsed: number;
    ownerAlertsSent: number;
  };
  subscriberMetrics: {
    totalBusinesses: number;
    activeBusinesses: number;
    planBreakdown: {
      free: number;
      pro: number;
      enterprise: number;
    };
    totalMRR: number;
  };
}

interface OwnerAlert {
  id: string;
  timestamp: string;
  message: string;
  deliveryStatus: string;
}

interface OpenAIUsage {
  tokensUsed: number;
  date: string;
}

interface SMSUsage {
  sent: number;
  failed: number;
  date: string;
}

const AdminMonitoring: React.FC = () => {
  // State for API data
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [ownerAlerts, setOwnerAlerts] = useState<OwnerAlert[]>([]);
  const [openaiUsage, setOpenaiUsage] = useState<OpenAIUsage | null>(null);
  const [smsUsage, setSmsUsage] = useState<SMSUsage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load mock data for demonstration
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    // Use setTimeout to simulate API call
    setTimeout(() => {
      try {
        // Get today's date
        const today = new Date();
        const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        // Set mock daily stats
        setDailyStats({
          lastUpdated: new Date().toISOString(),
          allTime: {
            totalCalls: 1248,
            missedCalls: 187,
            smsSent: 3542,
            smsFailed: 76,
            openaiTokensUsed: 8745920,
            ownerAlertsSent: 53,
          },
          today: {
            totalCalls: 42,
            missedCalls: 7,
            smsSent: 128,
            smsFailed: 3,
            openaiTokensUsed: 345600,
            ownerAlertsSent: 2,
          },
          subscriberMetrics: {
            totalBusinesses: 156,
            activeBusinesses: 142,
            planBreakdown: {
              free: 45,
              pro: 98,
              enterprise: 13
            },
            totalMRR: 24850
          }
        });
        
        // Set mock owner alerts
        setOwnerAlerts([
          {
            id: '1',
            timestamp: new Date(today.getTime() - 30 * 60000).toISOString(), // 30 minutes ago
            message: 'High call volume detected - 15 calls in the last hour',
            deliveryStatus: 'sent'
          },
          {
            id: '2',
            timestamp: new Date(today.getTime() - 2 * 3600000).toISOString(), // 2 hours ago
            message: 'OpenAI API rate limit approaching - 80% of quota used',
            deliveryStatus: 'sent'
          },
          {
            id: '3',
            timestamp: new Date(today.getTime() - 5 * 3600000).toISOString(), // 5 hours ago
            message: 'SMS delivery failure rate above threshold (5%)',
            deliveryStatus: 'failed'
          },
          {
            id: '4',
            timestamp: new Date(today.getTime() - 8 * 3600000).toISOString(), // 8 hours ago
            message: 'System restarted successfully after scheduled maintenance',
            deliveryStatus: 'sent'
          },
          {
            id: '5',
            timestamp: new Date(today.getTime() - 24 * 3600000).toISOString(), // 1 day ago
            message: 'Daily backup completed successfully',
            deliveryStatus: 'sent'
          },
        ]);
        
        // Set mock OpenAI usage
        setOpenaiUsage({
          tokensUsed: 345600,
          date: dateString,
        });
        
        // Set mock SMS usage
        setSmsUsage({
          sent: 128,
          failed: 3,
          date: dateString,
        });
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading mock data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    }, 1500); // 1.5 second delay to simulate loading
    
    // No need for interval refresh with mock data
    return () => {};
  }, []);

  // Format timestamp to readable date/time
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Format time for last updated display
  const formatTime = (isoTimestamp: string) => {
    const date = new Date(isoTimestamp);
    return date.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // Format currency for MRR display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Prepare chart data for plan breakdown
  const getPlanBreakdownChartData = () => {
    if (!dailyStats) return [];
    
    const { planBreakdown } = dailyStats.subscriberMetrics;
    return [
      { name: 'Free', value: planBreakdown.free },
      { name: 'Pro', value: planBreakdown.pro },
      { name: 'Enterprise', value: planBreakdown.enterprise }
    ];
  };

  // Prepare chart data for SMS usage
  const getSmsChartData = () => {
    if (!smsUsage) return [];
    
    return [
      { name: 'Sent', value: smsUsage.sent },
      { name: 'Failed', value: smsUsage.failed }
    ];
  };

  // Prepare chart data for calls
  const getCallsChartData = () => {
    if (!dailyStats) return [];
    
    return [
      { name: 'Total Calls', value: dailyStats.today.totalCalls },
      { name: 'Missed Calls', value: dailyStats.today.missedCalls }
    ];
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smarttext-navy mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">SmartText AI Monitoring</h1>
          <p className="text-gray-500">Internal admin dashboard for system monitoring</p>
        </div>
        {dailyStats && (
          <p className="text-sm text-gray-500">
            Last updated at {formatTime(dailyStats.lastUpdated)}
          </p>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="alerts">Owner Alerts</TabsTrigger>
          <TabsTrigger value="usage">Usage Stats</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Today's Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Today's Stats</CardTitle>
              </CardHeader>
              <CardContent>
                {dailyStats && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-sm">
                        <MessageSquare className="mr-2 h-4 w-4" /> Total Calls
                      </span>
                      <span className="font-semibold">{dailyStats.today.totalCalls}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-sm">
                        <PhoneMissed className="mr-2 h-4 w-4" /> Missed Calls
                      </span>
                      <span className="font-semibold">{dailyStats.today.missedCalls}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-sm">
                        <CheckCircle className="mr-2 h-4 w-4" /> SMS Sent
                      </span>
                      <span className="font-semibold">{dailyStats.today.smsSent}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-sm">
                        <AlertCircle className="mr-2 h-4 w-4" /> SMS Failed
                      </span>
                      <span className="font-semibold">{dailyStats.today.smsFailed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-sm">
                        <Brain className="mr-2 h-4 w-4" /> OpenAI Tokens
                      </span>
                      <span className="font-semibold">{dailyStats.today.openaiTokensUsed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-sm">
                        <Bell className="mr-2 h-4 w-4" /> Owner Alerts
                      </span>
                      <span className="font-semibold">{dailyStats.today.ownerAlertsSent}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All-Time Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">All-Time Stats</CardTitle>
              </CardHeader>
              <CardContent>
                {dailyStats && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-sm">
                        <MessageSquare className="mr-2 h-4 w-4" /> Total Calls
                      </span>
                      <span className="font-semibold">{dailyStats.allTime.totalCalls.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-sm">
                        <PhoneMissed className="mr-2 h-4 w-4" /> Missed Calls
                      </span>
                      <span className="font-semibold">{dailyStats.allTime.missedCalls.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-sm">
                        <CheckCircle className="mr-2 h-4 w-4" /> SMS Sent
                      </span>
                      <span className="font-semibold">{dailyStats.allTime.smsSent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-sm">
                        <AlertCircle className="mr-2 h-4 w-4" /> SMS Failed
                      </span>
                      <span className="font-semibold">{dailyStats.allTime.smsFailed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-sm">
                        <Brain className="mr-2 h-4 w-4" /> OpenAI Tokens
                      </span>
                      <span className="font-semibold">{dailyStats.allTime.openaiTokensUsed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-sm">
                        <Bell className="mr-2 h-4 w-4" /> Owner Alerts
                      </span>
                      <span className="font-semibold">{dailyStats.allTime.ownerAlertsSent.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ownerAlerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="border-b pb-2 last:border-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs text-gray-500">{formatTimestamp(alert.timestamp)}</span>
                        <Badge variant={alert.deliveryStatus === 'sent' ? 'default' : 'destructive'}>
                          {alert.deliveryStatus}
                        </Badge>
                      </div>
                      <p className="text-sm line-clamp-2">{alert.message}</p>
                    </div>
                  ))}
                  {ownerAlerts.length === 0 && (
                    <p className="text-sm text-gray-500">No recent alerts</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's SMS Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getSmsChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Call Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getCallsChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Owner Alerts Tab */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Owner Alerts (Last 20)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ownerAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-mono">{formatTimestamp(alert.timestamp)}</TableCell>
                      <TableCell>{alert.message}</TableCell>
                      <TableCell>
                        <Badge variant={alert.deliveryStatus === 'sent' ? 'default' : 'destructive'}>
                          {alert.deliveryStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {ownerAlerts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        No owner alerts found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscribers Tab */}
        <TabsContent value="subscribers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscriber Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                {dailyStats && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Businesses</span>
                      <span className="font-semibold">{dailyStats.subscriberMetrics.totalBusinesses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Businesses</span>
                      <span className="font-semibold">{dailyStats.subscriberMetrics.activeBusinesses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Inactive Businesses</span>
                      <span className="font-semibold">
                        {dailyStats.subscriberMetrics.totalBusinesses - dailyStats.subscriberMetrics.activeBusinesses}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Recurring Revenue</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(dailyStats.subscriberMetrics.totalMRR)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {dailyStats && (
                  <div className="space-y-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getPlanBreakdownChartData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold">{dailyStats.subscriberMetrics.planBreakdown.free}</div>
                        <div className="text-xs text-gray-500">Free</div>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold">{dailyStats.subscriberMetrics.planBreakdown.pro}</div>
                        <div className="text-xs text-gray-500">Pro</div>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold">{dailyStats.subscriberMetrics.planBreakdown.enterprise}</div>
                        <div className="text-xs text-gray-500">Enterprise</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Usage Stats Tab */}
        <TabsContent value="usage">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>OpenAI Usage Today</CardTitle>
              </CardHeader>
              <CardContent>
                {openaiUsage && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="text-4xl font-bold">{openaiUsage.tokensUsed.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">tokens used</div>
                    </div>
                    <Separator />
                    <div className="text-sm text-gray-500 text-center">
                      Date: {openaiUsage.date}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SMS Usage Today</CardTitle>
              </CardHeader>
              <CardContent>
                {smsUsage && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{smsUsage.sent}</div>
                      <div className="text-sm text-gray-500">Sent</div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-red-600">{smsUsage.failed}</div>
                      <div className="text-sm text-gray-500">Failed</div>
                    </div>
                    <div className="col-span-2 text-sm text-gray-500 text-center">
                      Date: {smsUsage.date}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMonitoring;
