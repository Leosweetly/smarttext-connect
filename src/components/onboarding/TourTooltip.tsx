import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TourTooltipProps {
  title: string;
  description: string;
  step: number;
  totalSteps: number;
  position?: 'top' | 'right' | 'bottom' | 'left';
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  className?: string;
}

const TourTooltip: React.FC<TourTooltipProps> = ({
  title,
  description,
  step,
  totalSteps,
  position = 'bottom',
  onNext,
  onPrevious,
  onSkip,
  className,
}) => {
  // Define position-specific classes
  const positionClasses = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
  };

  // Define arrow classes based on position
  const arrowClasses = {
    top: 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-t-white border-l-transparent border-r-transparent border-b-transparent',
    right: 'left-[-6px] top-1/2 transform -translate-y-1/2 border-r-white border-t-transparent border-b-transparent border-l-transparent',
    bottom: 'top-[-6px] left-1/2 transform -translate-x-1/2 border-b-white border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-[-6px] top-1/2 transform -translate-y-1/2 border-l-white border-t-transparent border-b-transparent border-r-transparent',
  };

  return (
    <div className={cn('absolute z-50', positionClasses[position], className)}>
      {/* Arrow */}
      <div 
        className={cn(
          'absolute w-0 h-0 border-solid border-[6px]',
          arrowClasses[position]
        )}
      />
      
      {/* Tooltip content */}
      <Card className="p-4 shadow-lg w-64">
        <div className="mb-3">
          <h4 className="text-sm font-bold text-smarttext-navy">{title}</h4>
          <p className="text-xs text-smarttext-slate mt-1">{description}</p>
        </div>
        
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-smarttext-slate">
            Step {step} of {totalSteps}
          </div>
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i}
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  i + 1 === step ? 'bg-smarttext-primary' : 'bg-gray-200'
                )}
              />
            ))}
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <div className="space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={step === 1}
              className="text-xs h-7 px-2"
            >
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSkip}
              className="text-xs h-7 px-2"
            >
              Skip
            </Button>
          </div>
          
          <Button
            size="sm"
            onClick={onNext}
            className="bg-smarttext-primary hover:bg-smarttext-hover text-xs h-7 px-3"
          >
            {step === totalSteps ? 'Finish' : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TourTooltip;
