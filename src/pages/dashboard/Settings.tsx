import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, CreditCard, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { getSubscriptionStatus } from '@/services/stripe';
import { SubscriptionStatus } from '@/services/airtable';
import CancellationFeedback from '@/components/dashboard/CancellationFeedback';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: ''
  });
  
  // Subscription state
  const [subscription, setSubscription] = useState<{
    active: boolean;
    status?: SubscriptionStatus;
    trialEnd?: Date;
    planName?: string;
    planId?: string;
    subscriptionId?: string;
    customerId?: string;
  }>({
    active: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  
  // Load user profile data
  useEffect(() => {
    if (user) {
      // Split name into first and last name (simple implementation)
      const nameParts = (user.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setProfileForm({
        firstName,
        lastName,
        email: user.email || '',
        phone: '', // Assuming phone is not in the user object
        company: user.businessName || ''
      });
    }
  }, [user]);
  
  // Load subscription data
  useEffect(() => {
    const loadSubscription = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Mock customer ID for demo purposes
        const customerId = `cus_mock_${user.id}`;
        
        const subscriptionData = await getSubscriptionStatus(customerId);
        
        setSubscription({
          ...subscriptionData,
          customerId
        });
      } catch (error) {
        console.error('Error loading subscription:', error);
        toast({
          title: 'Error',
          description: 'Failed to load subscription information',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSubscription();
  }, [user, toast]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-smarttext-navy">Settings</h1>
        <p className="text-smarttext-slate">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
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
            
            <Button className="bg-smarttext-primary hover:bg-smarttext-hover">
              <Save size={16} className="mr-2" />
              Save Changes
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
              
              {isLoading ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-center h-32">
                  <p className="text-smarttext-slate">Loading subscription information...</p>
                </div>
              ) : subscription.active ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-smarttext-primary font-bold">{subscription.planName || 'Business Pro'}</span>
                      <span className="text-smarttext-slate ml-2">($399/month)</span>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      subscription.status === SubscriptionStatus.TRIALING 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {subscription.status === SubscriptionStatus.TRIALING ? 'Trial' : 'Active'}
                    </span>
                  </div>
                  
                  {subscription.status === SubscriptionStatus.TRIALING && subscription.trialEnd && (
                    <div className="mb-3 flex items-center text-amber-600">
                      <AlertCircle size={16} className="mr-1" />
                      <p className="text-sm">
                        Your trial ends on {subscription.trialEnd.toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  <p className="text-sm text-smarttext-slate mb-4">
                    {subscription.status === SubscriptionStatus.TRIALING 
                      ? `Your first payment will be processed on ${subscription.trialEnd?.toLocaleDateString() || 'trial end'}`
                      : `Your next billing date is ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`
                    }
                  </p>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Change Plan</Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => setShowCancellationModal(true)}
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-smarttext-slate font-bold">No Active Subscription</span>
                    </div>
                    <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full font-medium">Inactive</span>
                  </div>
                  <p className="text-sm text-smarttext-slate mb-4">
                    You don't have an active subscription. Subscribe to access all features.
                  </p>
                  <Button className="bg-smarttext-primary hover:bg-smarttext-hover">
                    Subscribe Now
                  </Button>
                </div>
              )}
              
              {/* Cancellation Feedback Modal */}
              {subscription.subscriptionId && subscription.customerId && (
                <CancellationFeedback
                  open={showCancellationModal}
                  onOpenChange={setShowCancellationModal}
                  subscriptionId={subscription.subscriptionId}
                  customerId={subscription.customerId}
                  onCancellationComplete={() => {
                    setSubscription(prev => ({
                      ...prev,
                      active: false,
                      status: SubscriptionStatus.CANCELED
                    }));
                  }}
                />
              )}
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
              <Button variant="outline" size="sm">Add Payment Method</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
