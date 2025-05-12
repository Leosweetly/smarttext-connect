import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import styles from './PricingTiers.module.css';

const tiers = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$99/mo',
    features: [
      'Auto-reply to missed calls',
      'SMS inbox',
      'Basic analytics'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$549/mo',
    features: [
      'Everything in Basic',
      'Advanced analytics',
      'Team inbox',
      'Custom auto-replies',
      'Priority support'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$999/mo',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced reporting',
      'Multi-location support',
      'White-label options'
    ],
    isFeatured: true,
    trialDays: 14
  }
];

export default function PricingTiers({ userId, onSelectPlan }: { userId?: string, onSelectPlan?: (tierId: string) => void }) {
  // Pre-select the highest tier (enterprise)
  const [selectedTier, setSelectedTier] = useState('enterprise');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (onSelectPlan) {
      onSelectPlan(selectedTier);
    } else {
      navigate(`/checkout?plan=${selectedTier}${userId ? `&userId=${userId}` : ''}`);
    }
  };

  return (
    <div className={styles.pricingContainer}>
      <h2 className={styles.title}>Choose Your Plan</h2>
      <p className={styles.subtitle}>Select the plan that works best for your business</p>
      
      <div className={styles.pricingTiers}>
        {tiers.map((tier) => (
          <div 
            key={tier.id}
            className={`${styles.pricingTier} ${selectedTier === tier.id ? styles.selected : ''} ${tier.isFeatured ? styles.featured : ''}`}
            onClick={() => setSelectedTier(tier.id)}
          >
            {tier.isFeatured && <div className={styles.featuredBadge}>RECOMMENDED</div>}
            <h3 className={styles.tierName}>{tier.name}</h3>
            <div className={styles.price}>{tier.price}</div>
            {tier.trialDays && (
              <div className={styles.trialBadge}>{tier.trialDays}-Day Free Trial</div>
            )}
            <ul className={styles.features}>
              {tier.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button 
              className={`${styles.selectButton} ${selectedTier === tier.id ? styles.selectedButton : ''}`}
              onClick={() => setSelectedTier(tier.id)}
            >
              {selectedTier === tier.id ? 'Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>
      
      <div className={styles.actionButtons}>
        <button 
          className={styles.continueButton}
          onClick={handleContinue}
        >
          Continue with {tiers.find(t => t.id === selectedTier)?.name}
        </button>
      </div>
    </div>
  );
}
