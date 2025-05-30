import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/onboarding',
]

// Define auth routes that should redirect to dashboard if already authenticated
const authRoutes = [
  '/login',
  '/signup',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Create a Supabase client for this API route
  const supabase = createServerSupabaseClient()
  
  // Get the user's session
  const { data: { session } } = await supabase.auth.getSession()
  
  // Check if the user is authenticated
  const isAuthenticated = !!session
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some(route => pathname === route)
  
  // If the route is protected and the user is not authenticated, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }
  
  // If the route is an auth route and the user is authenticated, redirect to dashboard
  if (isAuthRoute && isAuthenticated) {
    // Check if the user has a business
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', session.user.id)
      .single()
    
    // If the user has a business, redirect to dashboard
    // Otherwise, redirect to onboarding
    const redirectUrl = business ? '/dashboard' : '/onboarding'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }
  
  // Allow the request to continue
  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    // Protected routes
    '/dashboard/:path*',
    '/onboarding/:path*',
    // Auth routes
    '/login',
    '/signup',
    // Public routes that need auth checking
    '/pricing',
  ],
}
