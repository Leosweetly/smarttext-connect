import React from 'react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/hooks/use-onboarding';

interface StepNavigationProps {
  onNext?: () => void;
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
  const { goToNextStep, goToPreviousStep } = useOnboarding();

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      goToNextStep();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goToPreviousStep();
    }
  };

  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
      <Button
        variant="outline"
        onClick={handleBack}
        disabled={isBackDisabled}
      >
        {backLabel}
      </Button>
      
      <Button
        onClick={handleNext}
        disabled={isNextDisabled}
        className="bg-smarttext-primary hover:bg-smarttext-hover"
      >
        {isLastStep ? 'Complete Setup' : nextLabel}
      </Button>
    </div>
  );
};

export default StepNavigation;
