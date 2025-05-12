'use client'

import { debug } from '@/lib/debug'
import TrialActivationForm from './components/TrialActivationForm'

export default function Onboarding() {
  debug('Rendering onboarding page with trial activation form', {})

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Set Up Your Business</h1>
          <p className="mt-2 text-gray-600">
            Activate your 14-day free trial to get started
          </p>
        </div>

        <TrialActivationForm />

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            Your trial includes all premium features with no credit card required.
          </p>
        </div>
      </div>
    </div>
  )
}
