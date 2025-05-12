import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { OnboardingStep, useOnboarding } from '@/hooks/use-onboarding';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { logSubscriptionToAirtable } from '@/services/stripe';

const CheckoutSuccess: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { goToStep } = useOnboarding();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  // Process checkout success
  useEffect(() => {
    const processCheckoutSuccess = async () => {
      try {
        // Get session_id from URL
        const sessionId = searchParams.get('session_id');
        
        if (!sessionId) {
          console.error('No session_id found in URL');
          setIsProcessing(false);
          return;
        }

        // Get subscription data from URL params
        const customerId = searchParams.get('customer_id');
        const subscriptionId = searchParams.get('subscription_id');
        const planId = searchParams.get('plan_id');
        const planName = searchParams.get('plan_name');
        const trialStart = searchParams.get('trial_start');
        const trialEnd = searchParams.get('trial_end');

        // Log subscription data to Airtable (optional)
        if (user?.id && customerId && subscriptionId && planId && trialStart && trialEnd) {
          await logSubscriptionToAirtable(user.id, {
            customerId,
            subscriptionId,
            planId,
            planName: planName || 'Business Pro',
            trialStart: new Date(parseInt(trialStart) * 1000),
            trialEnd: new Date(parseInt(trialEnd) * 1000),
          });
        }

        // Redirect to onboarding after a short delay
        setTimeout(() => {
          setIsProcessing(false);
          goToStep(OnboardingStep.BUSINESS_INFO);
        }, 2000);
      } catch (error) {
        console.error('Error processing checkout success:', error);
        setIsProcessing(false);
      }
    };

    if (!isLoading && isAuthenticated) {
      processCheckoutSuccess();
    }
  }, [isLoading, isAuthenticated, searchParams, user, goToStep]);

  // If not authenticated, redirect to login
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  // If loading, show loading state
  if (isLoading || isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-smarttext-navy to-smarttext-slate flex flex-col items-center justify-center">
        <Logo variant="light" className="h-12 mb-6" />
        <div className="text-white text-lg">Processing your subscription...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-smarttext-navy to-smarttext-slate flex flex-col">
      <header className="p-6">
        <Logo variant="light" className="h-8" />
      </header>

      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 animate-fade-in text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-smarttext-navy mb-2">
            Payment Successful!
          </h1>
          
          <p className="text-smarttext-slate mb-6">
            Your 14-day trial has started. Let's set up your account to get the most out of SmartText AI.
          </p>
          
          <Button
            className="w-full bg-smarttext-primary hover:bg-smarttext-hover"
            onClick={() => goToStep(OnboardingStep.BUSINESS_INFO)}
          >
            Continue to Setup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
