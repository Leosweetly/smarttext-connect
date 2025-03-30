import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { OnboardingStep, useOnboarding } from '@/hooks/use-onboarding';
import { useAuth } from '@/hooks/use-auth';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import SetupChecklist from '@/components/onboarding/SetupChecklist';

const OnboardingIndex: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { progress, goToStep } = useOnboarding();
  const navigate = useNavigate();

  // Redirect to the current step if there's an active onboarding session
  useEffect(() => {
    if (!isLoading && progress.currentStep) {
      navigate(`/onboarding/${progress.currentStep}`);
    }
  }, [isLoading, progress.currentStep, navigate]);

  // If not authenticated, redirect to login
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-smarttext-navy to-smarttext-slate flex flex-col items-center justify-center">
        <Logo variant="light" className="h-12 mb-6" />
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-smarttext-navy to-smarttext-slate flex flex-col">
      <header className="p-6">
        <Logo variant="light" className="h-8" />
      </header>

      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-smarttext-navy mb-2">
              Welcome to SmartText AI, {user?.businessName}!
            </h1>
            <p className="text-smarttext-slate">
              Let's set up your account to get the most out of our platform.
            </p>
          </div>

          <SetupChecklist className="mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              className="bg-smarttext-primary hover:bg-smarttext-hover h-auto py-4 flex flex-col items-center"
              onClick={() => goToStep(OnboardingStep.BUSINESS_INFO)}
            >
              <span className="text-lg font-medium">Start Setup</span>
              <span className="text-xs mt-1">Complete all steps</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center border-smarttext-primary text-smarttext-primary hover:bg-smarttext-primary/10"
              onClick={() => navigate('/dashboard')}
            >
              <span className="text-lg font-medium">Skip for Now</span>
              <span className="text-xs mt-1">Go to dashboard</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingIndex;
