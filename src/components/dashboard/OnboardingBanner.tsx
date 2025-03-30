import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X } from 'lucide-react';
import { useOnboarding } from '@/hooks/use-onboarding';

interface OnboardingBannerProps {
  className?: string;
}

const OnboardingBanner: React.FC<OnboardingBannerProps> = ({ className }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const { progress } = useOnboarding();
  const navigate = useNavigate();

  // If onboarding is complete or banner is dismissed, don't show
  if (progress.isComplete || isDismissed) {
    return null;
  }

  // Calculate completion percentage
  const totalSteps = 4; // Total number of onboarding steps
  const completedSteps = progress.completedSteps.length;
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <Alert 
      className={`bg-smarttext-primary/10 border-smarttext-primary mb-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-grow">
          <AlertDescription className="text-smarttext-navy">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="font-medium">
                {completedSteps === 0 
                  ? 'Complete your account setup' 
                  : `Setup ${completionPercentage}% complete - Finish setting up your account`}
              </span>
              <Button
                variant="link"
                className="text-smarttext-primary p-0 h-auto sm:ml-2"
                onClick={() => navigate(`/onboarding/${progress.currentStep}`)}
              >
                Continue setup →
              </Button>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-white/50 rounded-full mt-2">
              <div 
                className="h-full bg-smarttext-primary rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </AlertDescription>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 rounded-full"
          onClick={() => setIsDismissed(true)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </Alert>
  );
};

export default OnboardingBanner;
