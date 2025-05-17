
'use client'

import { debug } from '@/lib/debug'
import TrialActivationForm from './components/TrialActivationForm'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../../src/components/ui/hover-card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../src/components/ui/tooltip'
import { Button } from '../../../src/components/ui/button'

export default function Onboarding() {
  debug('Rendering onboarding page with trial activation form', {})

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Set Up Your Business</h1>
          <p className="mt-2 text-gray-600">
            Activate your 14-day free trial of our Pro tier to get started
          </p>
        </div>

        {/* Feature list with checkmarks */}
        <div className="space-y-3 mt-6">
          <h3 className="text-lg font-semibold">Your trial includes:</h3>
          <ul className="space-y-2">
            {['Unlimited conversations', 'Advanced AI responses', 'Custom templates', 'Priority support'].map((feature) => (
              <li key={feature} className="flex items-center">
                <span className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <TrialActivationForm />

        <div className="mt-6 text-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="link" className="text-sm text-gray-500">
                  What happens after my trial?
                </Button>
              </TooltipTrigger>
              <TooltipContent className="p-3 max-w-xs">
                <p>After your 14-day trial ends, you'll automatically be subscribed to our Pro tier at $549/month. You can downgrade or cancel anytime before the trial ends.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            Your trial includes all Pro tier features with no credit card required.
          </p>
        </div>
      </div>
    </div>
  )
}
