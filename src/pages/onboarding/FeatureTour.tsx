import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { OnboardingStep, useOnboarding } from '@/hooks/use-onboarding';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import StepNavigation from '@/components/onboarding/StepNavigation';
import TourTooltip from '@/components/onboarding/TourTooltip';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { saveBusinessToAirtable, onboardingToBusinessData } from '@/services/airtable';
import { sendOnboardingCompletionEmail } from '@/services/notifications';
import { Users, MessageSquare, PhoneMissed, Settings, BarChart } from 'lucide-react';

const FeatureTour: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { progress, completeOnboarding } = useOnboarding();
  
  // Tour state
  const [currentTourStep, setCurrentTourStep] = useState(1);
  const [activeTourItem, setActiveTourItem] = useState<string>('dashboard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Tour steps
  const tourSteps = [
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      description: 'Your dashboard gives you a quick overview of your business metrics and recent activity.',
      icon: <BarChart className="h-6 w-6 text-smarttext-primary" />,
      position: 'bottom',
    },
    {
      id: 'customers',
      title: 'Customer Management',
      description: 'View and manage all your customer contacts in one place.',
      icon: <Users className="h-6 w-6 text-smarttext-primary" />,
      position: 'bottom',
    },
    {
      id: 'conversations',
      title: 'Conversations',
      description: 'Manage all your customer conversations from this tab. Reply to messages and see conversation history.',
      icon: <MessageSquare className="h-6 w-6 text-smarttext-primary" />,
      position: 'right',
    },
    {
      id: 'missed-calls',
      title: 'Missed Calls',
      description: 'Never miss an opportunity. Follow up on missed calls with automated text messages.',
      icon: <PhoneMissed className="h-6 w-6 text-smarttext-primary" />,
      position: 'left',
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Customize your account, manage team members, and configure integrations.',
      icon: <Settings className="h-6 w-6 text-smarttext-primary" />,
      position: 'top',
    },
  ];
  
  // Handle tour navigation
  const handleNextTourStep = () => {
    if (currentTourStep < tourSteps.length) {
      setCurrentTourStep(currentTourStep + 1);
      setActiveTourItem(tourSteps[currentTourStep].id);
    } else {
      // Tour complete
      setActiveTourItem('');
    }
  };
  
  const handlePreviousTourStep = () => {
    if (currentTourStep > 1) {
      setCurrentTourStep(currentTourStep - 1);
      setActiveTourItem(tourSteps[currentTourStep - 2].id);
    }
  };
  
  const handleSkipTour = () => {
    setActiveTourItem('');
  };
  
  // Handle completion
  const handleComplete = async () => {
    console.log('FeatureTour: handleComplete called');
    
    if (isSubmitting) {
      console.log('FeatureTour: already submitting, returning');
      return;
    }
    
    setIsSubmitting(true);
    console.log('FeatureTour: isSubmitting set to true');
    
    try {
      // Save business data to Airtable
      console.log('FeatureTour: preparing to save business data to Airtable');
      const businessData = onboardingToBusinessData(progress);
      console.log('FeatureTour: business data prepared:', businessData);
      await saveBusinessToAirtable(businessData);
      console.log('FeatureTour: business data saved to Airtable');
      
      // Send confirmation email
      if (user?.email) {
        console.log('FeatureTour: sending confirmation email to:', user.email);
        await sendOnboardingCompletionEmail(user.email, user.businessName);
        console.log('FeatureTour: confirmation email sent');
      }
      
      // Mark onboarding as complete
      console.log('FeatureTour: marking onboarding as complete');
      completeOnboarding();
      console.log('FeatureTour: onboarding marked as complete');
    } catch (error) {
      console.error('FeatureTour: Error completing onboarding:', error);
      // Still mark as complete even if there's an error with external services
      console.log('FeatureTour: marking onboarding as complete despite error');
      completeOnboarding();
    } finally {
      setIsSubmitting(false);
      console.log('FeatureTour: isSubmitting set to false');
    }
    
    console.log('FeatureTour: handleComplete returning true');
    return true;
  };
  
  // If not authenticated, redirect to login
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }
  
  // If loading, return null (loading state is handled by parent)
  if (isLoading) {
    return null;
  }
  
  return (
    <OnboardingLayout
      title="Feature Tour"
      description="Let's explore the key features of SmartText AI"
      currentStep={OnboardingStep.FEATURE_TOUR}
      showSkip={false}
    >
      <div className="space-y-6">
        {/* Feature tour */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tourSteps.map((step) => (
            <Card
              key={step.id}
              className={`p-4 relative cursor-pointer transition-all ${
                activeTourItem === step.id
                  ? 'ring-2 ring-smarttext-primary ring-offset-2'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => {
                setActiveTourItem(step.id);
                setCurrentTourStep(tourSteps.findIndex(s => s.id === step.id) + 1);
              }}
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="mb-3 p-3 bg-smarttext-primary/10 rounded-full">
                  {step.icon}
                </div>
                <h3 className="font-medium text-smarttext-navy mb-2">{step.title}</h3>
                <p className="text-sm text-smarttext-slate">{step.description}</p>
                
                {/* Tour tooltip */}
                {activeTourItem === step.id && (
                  <TourTooltip
                    title={step.title}
                    description={step.description}
                    step={currentTourStep}
                    totalSteps={tourSteps.length}
                    position={step.position as any}
                    onNext={handleNextTourStep}
                    onPrevious={handlePreviousTourStep}
                    onSkip={handleSkipTour}
                    className="z-10"
                  />
                )}
              </div>
            </Card>
          ))}
        </div>
        
        {/* Start tour button (if no active tour) */}
        {!activeTourItem && (
          <Button
            className="w-full bg-smarttext-primary hover:bg-smarttext-hover"
            onClick={() => {
              setActiveTourItem(tourSteps[0].id);
              setCurrentTourStep(1);
            }}
          >
            Start Guided Tour
          </Button>
        )}
        
        {/* Navigation */}
        <StepNavigation
          onNext={handleComplete}
          isNextDisabled={isSubmitting}
          isLastStep={true}
        />
        
        {/* Loading indicator */}
        {isSubmitting && (
          <div className="text-center text-sm text-smarttext-slate mt-4">
            Saving your settings and completing setup...
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
};

export default FeatureTour;
