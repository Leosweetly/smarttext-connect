'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { debug } from '@/lib/debug'
import { LogOut, Settings, Home, Menu, X, MessageSquare, PhoneMissed } from 'lucide-react'
import { useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, business, isLoading, signOut } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Redirect if not authenticated or no business
    if (!isLoading && (!user || !business)) {
      debug('Unauthorized access to dashboard, redirecting', { 
        isAuthenticated: !!user,
        hasBusiness: !!business
      })
      router.push('/login')
    }
  }, [user, business, isLoading, router])

  const handleSignOut = async () => {
    debug('User initiated sign out')
    await signOut()
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (!user || !business) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-semibold text-gray-800">
            {business.name}
          </h1>
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-5 px-2">
          <Link 
            href="/dashboard" 
            className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            onClick={() => setSidebarOpen(false)}
          >
            <Home className="mr-3 h-6 w-6" />
            Dashboard
          </Link>
          
          <Link 
            href="/dashboard/conversations" 
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            onClick={() => setSidebarOpen(false)}
          >
            <MessageSquare className="mr-3 h-6 w-6" />
            Conversations
          </Link>
          
          <Link 
            href="/dashboard/missed-calls" 
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            onClick={() => setSidebarOpen(false)}
          >
            <PhoneMissed className="mr-3 h-6 w-6" />
            Missed Calls
          </Link>
          
          <Link 
            href="/dashboard/settings" 
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            onClick={() => setSidebarOpen(false)}
          >
            <Settings className="mr-3 h-6 w-6" />
            Settings
          </Link>
        </nav>
        
        <div className="absolute bottom-0 w-full border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 w-full"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                Dashboard
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center">
                <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </span>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
