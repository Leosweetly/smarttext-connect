
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Core',
    price: '$249',
    description: 'For small businesses that need to stay responsive',
    features: [
      'Auto-replies for missed calls',
      'Pre-built industry text templates',
      'Simple appointment booking via text',
      'Email support'
    ],
    isPopular: false,
    buttonText: 'Get Started',
    icon: '💼'
  },
  {
    name: 'Pro',
    price: '$399',
    description: 'For growing teams ready to personalize customer communication',
    features: [
      'Everything in Core',
      'Custom AI responses tailored to your business',
      'Lead capture form via text',
      'Built-in lead qualification flows',
      'Priority support'
    ],
    isPopular: true,
    buttonText: 'Most Popular',
    icon: '🚀'
  },
  {
    name: 'Growth',
    price: '$599+',
    description: 'For high-volume businesses with advanced needs',
    features: [
      'Everything in Pro',
      'Multi-location management',
      'Dedicated AI training & onboarding',
      'SMS campaign & broadcast tools',
      'Premium support'
    ],
    isPopular: false,
    buttonText: 'Contact Sales',
    icon: '🧠'
  }
];

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-smarttext-navy mb-4">
            Simple Pricing
          </h2>
          <p className="text-lg text-smarttext-slate max-w-2xl mx-auto">
            Transparent pricing with no hidden fees
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`${plan.isPopular ? "pricing-card-popular relative" : "pricing-card"} flex flex-col`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {plan.isPopular && (
                <div className="absolute top-0 inset-x-0 bg-smarttext-primary text-white py-2 font-bold text-center">
                  Most Popular
                </div>
              )}
              <div className={`p-8 ${plan.isPopular ? 'pt-14' : ''} flex-grow`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{plan.icon}</span>
                  <h3 className="text-2xl font-bold text-smarttext-navy">
                    {plan.name}
                  </h3>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-smarttext-primary">{plan.price}</span>
                  <span className="text-smarttext-slate ml-2">/month</span>
                </div>
                <p className="text-smarttext-slate mb-6">
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="text-smarttext-primary mr-2 mt-1 flex-shrink-0" size={18} />
                      <span className="text-smarttext-slate">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Button 
                    className={`w-full ${plan.isPopular ? 'bg-smarttext-primary hover:bg-smarttext-hover' : 'bg-smarttext-slate hover:bg-smarttext-primary'}`}
                    asChild
                  >
                    <Link to="/auth/signup">{plan.buttonText}</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
