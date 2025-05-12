'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { debug } from '@/lib/debug'

export default function CheckEmail() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState<string>('')
  const [isSignUp, setIsSignUp] = useState(false)

  useEffect(() => {
    // Get email and action from URL parameters
    const emailParam = searchParams?.get('email')
    const actionParam = searchParams?.get('action')
    
    if (emailParam) {
      setEmail(emailParam)
      debug('Email found in URL parameters', { email: emailParam })
    }
    
    if (actionParam === 'signup') {
      setIsSignUp(true)
      debug('Action is signup')
    } else {
      debug('Action is login')
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Check Your Email</h1>
          <p className="mt-2 text-gray-600">
            We've sent you a magic link
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-md">
          <div className="flex flex-col items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-blue-500 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            
            <p className="text-blue-800 text-center font-medium">
              {email ? (
                <>We've sent a magic link to <span className="font-bold">{email}</span></>
              ) : (
                <>We've sent a magic link to your email</>
              )}
            </p>
            
            <p className="text-blue-700 text-center mt-2">
              Click the link in the email to {isSignUp ? 'complete your signup' : 'log in to your account'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 text-center text-sm">
            The email might take a minute to arrive. Please check your spam folder if you don't see it.
          </p>
          
          <div className="flex justify-center">
            <Link 
              href={isSignUp ? "/signup" : "/login"} 
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              {isSignUp ? "Try signing up again" : "Try logging in again"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
