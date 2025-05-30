'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Star, Clock } from 'lucide-react'

export default function Success() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(8)
  
  // Check if this is a trial activation
  const isTrial = searchParams?.get('trial') === 'true'
  const plan = searchParams?.get('plan') || 'Pro'

  useEffect(() => {
    // Start countdown and redirect after 8 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleContinue = () => {
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <CheckCircle className="h-20 w-20 text-green-500" />
              {isTrial && (
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1">
                  <Star className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
          
          {isTrial ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🎉 Trial Activated!
              </h1>
              <p className="text-lg text-gray-700 mb-4">
                Welcome to your 14-day free trial of SmartText Connect {plan}!
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-blue-800">14 Days Free</span>
                </div>
                <p className="text-sm text-blue-700">
                  Your trial includes all Pro features with no credit card required.
                  You can cancel anytime before the trial ends.
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
              <p className="mt-2 text-gray-600">
                Thank you for your purchase. Your payment has been processed successfully.
              </p>
            </>
          )}
        </div>

        {isTrial && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">What's included in your trial:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Unlimited conversations
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Advanced AI responses
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Custom templates
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Priority support
              </li>
            </ul>
          </div>
        )}

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500">
            Redirecting to your dashboard in {countdown} seconds...
          </p>
          
          <button
            onClick={handleContinue}
            className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {isTrial ? 'Start Using Your Trial' : 'Go to Dashboard'}
          </button>
          
          {isTrial && (
            <p className="text-xs text-gray-500 mt-4">
              Need help getting started? Check out our setup guide in the dashboard.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
