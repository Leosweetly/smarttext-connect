'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { error as logError } from '@/lib/debug'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to the console
    logError('Application error', {}, error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong!</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
          >
            Go Back Home
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-md text-left overflow-auto max-w-2xl mx-auto">
            <p className="text-red-600 font-semibold">Error details:</p>
            <p className="text-gray-800 mt-2 font-mono text-sm break-all">
              {error.message}
            </p>
            {error.stack && (
              <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                {error.stack}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
