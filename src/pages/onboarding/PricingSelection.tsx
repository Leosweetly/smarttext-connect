import { useAuth } from '@/hooks/use-auth';
import { OnboardingStep } from '@/hooks/use-onboarding';
import PricingTiers from '@/components/pricing/PricingTiers';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';

export default function PricingSelection() {
  const { user } = useAuth();
  
  return (
    <OnboardingLayout
      title="Choose Your Plan"
      description="Select the plan that best fits your business needs"
      currentStep={OnboardingStep.PRICING} // Use the dedicated pricing step
      showSkip={false} // Don't allow skipping the pricing selection
    >
      <div className="py-6">
        <PricingTiers userId={user?.id} />
      </div>
    </OnboardingLayout>
  );
}
