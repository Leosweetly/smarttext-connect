import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OnboardingStep, useOnboarding } from '@/hooks/use-onboarding';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  step: OnboardingStep;
  isComplete: boolean;
}

interface SetupChecklistProps {
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
}

const SetupChecklist: React.FC<SetupChecklistProps> = ({
  className,
  showTitle = true,
  compact = false,
}) => {
  const { progress, isStepComplete, goToStep } = useOnboarding();
  const navigate = useNavigate();

  // Define the checklist items
  const checklistItems: ChecklistItem[] = [
    {
      id: 'business-profile',
      label: 'Complete Business Profile',
      description: 'Add your business details and industry information',
      step: OnboardingStep.BUSINESS_INFO,
      isComplete: isStepComplete(OnboardingStep.BUSINESS_INFO),
    },
    {
      id: 'communication-setup',
      label: 'Set Up Communication Preferences',
      description: 'Configure business hours and response times',
      step: OnboardingStep.COMMUNICATION_SETUP,
      isComplete: isStepComplete(OnboardingStep.COMMUNICATION_SETUP),
    },
    {
      id: 'message-templates',
      label: 'Customize Message Templates',
      description: 'Personalize your automated responses',
      step: OnboardingStep.MESSAGE_TEMPLATES,
      isComplete: isStepComplete(OnboardingStep.MESSAGE_TEMPLATES),
    },
    {
      id: 'feature-tour',
      label: 'Complete Feature Tour',
      description: 'Learn how to use the dashboard effectively',
      step: OnboardingStep.FEATURE_TOUR,
      isComplete: isStepComplete(OnboardingStep.FEATURE_TOUR),
    },
  ];

  // Calculate completion percentage
  const completedItems = checklistItems.filter(item => item.isComplete).length;
  const completionPercentage = Math.round((completedItems / checklistItems.length) * 100);

  return (
    <Card className={cn("p-6", className)}>
      {showTitle && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-smarttext-navy">Setup Checklist</h3>
          <p className="text-sm text-smarttext-slate">
            {progress.isComplete 
              ? 'All setup tasks completed!' 
              : `${completionPercentage}% complete - ${checklistItems.length - completedItems} tasks remaining`}
          </p>
        </div>
      )}

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-4">
        <div 
          className="h-full bg-smarttext-primary rounded-full transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Checklist items */}
      <ul className="space-y-3">
        {checklistItems.map((item) => (
          <li 
            key={item.id}
            className={cn(
              "flex items-start p-2 rounded-lg transition-colors",
              item.isComplete ? "bg-green-50" : "bg-gray-50",
              !compact && "hover:bg-gray-100 cursor-pointer"
            )}
            onClick={() => {
              if (!compact) {
                navigate(`/onboarding/${item.step}`);
              }
            }}
          >
            {/* Checkbox */}
            <div 
              className={cn(
                "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5",
                item.isComplete 
                  ? "border-green-500 bg-green-500 text-white" 
                  : "border-gray-300"
              )}
            >
              {item.isComplete && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>

            {/* Content */}
            <div className="flex-grow">
              <p className={cn(
                "font-medium",
                item.isComplete ? "text-green-700" : "text-smarttext-navy"
              )}>
                {item.label}
              </p>
              {!compact && (
                <p className="text-xs text-smarttext-slate mt-1">
                  {item.description}
                </p>
              )}
            </div>

            {/* Action button (only for incomplete items and non-compact mode) */}
            {!item.isComplete && !compact && (
              <Button
                variant="ghost"
                size="sm"
                className="text-smarttext-primary hover:text-smarttext-hover ml-2 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  goToStep(item.step);
                }}
              >
                Complete
              </Button>
            )}
          </li>
        ))}
      </ul>

      {/* Resume button (only if not complete and not compact) */}
      {!progress.isComplete && !compact && (
        <Button
          className="w-full mt-4 bg-smarttext-primary hover:bg-smarttext-hover"
          onClick={() => navigate(`/onboarding/${progress.currentStep}`)}
        >
          Resume Setup
        </Button>
      )}
    </Card>
  );
};

export default SetupChecklist;
