
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, CreditCard, Save, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { user, refreshSubscriptionStatus } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  
  // Get the active tab from the URL hash
  const hash = location.hash.replace('#', '');
  const defaultTab = ['profile', 'notifications', 'security', 'billing'].includes(hash) ? hash : 'profile';
  
  const [profileForm, setProfileForm] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: user?.email || 'john.smith@example.com',
    phone: '(555) 123-4567',
    company: user?.businessName || 'Smith Auto Shop'
  });

  // Refresh subscription on mount
  useEffect(() => {
    refreshSubscriptionStatus();
  }, [refreshSubscriptionStatus]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = () => {
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully."
      });
      setIsUpdating(false);
    }, 1000);
  };
  
  const handleCancelSubscription = () => {
    setIsCanceling(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been canceled. You'll have access until the end of your current period."
      });
      refreshSubscriptionStatus();
      setIsCanceling(false);
    }, 1500);
  };
  
  // Helper to format subscription plan name
  const formatPlanName = (plan: string | null) => {
    if (!plan) return 'No Plan';
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };
  
  // Helper to get status badge styling
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'trialing':
        return 'Trial';
      case 'past_due':
        return 'Past Due';
      case 'canceled':
        return 'Canceled';
      default:
        return 'Inactive';
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-smarttext-navy">Settings</h1>
        <p className="text-smarttext-slate">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full" onValueChange={(value) => navigate(`#${value}`)}>
        <TabsList className="mb-6 bg-gray-100">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white">
            <User size={16} className="mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white">
            <Bell size={16} className="mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white">
            <Shield size={16} className="mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-white">
            <CreditCard size={16} className="mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-smarttext-navy mb-4">Profile Information</h2>
            <p className="text-smarttext-slate mb-6">Update your personal and business information</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  value={profileForm.firstName} 
                  onChange={handleProfileChange} 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  value={profileForm.lastName} 
                  onChange={handleProfileChange} 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={profileForm.email} 
                  onChange={handleProfileChange} 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={profileForm.phone} 
                  onChange={handleProfileChange} 
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="company">Business Name</Label>
                <Input 
                  id="company" 
                  name="company" 
                  value={profileForm.company} 
                  onChange={handleProfileChange} 
                  className="mt-1"
                />
              </div>
            </div>
            
            <Button 
              className="bg-smarttext-primary hover:bg-smarttext-hover"
              onClick={handleSaveProfile}
              disabled={isUpdating}
            >
              <Save size={16} className="mr-2" />
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-smarttext-navy mb-4">Notification Preferences</h2>
            <p className="text-smarttext-slate mb-6">Control how and when you receive notifications</p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-smarttext-navy mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Messages</p>
                      <p className="text-sm text-smarttext-slate">Get notified when you receive new messages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Missed Calls</p>
                      <p className="text-sm text-smarttext-slate">Get notified when you miss a call</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Updates</p>
                      <p className="text-sm text-smarttext-slate">Get notified about new features and updates</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-smarttext-navy mb-4">SMS Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Messages</p>
                      <p className="text-sm text-smarttext-slate">Get SMS alerts for new messages</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Missed Calls</p>
                      <p className="text-sm text-smarttext-slate">Get SMS alerts for missed calls</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
            
            <Button className="bg-smarttext-primary hover:bg-smarttext-hover mt-6">
              <Save size={16} className="mr-2" />
              Save Preferences
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-smarttext-navy mb-4">Security Settings</h2>
            <p className="text-smarttext-slate mb-6">Manage your password and account security</p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-smarttext-navy mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" className="mt-1" />
                  </div>
                </div>
                <Button className="bg-smarttext-primary hover:bg-smarttext-hover mt-4">
                  Update Password
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium text-smarttext-navy mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Two-Factor Authentication</p>
                    <p className="text-sm text-smarttext-slate">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-smarttext-navy mb-4">Billing Information</h2>
            <p className="text-smarttext-slate mb-6">Manage your subscription and payment methods</p>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-smarttext-navy mb-4">Current Plan</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-smarttext-primary font-bold">
                      {formatPlanName(user?.subscription?.plan || null)} Plan
                    </span>
                    <span className="text-smarttext-slate ml-2">
                      ({user?.subscription?.plan === 'pro' ? '$399/month' : 
                        user?.subscription?.plan === 'core' ? '$249/month' : 
                        user?.subscription?.plan === 'growth' ? '$599+/month' : 'Free'})
                    </span>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusBadge(user?.subscription?.status || null)}`}>
                    {getStatusText(user?.subscription?.status || null)}
                  </span>
                </div>
                
                {user?.subscription?.trialEndsAt && (
                  <div className="flex items-center mb-3 text-sm text-blue-700">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      Trial ends on {format(parseISO(user.subscription.trialEndsAt), 'MMMM d, yyyy')}
                    </span>
                  </div>
                )}
                
                {user?.subscription?.currentPeriodEnd && (
                  <div className="flex items-center mb-4 text-sm text-smarttext-slate">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      Next billing date: {format(parseISO(user.subscription.currentPeriodEnd), 'MMMM d, yyyy')}
                    </span>
                  </div>
                )}
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>
                      {user?.subscription?.plan === 'pro' || user?.subscription?.plan === 'growth' ? 
                        'Custom AI responses tailored to your business' : 
                        'Auto-replies for missed calls'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>
                      {user?.subscription?.plan === 'pro' || user?.subscription?.plan === 'growth' ? 
                        'Lead capture form via text' : 
                        'Pre-built industry text templates'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>
                      {user?.subscription?.plan === 'growth' ? 
                        'Multi-location management' : 
                        user?.subscription?.plan === 'pro' ? 
                          'Built-in lead qualification flows' : 
                          'Simple appointment booking via text'}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {user?.subscription?.status === 'trialing' || user?.subscription?.status === 'active' ? (
                    <>
                      <Button variant="outline" size="sm">Change Plan</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={handleCancelSubscription}
                        disabled={isCanceling}
                      >
                        {isCanceling ? "Processing..." : "Cancel Subscription"}
                      </Button>
                    </>
                  ) : (
                    <Button className="bg-smarttext-primary hover:bg-smarttext-hover" size="sm">
                      Reactivate Subscription
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-smarttext-navy mb-4">Payment Method</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-6 bg-blue-600 rounded mr-3"></div>
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-smarttext-slate">Expires 12/2026</p>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium">Default</span>
                </div>
              </div>
              <Button variant="outline" size="sm">Update Payment Method</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
