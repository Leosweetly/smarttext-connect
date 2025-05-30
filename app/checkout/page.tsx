'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { redirectToStripeCheckout } from '@/src/services/stripe'
import { Button } from '@/src/components/ui/button'
import { ArrowLeft, CreditCard, Shield } from 'lucide-react'

interface Plan {
  name: string
  price: string
  priceId: string
  description: string
  features: string[]
  trialDays?: number
}

const plans: Record<string, Plan> = {
  core: {
    name: 'Core',
    price: '$249',
    priceId: 'price_core_monthly', // Replace with actual Stripe price ID
    description: 'For small businesses that need to stay responsive',
    features: [
      'Auto-replies for missed calls',
      'Pre-built industry text templates',
      'Simple appointment booking via text',
      'Email support'
    ],
    trialDays: 14
  },
  growth: {
    name: 'Growth',
    price: '$349',
    priceId: 'price_growth_monthly', // Replace with actual Stripe price ID
    description: 'For growing teams ready to personalize customer communication',
    features: [
      'Everything in Core',
      'Custom AI responses tailored to your business',
      'Lead capture form via text',
      'Built-in lead qualification flows',
      'Priority support'
    ],
    trialDays: 14
  },
  pro: {
    name: 'Pro',
    price: '$549',
    priceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    description: 'For high-volume businesses with advanced needs',
    features: [
      'Everything in Growth',
      'Multi-location management',
      'Dedicated AI training & onboarding',
      'SMS campaign & broadcast tools',
      'Premium support'
    ],
    trialDays: 14
  }
}

export default function Checkout() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const planId = searchParams?.get('plan') || 'growth'
  const plan = plans[planId]

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push(`/login?redirect=/checkout?plan=${planId}`)
      return
    }
  }, [user, router, planId])

  const handleCheckout = async () => {
    if (!user || !plan) return

    setIsLoading(true)
    setError(null)

    try {
      await redirectToStripeCheckout({
        priceId: plan.priceId,
        customerEmail: user.email,
        trialDays: plan.trialDays || 0,
        successUrl: `${window.location.origin}/success?plan=${planId}`,
        cancelUrl: `${window.location.origin}/checkout?plan=${planId}`,
        metadata: {
          userId: user.id,
          planId: planId,
          planName: plan.name
        }
      })
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Failed to start checkout process')
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Plan not found</h1>
          <Button 
            onClick={() => router.push('/pricing')}
            className="mt-4"
          >
            Back to Pricing
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/pricing')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Purchase</h1>
          <p className="mt-2 text-gray-600">
            You're about to subscribe to the {plan.name} plan
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Plan Summary</h2>
            
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
              <p className="text-gray-600">{plan.description}</p>
              <div className="mt-2">
                <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
              {plan.trialDays && (
                <p className="mt-1 text-sm text-green-600 font-medium">
                  {plan.trialDays}-day free trial included
                </p>
              )}
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">What's included:</h4>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Email
              </label>
              <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600">
                {user.email}
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  {plan.trialDays ? 'Start Free Trial' : 'Subscribe Now'}
                </div>
              )}
            </Button>

            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <Shield className="w-4 h-4 mr-1" />
              Secure payment powered by Stripe
            </div>

            <div className="mt-6 text-xs text-gray-500 text-center">
              <p>
                By subscribing, you agree to our{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </a>
              </p>
              {plan.trialDays && (
                <p className="mt-2">
                  Your trial will start immediately. You can cancel anytime before it ends.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
