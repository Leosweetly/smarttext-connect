'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { debug, measureAsyncPerformance } from '@/lib/debug'
import { Database } from '@/types/database.types'
import { Clock, Star, CheckCircle, AlertCircle } from 'lucide-react'

type Business = Database['public']['Tables']['businesses']['Row']

export default function Dashboard() {
  const { user, business, isLoading } = useAuth()
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [trialInfo, setTrialInfo] = useState<{
    isOnTrial: boolean
    daysRemaining: number
    trialEndDate: string | null
  }>({ isOnTrial: false, daysRemaining: 0, trialEndDate: null })

  useEffect(() => {
    if (business) {
      // Format the last updated time
      const formatLastUpdated = () => {
        try {
          const updatedDate = new Date(business.updated_at)
          setLastUpdated(new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
          }).format(updatedDate))
        } catch (err) {
          debug('Error formatting date', { date: business.updated_at })
          setLastUpdated(business.updated_at)
        }
      }

      // Check trial status
      const checkTrialStatus = () => {
        if (business.trial_expiration_date) {
          const trialEndDate = new Date(business.trial_expiration_date)
          const now = new Date()
          const isOnTrial = trialEndDate > now && Boolean(business.trial_plan)
          const daysRemaining = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          
          setTrialInfo({
            isOnTrial,
            daysRemaining: Math.max(0, daysRemaining),
            trialEndDate: business.trial_expiration_date
          })
        }
      }

      measureAsyncPerformance(() => Promise.resolve(formatLastUpdated()), 'dashboard.formatDate')
      checkTrialStatus()
    }
  }, [business])

  // Show loading state while checking auth
  if (isLoading || !business) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Trial Status Banner */}
      {trialInfo.isOnTrial && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-full mr-4">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Pro Trial Active</h3>
                <p className="text-blue-100">
                  {trialInfo.daysRemaining} days remaining in your free trial
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-blue-100 mb-2">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  Expires {new Date(trialInfo.trialEndDate!).toLocaleDateString()}
                </span>
              </div>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
          
          {trialInfo.daysRemaining <= 3 && (
            <div className="mt-4 p-3 bg-yellow-500 bg-opacity-20 rounded-md border border-yellow-300 border-opacity-30">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-200 mr-2" />
                <p className="text-sm text-yellow-100">
                  Your trial expires soon. Upgrade to continue using Pro features.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
        <p className="text-gray-600 mb-2">
          Manage your business information and settings from here.
        </p>
        {lastUpdated && (
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Information Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Business Information</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Business Name</p>
              <p className="font-medium">{business.name}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Owner Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Business Hours</p>
              <p className="font-medium">
                {business.hours ? (
                  JSON.stringify(business.hours)
                ) : (
                  <span className="text-gray-400">Not set</span>
                )}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Ordering Instructions</p>
              <p className="font-medium">
                {business.ordering_instructions ? (
                  business.ordering_instructions
                ) : (
                  <span className="text-gray-400">Not set</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <a 
              href="/dashboard/settings" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Business Information
            </a>
          </div>
        </div>
        
        {/* FAQs Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
          
          {business.faqs && Array.isArray(business.faqs) && business.faqs.length > 0 ? (
            <div className="space-y-4">
              {(business.faqs as any[]).map((faq, index) => (
                <div key={index} className="border-b pb-3">
                  <p className="font-medium">{faq.question}</p>
                  <p className="text-gray-600 mt-1">{faq.answer}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No FAQs added yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Add FAQs in your business settings
              </p>
            </div>
          )}
          
          <div className="mt-6">
            <a 
              href="/dashboard/settings#faqs" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Manage FAQs
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
