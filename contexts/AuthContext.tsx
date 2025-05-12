'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase/client'
import { debug, error as logError, info, measureAsyncPerformance } from '@/lib/debug'
import { Database } from '@/types/database.types'

type User = Database['auth']['Tables']['users']['Row']
type Business = Database['public']['Tables']['businesses']['Row']

interface AuthContextType {
  user: User | null
  business: Business | null
  isLoading: boolean
  signUp: (email: string) => Promise<void>
  signIn: (email: string) => Promise<void>
  signOut: () => Promise<void>
  createBusiness: (name: string) => Promise<Business | null>
  updateBusiness: (data: Partial<Business>) => Promise<Business | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true)
        
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          // Set the user
          setUser(session.user as unknown as User)
          
          // Get the user's business
          await fetchUserBusiness(session.user.id)
        } else {
          setUser(null)
          setBusiness(null)
        }
      } catch (err: any) {
        logError('Error initializing auth', {}, err)
      } finally {
        setIsLoading(false)
      }
    }
    
    initAuth()
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        debug('Auth state changed', { event })
        
        if (session) {
          setUser(session.user as unknown as User)
          await fetchUserBusiness(session.user.id)
        } else {
          setUser(null)
          setBusiness(null)
        }
      }
    )
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  // Fetch the user's business
  const fetchUserBusiness = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          logError('Error fetching business', { userId }, error)
        }
        setBusiness(null)
        return
      }
      
      setBusiness(data)
      debug('Fetched business', { businessId: data.id })
    } catch (err: any) {
      logError('Error fetching business', { userId }, err)
      setBusiness(null)
    }
  }
  
  // Sign up with email
  const signUp = async (email: string) => {
    try {
      debug('Signing up', { email })
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        throw error
      }
      
      info('Signup successful, OTP sent', { email })
      
      // Redirect to check email page
      router.push(`/check-email?email=${encodeURIComponent(email)}&action=signup`)
    } catch (err: any) {
      logError('Signup error', { email }, err)
      throw err
    }
  }
  
  // Sign in with email
  const signIn = async (email: string) => {
    try {
      debug('Signing in', { email })
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        throw error
      }
      
      info('Login successful, OTP sent', { email })
      
      // Redirect to check email page
      router.push(`/check-email?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      logError('Login error', { email }, err)
      throw err
    }
  }
  
  // Sign out
  const signOut = async () => {
    try {
      debug('Signing out')
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }
      
      info('Signout successful')
      
      // Redirect to login page
      router.push('/login')
    } catch (err: any) {
      logError('Signout error', {}, err)
      throw err
    }
  }
  
  // Create a business
  const createBusiness = async (name: string): Promise<Business | null> => {
    if (!user) {
      logError('Cannot create business: User not authenticated')
      return null
    }
    
    try {
      debug('Creating business', { name, userId: user.id })
      
      // Calculate trial expiration date (14 days from now)
      const trialExpirationDate = new Date()
      trialExpirationDate.setDate(trialExpirationDate.getDate() + 14)
      
      const businessData = {
        user_id: user.id,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        trial_plan: true,
        trial_expiration_date: trialExpirationDate.toISOString(),
      }
      
      const { data, error } = await supabase
        .from('businesses')
        .insert(businessData)
        .select()
        .single()
      
      if (error) {
        throw error
      }
      
      info('Business created successfully', { businessId: data.id })
      
      // Update the business state
      setBusiness(data)
      
      return data
    } catch (err: any) {
      logError('Error creating business', { name, userId: user.id }, err)
      throw err
    }
  }
  
  // Update a business
  const updateBusiness = async (data: Partial<Business>): Promise<Business | null> => {
    if (!user || !business) {
      logError('Cannot update business: User not authenticated or business not found')
      return null
    }
    
    try {
      debug('Updating business', { businessId: business.id, data })
      
      const updateData = {
        ...data,
        updated_at: new Date().toISOString(),
      }
      
      const { data: updatedBusiness, error } = await supabase
        .from('businesses')
        .update(updateData)
        .eq('id', business.id)
        .select()
        .single()
      
      if (error) {
        throw error
      }
      
      info('Business updated successfully', { businessId: updatedBusiness.id })
      
      // Update the business state
      setBusiness(updatedBusiness)
      
      return updatedBusiness
    } catch (err: any) {
      logError('Error updating business', { businessId: business.id }, err)
      throw err
    }
  }
  
  const value = {
    user,
    business,
    isLoading,
    signUp,
    signIn,
    signOut,
    createBusiness,
    updateBusiness,
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
