import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * This route handles the callback from Supabase Auth after a user clicks
 * the magic link in their email. It exchanges the auth code for a session
 * and redirects the user to the appropriate page based on their business status.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // If there's no code, redirect to login
  if (!code) {
    console.error('No code provided in auth callback')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Create a Supabase client for this API route
    const supabase = createServerSupabaseClient()
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error.message)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
      )
    }
    
    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession()
    
    // If there's no session, redirect to login
    if (!session) {
      console.error('No session after code exchange')
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Check if the user has a business
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', session.user.id)
      .single()
    
    // If there's an error (other than not found) or no business, redirect to onboarding
    if (businessError && businessError.code !== 'PGRST116') {
      console.error('Error checking business:', businessError.message)
    }
    
    // Redirect based on whether the user has a business
    if (business) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  } catch (err: any) {
    console.error('Unexpected error in auth callback:', err.message)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent('Authentication failed')}`, request.url)
    )
  }
}
