
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { OnboardingStep, useOnboarding } from '@/hooks/use-onboarding';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import StepNavigation from '@/components/onboarding/StepNavigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Briefcase, Rocket, Check } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const SubscriptionSetup: React.FC = () => {
  const { isAuthenticated, isLoading, user, refreshSubscriptionStatus } = useAuth();
  const { progress, completeOnboarding } = useOnboarding();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleComplete = async () => {
    console.log('SubscriptionSetup: handleComplete called');
    
    if (isProcessing) {
      console.log('SubscriptionSetup: already submitting, returning');
      return false;
    }
    
    setIsProcessing(true);
    console.log('SubscriptionSetup: isSubmitting set to true');
    
    try {
      if (user?.subscription?.status === 'active' || user?.subscription?.status === 'trialing') {
        completeOnboarding();
        return true;
      }
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: user?.id,
        }),
      });
      
      console.log('SubscriptionSetup: API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create checkout session');
      }
      
      const { url } = await response.json();
      console.log('SubscriptionSetup: Redirecting to Stripe checkout URL:', url);
      
      window.location.href = url;
      return false;
    } catch (error) {
      console.error('SubscriptionSetup: Error creating checkout session:', error);
      toast({
        title: "Checkout Error",
        description: error.message || "There was an issue setting up your subscription. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
      console.log('SubscriptionSetup: isSubmitting set to false');
    }
  };
  
  const activateTrial = async (planName: string) => {
    try {
      setIsProcessing(true);
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: user?.id,
          planName: planName
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create checkout session');
      }
      
      const { url } = await response.json();
      
      window.location.href = url;
      
      return true;
    } catch (error) {
      console.error('Trial activation error:', error);
      toast({
        title: "Checkout Error",
        description: error.message || "There was an issue setting up your subscription. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }
  
  if (isLoading) {
    return null;
  }
  
  const trialEndDate = user?.subscription?.trialEndsAt 
    ? new Date(user.subscription.trialEndsAt)
    : addDays(new Date(), 14);
  
  const hasActiveSubscription = user?.subscription?.status === 'active' || user?.subscription?.status === 'trialing';
  
  return (
    <OnboardingLayout
      title="Choose Your Plan"
      description="Select a plan that suits your business needs"
      currentStep={OnboardingStep.SUBSCRIPTION_SETUP}
      showSkip={false}
    >
      <div className="space-y-6">
        <Card className="p-6 border border-gray-200 hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                <Briefcase className="h-5 w-5 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-smarttext-navy">Core</h2>
            </div>
            <div className="text-smarttext-navy font-bold">$249<span className="text-sm font-normal text-smarttext-slate">/month</span></div>
          </div>
          
          <p className="text-sm text-smarttext-slate mb-4">For small businesses that need to stay responsive</p>
          
          <div className="mb-4">
            <div className="flex items-start mb-2">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">Auto-replies for missed calls</p>
            </div>
            <div className="flex items-start mb-2">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">Pre-built industry text templates</p>
            </div>
            <div className="flex items-start mb-2">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">Simple appointment booking via text</p>
            </div>
            <div className="flex items-start">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">Email support</p>
            </div>
          </div>
          
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => activateTrial('core')}
            disabled={isProcessing}
          >
            Get Started
          </Button>
        </Card>
        
        <Card className="p-6 border border-gray-200 hover:border-gray-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Rocket className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-smarttext-navy">Growth</h2>
            </div>
            <div className="text-smarttext-navy font-bold">$349<span className="text-sm font-normal text-smarttext-slate">/month</span></div>
          </div>
          
          <p className="text-sm text-smarttext-slate mb-4">For growing teams ready to personalize customer communication</p>
          
          <div className="mb-4">
            <div className="flex items-start mb-2">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">Everything in Core</p>
            </div>
            <div className="flex items-start mb-2">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">Custom AI responses tailored to your business</p>
            </div>
            <div className="flex items-start mb-2">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">Lead capture form via text</p>
            </div>
            <div className="flex items-start mb-2">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">Built-in lead qualification flows</p>
            </div>
            <div className="flex items-start">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">Priority support</p>
            </div>
          </div>
          
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => activateTrial('growth')}
            disabled={isProcessing}
          >
            Get Started
          </Button>
        </Card>
        
        <Card className="p-6 border-2 border-smarttext-primary relative">
          <Badge 
            className="absolute -top-3 right-4 bg-smarttext-primary text-white font-medium px-3"
          >
            Most Popular
          </Badge>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-smarttext-primary/10 p-2 rounded-full mr-3">
                <Shield className="h-5 w-5 text-smarttext-primary" />
              </div>
              <h2 className="text-xl font-bold text-smarttext-navy">Pro</h2>
            </div>
            <div className="bg-smarttext-primary/10 text-smarttext-primary px-2 py-1 rounded text-sm font-medium">
              14-Day Trial
            </div>
          </div>
          
          <p className="text-sm text-smarttext-slate mb-4">For high-volume businesses with advanced needs</p>
          
          <div className="mb-4">
            <div className="flex items-start mb-2">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">Everything in Growth</p>
            </div>
            <div className="flex items-start mb-2">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">Multi-location management</p>
            </div>
            <div className="flex items-start mb-2">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">Dedicated AI training & onboarding</p>
            </div>
            <div className="flex items-start mb-2">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">SMS campaign & broadcast tools</p>
            </div>
            <div className="flex items-start">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">Premium support</p>
            </div>
          </div>
          
          <div className="flex justify-between items-baseline mb-4">
            <div className="text-2xl font-bold text-smarttext-navy">$549</div>
            <div className="text-smarttext-slate text-sm">per month after trial</div>
          </div>
          
          {hasActiveSubscription ? (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <h3 className="font-medium text-green-800">Subscription Active</h3>
                  <p className="text-sm text-green-700">
                    Your Pro trial is active until {format(trialEndDate, 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Button 
              onClick={() => activateTrial('pro')}
              className="w-full bg-smarttext-primary hover:bg-smarttext-hover"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Activate 14-Day Free Trial"}
            </Button>
          )}
          
          <p className="text-xs text-center text-smarttext-slate mt-4">
            You won't be charged during your trial. You can cancel anytime.
          </p>
        </Card>
        
        <StepNavigation
          onNext={handleComplete}
          isNextDisabled={isProcessing}
          isLastStep={true}
          nextLabel={hasActiveSubscription ? "Complete Setup" : "Start Free Trial"}
        />
        
        {isProcessing && (
          <div className="text-center text-sm text-smarttext-slate mt-4">
            {hasActiveSubscription ? "Finalizing your subscription and completing setup..." : "Setting up your trial subscription..."}
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
};

export default SubscriptionSetup;
