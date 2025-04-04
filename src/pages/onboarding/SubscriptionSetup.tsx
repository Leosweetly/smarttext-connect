
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { OnboardingStep, useOnboarding } from '@/hooks/use-onboarding';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import StepNavigation from '@/components/onboarding/StepNavigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Check } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const SubscriptionSetup: React.FC = () => {
  const { isAuthenticated, isLoading, user, refreshSubscriptionStatus } = useAuth();
  const { progress, completeOnboarding } = useOnboarding();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Handle completion
  const handleComplete = async () => {
    console.log('SubscriptionSetup: handleComplete called');
    
    if (isProcessing) {
      console.log('SubscriptionSetup: already submitting, returning');
      return false;
    }
    
    setIsProcessing(true);
    console.log('SubscriptionSetup: isSubmitting set to true');
    
    try {
      // Ensure subscription is active
      if (!user?.subscription?.status) {
        await activateTrial();
      }
      
      // Mark onboarding as complete
      console.log('SubscriptionSetup: marking onboarding as complete');
      completeOnboarding();
      console.log('SubscriptionSetup: onboarding marked as complete');
      return true;
    } catch (error) {
      console.error('SubscriptionSetup: Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "There was an issue activating your subscription. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
      console.log('SubscriptionSetup: isSubmitting set to false');
    }
  };
  
  // Activate the trial subscription
  const activateTrial = async () => {
    try {
      // In a real app, this would call a backend API to create a Stripe checkout session
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user with trial subscription
      await refreshSubscriptionStatus();
      
      toast({
        title: "Subscription Activated",
        description: "Your 14-day trial has started. Welcome to SmartText AI Pro!",
      });
      
      return true;
    } catch (error) {
      console.error('Trial activation error:', error);
      throw error;
    }
  };
  
  // If not authenticated, redirect to login
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }
  
  // If loading, return null (loading state is handled by parent)
  if (isLoading) {
    return null;
  }
  
  // Calculate trial end date (for display purposes)
  const trialEndDate = user?.subscription?.trialEndsAt 
    ? new Date(user.subscription.trialEndsAt)
    : addDays(new Date(), 14);
  
  const hasActiveSubscription = user?.subscription?.status === 'active' || user?.subscription?.status === 'trialing';
  
  return (
    <OnboardingLayout
      title="Subscription Setup"
      description="Activate your SmartText AI Pro subscription"
      currentStep={OnboardingStep.SUBSCRIPTION_SETUP}
      showSkip={false}
    >
      <div className="space-y-6">
        <Card className="p-6 border-2 border-smarttext-primary">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-smarttext-primary mr-2" />
              <h2 className="text-xl font-bold text-smarttext-navy">Pro Plan</h2>
            </div>
            <div className="bg-smarttext-primary/10 text-smarttext-primary px-2 py-1 rounded text-sm font-medium">
              14-Day Trial
            </div>
          </div>
          
          <div className="mb-4">
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
          
          <div className="flex justify-between items-baseline mb-4">
            <div className="text-2xl font-bold text-smarttext-navy">$399</div>
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
              onClick={activateTrial}
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
        
        {/* Navigation */}
        <StepNavigation
          onNext={handleComplete}
          isNextDisabled={isProcessing || !hasActiveSubscription}
          isLastStep={true}
          nextLabel="Complete Setup"
        />
        
        {/* Loading indicator */}
        {isProcessing && (
          <div className="text-center text-sm text-smarttext-slate mt-4">
            Finalizing your subscription and completing setup...
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
};

export default SubscriptionSetup;
