import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './use-auth';

// Define the onboarding steps
export enum OnboardingStep {
  BUSINESS_INFO = 'business-info',
  COMMUNICATION_SETUP = 'communication-setup',
  MESSAGE_TEMPLATES = 'message-templates',
  FEATURE_TOUR = 'feature-tour',
}

// Define the shape of our onboarding progress
export interface OnboardingProgress {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  businessInfo: {
    name: string;
    industry: string;
    size: string;
    website?: string;
    logo?: string;
  };
  communicationSetup: {
    phone: string;
    businessHours: {
      monday: { open: string; close: string; closed: boolean };
      tuesday: { open: string; close: string; closed: boolean };
      wednesday: { open: string; close: string; closed: boolean };
      thursday: { open: string; close: string; closed: boolean };
      friday: { open: string; close: string; closed: boolean };
      saturday: { open: string; close: string; closed: boolean };
      sunday: { open: string; close: string; closed: boolean };
    };
    responseTime: string;
  };
  messageTemplates: {
    greeting: string;
    missedCall: string;
    commonResponses: string[];
  };
  isComplete: boolean;
}

// Define the default values for onboarding progress
const defaultOnboardingProgress: OnboardingProgress = {
  currentStep: OnboardingStep.BUSINESS_INFO,
  completedSteps: [],
  businessInfo: {
    name: '',
    industry: '',
    size: '',
  },
  communicationSetup: {
    phone: '',
    businessHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: true },
      sunday: { open: '09:00', close: '17:00', closed: true },
    },
    responseTime: '1 hour',
  },
  messageTemplates: {
    greeting: 'Hi! Thanks for reaching out to us. How can we help you today?',
    missedCall: 'Hi! Thanks for calling [Business Name]. We missed your call but will text you back ASAP.',
    commonResponses: [],
  },
  isComplete: false,
};

// Define the shape of our onboarding context
interface OnboardingContextType {
  progress: OnboardingProgress;
  updateBusinessInfo: (info: Partial<OnboardingProgress['businessInfo']>) => void;
  updateCommunicationSetup: (info: Partial<OnboardingProgress['communicationSetup']>) => void;
  updateMessageTemplates: (info: Partial<OnboardingProgress['messageTemplates']>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: OnboardingStep) => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  resetOnboarding: () => void;
  isStepComplete: (step: OnboardingStep) => boolean;
}

// Create the onboarding context with a default value
const OnboardingContext = createContext<OnboardingContextType>({
  progress: defaultOnboardingProgress,
  updateBusinessInfo: () => {},
  updateCommunicationSetup: () => {},
  updateMessageTemplates: () => {},
  goToNextStep: () => {},
  goToPreviousStep: () => {},
  goToStep: () => {},
  completeOnboarding: () => {},
  skipOnboarding: () => {},
  resetOnboarding: () => {},
  isStepComplete: () => false,
});

// Onboarding provider component
export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [progress, setProgress] = useState<OnboardingProgress>(defaultOnboardingProgress);
  const { user, completeOnboarding: markAuthOnboardingComplete, skipOnboarding: authSkipOnboarding } = useAuth();
  const navigate = useNavigate();

  // Load progress from localStorage on mount
  useEffect(() => {
    const loadProgress = () => {
      const storedProgress = localStorage.getItem('onboarding_progress');
      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      } else if (user) {
        // Initialize with user data if available
        setProgress(prev => ({
          ...prev,
          businessInfo: {
            ...prev.businessInfo,
            name: user.businessName || '',
          },
        }));
      }
    };

    loadProgress();
  }, [user]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('onboarding_progress', JSON.stringify(progress));
  }, [progress]);

  // Update business info
  const updateBusinessInfo = (info: Partial<OnboardingProgress['businessInfo']>) => {
    setProgress(prev => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        ...info,
      },
      completedSteps: prev.completedSteps.includes(OnboardingStep.BUSINESS_INFO)
        ? prev.completedSteps
        : [...prev.completedSteps, OnboardingStep.BUSINESS_INFO],
    }));
  };

  // Update communication setup
  const updateCommunicationSetup = (info: Partial<OnboardingProgress['communicationSetup']>) => {
    setProgress(prev => ({
      ...prev,
      communicationSetup: {
        ...prev.communicationSetup,
        ...info,
      },
      completedSteps: prev.completedSteps.includes(OnboardingStep.COMMUNICATION_SETUP)
        ? prev.completedSteps
        : [...prev.completedSteps, OnboardingStep.COMMUNICATION_SETUP],
    }));
  };

  // Update message templates
  const updateMessageTemplates = (info: Partial<OnboardingProgress['messageTemplates']>) => {
    setProgress(prev => ({
      ...prev,
      messageTemplates: {
        ...prev.messageTemplates,
        ...info,
      },
      completedSteps: prev.completedSteps.includes(OnboardingStep.MESSAGE_TEMPLATES)
        ? prev.completedSteps
        : [...prev.completedSteps, OnboardingStep.MESSAGE_TEMPLATES],
    }));
  };

  // Navigate to the next step
  const goToNextStep = () => {
    const steps = Object.values(OnboardingStep);
    const currentIndex = steps.indexOf(progress.currentStep);
    
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setProgress(prev => ({
        ...prev,
        currentStep: nextStep,
      }));
      navigate(`/onboarding/${nextStep}`);
    } else {
      // If we're at the last step, complete onboarding
      completeOnboarding();
    }
  };

  // Navigate to the previous step
  const goToPreviousStep = () => {
    const steps = Object.values(OnboardingStep);
    const currentIndex = steps.indexOf(progress.currentStep);
    
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      setProgress(prev => ({
        ...prev,
        currentStep: prevStep,
      }));
      navigate(`/onboarding/${prevStep}`);
    }
  };

  // Navigate to a specific step
  const goToStep = (step: OnboardingStep) => {
    setProgress(prev => ({
      ...prev,
      currentStep: step,
    }));
    navigate(`/onboarding/${step}`);
  };

  // Complete onboarding
  const completeOnboarding = () => {
    // Mark all steps as completed
    setProgress(prev => ({
      ...prev,
      completedSteps: Object.values(OnboardingStep),
      isComplete: true,
    }));
    
    // Update auth state
    markAuthOnboardingComplete();
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  // Skip onboarding
  const skipOnboarding = () => {
    authSkipOnboarding();
  };

  // Reset onboarding
  const resetOnboarding = () => {
    setProgress(defaultOnboardingProgress);
    localStorage.removeItem('onboarding_progress');
  };

  // Check if a step is complete
  const isStepComplete = (step: OnboardingStep) => {
    return progress.completedSteps.includes(step);
  };

  return (
    <OnboardingContext.Provider
      value={{
        progress,
        updateBusinessInfo,
        updateCommunicationSetup,
        updateMessageTemplates,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        completeOnboarding,
        skipOnboarding,
        resetOnboarding,
        isStepComplete,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

// Custom hook to use the onboarding context
export const useOnboarding = () => useContext(OnboardingContext);

export default useOnboarding;
