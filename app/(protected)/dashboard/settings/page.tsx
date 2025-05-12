'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { debug, error as logError, info, measureAsyncPerformance } from '@/lib/debug'
import { Database } from '@/types/database.types'

type Business = Database['public']['Tables']['businesses']['Row']
type BusinessHours = { [key: string]: { open: string; close: string } }
type FAQ = { question: string; answer: string }

export default function Settings() {
  const { user, business, isLoading, updateBusiness } = useAuth()
  
  // Form state
  const [name, setName] = useState('')
  const [hours, setHours] = useState<BusinessHours>({})
  const [orderingInstructions, setOrderingInstructions] = useState('')
  const [faqs, setFaqs] = useState<FAQ[]>([])
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  
  // Initialize form with business data
  useEffect(() => {
    if (business) {
      debug('Initializing settings form with business data', { businessId: business.id })
      
      setName(business.name)
      setOrderingInstructions(business.ordering_instructions || '')
      
      // Initialize hours
      if (business.hours) {
        try {
          const hoursData = typeof business.hours === 'string' 
            ? JSON.parse(business.hours) 
            : business.hours
          
          setHours(hoursData as BusinessHours)
        } catch (err) {
          logError('Error parsing business hours', { hours: business.hours })
          setHours({})
        }
      }
      
      // Initialize FAQs
      if (business.faqs) {
        try {
          const faqsData = typeof business.faqs === 'string'
            ? JSON.parse(business.faqs)
            : business.faqs
          
          setFaqs(Array.isArray(faqsData) ? faqsData : [])
        } catch (err) {
          logError('Error parsing FAQs', { faqs: business.faqs })
          setFaqs([])
        }
      }
    }
  }, [business])
  
  // Check URL hash for active tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'hours' || hash === 'faqs') {
        setActiveTab(hash)
      }
    }
  }, [])
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!business || !user) {
      setError('You must be logged in to update your business')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)
    
    debug('Submitting business update', { 
      businessId: business.id,
      fields: { name, hours, orderingInstructions, faqs }
    })
    
    try {
      await measureAsyncPerformance(
        async () => {
          const updatedBusiness = await updateBusiness({
            name,
            hours,
            ordering_instructions: orderingInstructions,
            faqs,
          })
          
          if (updatedBusiness) {
            info('Business updated successfully', { businessId: business.id })
            setSuccess(true)
            
            // Hide success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000)
          } else {
            throw new Error('Failed to update business')
          }
        },
        'settings.updateBusiness'
      )
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while updating your business'
      logError('Business update error', { businessId: business.id }, err)
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Add a new FAQ
  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }])
  }
  
  // Update a FAQ
  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = [...faqs]
    updatedFaqs[index][field] = value
    setFaqs(updatedFaqs)
  }
  
  // Remove a FAQ
  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index))
  }
  
  // Days of the week for business hours
  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ]
  
  // Update business hours
  const updateHours = (day: string, field: 'open' | 'close', value: string) => {
    setHours({
      ...hours,
      [day]: {
        ...(hours[day] || { open: '09:00', close: '17:00' }),
        [field]: value
      }
    })
  }
  
  // Show loading state while checking auth
  if (isLoading || !business) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Business Settings</h2>
        <p className="text-gray-600">
          Update your business information, hours, and FAQs.
        </p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            General Information
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'hours'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Business Hours
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'faqs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            FAQs
          </button>
        </nav>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <p className="text-red-800 text-center">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 p-4 rounded-md mb-6">
            <p className="text-green-800 text-center">
              Business information updated successfully!
            </p>
          </div>
        )}
        
        {/* General Information Tab */}
        <div className={activeTab === 'general' ? 'block' : 'hidden'}>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">General Information</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label htmlFor="orderingInstructions" className="block text-sm font-medium text-gray-700">
                  Ordering Instructions
                </label>
                <textarea
                  id="orderingInstructions"
                  name="orderingInstructions"
                  rows={4}
                  value={orderingInstructions}
                  onChange={(e) => setOrderingInstructions(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Instructions for customers placing orders"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Business Hours Tab */}
        <div className={activeTab === 'hours' ? 'block' : 'hidden'}>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
            
            <div className="space-y-4">
              {daysOfWeek.map((day) => (
                <div key={day} className="grid grid-cols-5 gap-4 items-center">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {day}
                    </label>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="time"
                      value={hours[day]?.open || '09:00'}
                      onChange={(e) => updateHours(day, 'open', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="time"
                      value={hours[day]?.close || '17:00'}
                      onChange={(e) => updateHours(day, 'close', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* FAQs Tab */}
        <div className={activeTab === 'faqs' ? 'block' : 'hidden'}>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
              <button
                type="button"
                onClick={addFaq}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                Add FAQ
              </button>
            </div>
            
            {faqs.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No FAQs added yet. Click "Add FAQ" to create one.
              </div>
            ) : (
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b pb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">FAQ #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                        disabled={isSubmitting}
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Question
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => updateFaq(index, 'question', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter question"
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Answer
                        </label>
                        <textarea
                          rows={3}
                          value={faq.answer}
                          onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter answer"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
