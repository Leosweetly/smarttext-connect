'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Star } from 'lucide-react'
import { Button } from '@/src/components/ui/button'

const tiers = [
  {
    id: 'core',
    name: 'Core',
    price: '$249',
    period: '/month',
    description: 'For small businesses that need to stay responsive',
    icon: '💼',
    features: [
      'Auto-replies for missed calls',
      'Pre-built industry text templates',
      'Simple appointment booking via text',
      'Email support'
    ],
    cta: 'Get Started'
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$349',
    period: '/month',
    description: 'For growing teams ready to personalize customer communication',
    icon: '🚀',
    features: [
      'Everything in Core',
      'Custom AI responses tailored to your business',
      'Lead capture form via text',
      'Built-in lead qualification flows',
      'Priority support'
    ],
    cta: 'Get Started',
    isFeatured: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$549',
    period: '/month',
    description: 'For high-volume businesses with advanced needs',
    icon: '🧠',
    features: [
      'Everything in Growth',
      'Multi-location management',
      'Dedicated AI training & onboarding',
      'SMS campaign & broadcast tools',
      'Premium support'
    ],
    cta: 'Get Started'
  }
]

export default function Pricing() {
  const router = useRouter()
  const [selectedTier, setSelectedTier] = useState('pro')

  const handleSelectPlan = (tierId: string) => {
    setSelectedTier(tierId)
    
    if (tierId === 'enterprise') {
      // For enterprise, could redirect to contact form
      router.push('/contact')
    } else {
      // Redirect to checkout for all paid plans
      router.push(`/checkout?plan=${tierId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Select the plan that works best for your business. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white rounded-2xl shadow-lg ${
                tier.isFeatured
                  ? 'ring-2 ring-blue-600 scale-105'
                  : 'ring-1 ring-gray-200'
              }`}
            >
              {tier.isFeatured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{tier.icon}</span>
                  <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                </div>
                <p className="mt-2 text-gray-600">{tier.description}</p>
                
                <div className="mt-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      {tier.price}
                    </span>
                    <span className="ml-1 text-xl text-gray-600">
                      {tier.period}
                    </span>
                  </div>

                </div>

                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectPlan(tier.id)}
                  className={`mt-8 w-full py-3 px-6 text-center font-medium rounded-lg transition-colors ${
                    tier.isFeatured
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {tier.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens after my free trial?
              </h3>
              <p className="text-gray-600">
                After your 14-day trial ends, you'll be charged for your selected plan. You can cancel anytime before the trial ends.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans later?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time from your dashboard settings. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for all paid plans. Contact support for assistance with refunds.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a setup fee?
              </h3>
              <p className="text-gray-600">
                No setup fees. You only pay the monthly subscription fee for your chosen plan.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to get started?
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Join thousands of businesses using SmartText Connect
          </p>
          <Button
            onClick={() => handleSelectPlan('growth')}
            className="mt-8 bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 text-lg"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  )
}
