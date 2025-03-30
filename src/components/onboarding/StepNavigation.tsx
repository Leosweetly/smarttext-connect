import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useNavigate } from 'react-router-dom';
import { OnboardingStep } from '@/hooks/use-onboarding';

interface StepNavigationProps {
  onNext?: () => void | Promise<boolean>;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  isNextDisabled?: boolean;
  isBackDisabled?: boolean;
  isLastStep?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  onNext,
  onBack,
  nextLabel = 'Continue',
  backLabel = 'Back',
  isNextDisabled = false,
  isBackDisabled = false,
  isLastStep = false,
}) => {
  const { goToNextStep, goToPreviousStep, progress } = useOnboarding();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Direct navigation function that doesn't rely on context
  const directNavigate = () => {
    try {
      const steps = Object.values(OnboardingStep);
      const currentIndex = steps.indexOf(progress.currentStep);
      
      if (currentIndex < steps.length - 1) {
        const nextStep = steps[currentIndex + 1];
        // Use direct navigation
        window.location.href = `/onboarding/${nextStep}`;
      } else {
        // If we're at the last step, navigate to dashboard
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Navigation error:', error);
      setError('Navigation failed. Please try again or refresh the page.');
    }
  };

  const handleNext = async (e: React.MouseEvent) => {
    // Prevent default behavior
    e.preventDefault();
    e.stopPropagation();
    
    if (isNavigating) return; // Prevent multiple clicks
    setIsNavigating(true);
    setError(null);
    
    try {
      let shouldProceed = true;
      
      if (onNext) {
        try {
          const result = await onNext();
          // Only proceed if onNext returns true or undefined/void
          shouldProceed = result !== false;
        } catch (error) {
          console.error('Error in onNext:', error);
          setError('An error occurred while processing your information. Please try again.');
          shouldProceed = false;
        }
      }
      
      if (shouldProceed) {
        // Try the context navigation first
        try {
          goToNextStep();
          
          // Add a fallback - if we're still on the same page after a delay, use direct navigation
          setTimeout(() => {
            const steps = Object.values(OnboardingStep);
            const currentIndex = steps.indexOf(progress.currentStep);
            
            // Check if we're still on the same page by examining the URL
            const currentPath = window.location.pathname;
            const expectedPath = `/onboarding/${steps[currentIndex + 1]}`;
            
            if (currentPath.includes(`/onboarding/${progress.currentStep}`)) {
              console.log('Fallback navigation triggered');
              directNavigate();
            }
          }, 500);
        } catch (error) {
          console.error('Navigation error:', error);
          // Fallback to direct navigation
          directNavigate();
        }
      }
    } catch (error) {
      console.error('Error in handleNext:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      // Reset navigation state after a delay
      setTimeout(() => {
        setIsNavigating(false);
      }, 1000);
    }
  };

  const handleBack = () => {
    if (isNavigating) return; // Prevent multiple clicks
    
    if (onBack) {
      onBack();
    } else {
      try {
        goToPreviousStep();
      } catch (error) {
        console.error('Back navigation error:', error);
        // Fallback to direct navigation
        const steps = Object.values(OnboardingStep);
        const currentIndex = steps.indexOf(progress.currentStep);
        
        if (currentIndex > 0) {
          const prevStep = steps[currentIndex - 1];
          window.location.href = `/onboarding/${prevStep}`;
        }
      }
    }
  };

  return (
    <div className="flex flex-col mt-8 pt-6 border-t border-gray-200">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isBackDisabled || isNavigating}
        >
          {backLabel}
        </Button>
        
        <Button
          type="button"
          onClick={handleNext}
          disabled={isNextDisabled || isNavigating}
          className="bg-smarttext-primary hover:bg-smarttext-hover"
        >
          {isNavigating ? 'Processing...' : isLastStep ? 'Complete Setup' : nextLabel}
        </Button>
      </div>
    </div>
  );
};

export default StepNavigation;
