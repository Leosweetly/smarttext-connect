import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';
import { OnboardingStep, useOnboarding } from '@/hooks/use-onboarding';
import { cn } from '@/lib/utils';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  currentStep: OnboardingStep;
  showSkip?: boolean;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  title,
  description,
  currentStep,
  showSkip = true,
}) => {
  const { skipOnboarding, isStepComplete } = useOnboarding();
  const navigate = useNavigate();

  // Define the steps for the progress indicator
  const steps = [
    { id: OnboardingStep.BUSINESS_INFO, label: 'Business Info' },
    { id: OnboardingStep.COMMUNICATION_SETUP, label: 'Communication' },
    { id: OnboardingStep.MESSAGE_TEMPLATES, label: 'Templates' },
    { id: OnboardingStep.PRICING, label: 'Pricing' },
  ];

  // Calculate the current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-b from-smarttext-navy to-smarttext-slate flex flex-col">
      <header className="p-6 flex justify-between items-center">
        <Logo variant="light" className="h-8" />
        {showSkip && (
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={skipOnboarding}
          >
            Skip for now
          </Button>
        )}
      </header>

      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-8 animate-fade-in">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <Fragment key={step.id}>
                  {/* Step circle */}
                  <div 
                    className={cn(
                      "relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                      currentStepIndex === index 
                        ? "border-smarttext-primary bg-smarttext-primary text-white" 
                        : isStepComplete(step.id)
                          ? "border-smarttext-primary bg-smarttext-primary/10 text-smarttext-primary"
                          : "border-gray-300 bg-white text-gray-400"
                    )}
                    onClick={() => {
                      if (isStepComplete(step.id)) {
                        navigate(`/onboarding/${step.id}`);
                      }
                    }}
                    style={{ cursor: isStepComplete(step.id) ? 'pointer' : 'default' }}
                  >
                    {isStepComplete(step.id) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                    
                    {/* Step label */}
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap">
                      {step.label}
                    </span>
                  </div>
                  
                  {/* Connector line between steps */}
                  {index < steps.length - 1 && (
                    <div 
                      className={cn(
                        "flex-grow h-0.5 mx-2",
                        index < currentStepIndex 
                          ? "bg-smarttext-primary" 
                          : "bg-gray-300"
                      )}
                    />
                  )}
                </Fragment>
              ))}
            </div>
          </div>

          {/* Title and description */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-smarttext-navy mb-2">
              {title}
            </h1>
            <p className="text-smarttext-slate">
              {description}
            </p>
          </div>

          {/* Content */}
          <div className="mt-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
