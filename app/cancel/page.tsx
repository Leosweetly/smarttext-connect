'use client'

import { useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'

export default function Cancel() {
  const router = useRouter()

  const handleTryAgain = () => {
    router.push('/pricing')
  }

  const handleReturnToPricing = () => {
    router.push('/pricing')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Checkout Canceled</h1>
          <p className="mt-2 text-gray-600">
            Your checkout was canceled. No payment has been processed.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleTryAgain}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={handleReturnToPricing}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Return to Pricing
          </button>
        </div>
      </div>
    </div>
  )
}
