/**
 * Trial-specific security utilities for preventing abuse and ensuring compliance
 */

import { createClientSupabaseClient } from '@/lib/supabase/client';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { debug, info, warning, error as logError } from '@/lib/debug';
import { Database } from '@/types/database.types';

// Environment-aware security logging
const isSecurityLoggingEnabled = () => {
  return process.env.ENABLE_SECURITY_LOGS === 'true' || process.env.NODE_ENV === 'development';
};

const logSecurityEvent = (event: string, data: any = {}, level: 'debug' | 'info' | 'warning' | 'error' = 'info') => {
  if (!isSecurityLoggingEnabled()) return;
  
  const securityData = {
    event,
    timestamp: new Date().toISOString(),
    ...data
  };
  
  switch (level) {
    case 'debug':
      debug(`[SECURITY] ${event}`, securityData);
      break;
    case 'info':
      info(`[SECURITY] ${event}`, securityData);
      break;
    case 'warning':
      warning(`[SECURITY] ${event}`, securityData);
      break;
    case 'error':
      logError(`[SECURITY] ${event}`, securityData);
      break;
  }
};

/**
 * Trial eligibility result interface
 */
export interface TrialEligibilityResult {
  eligible: boolean;
  reason?: string;
  details?: any;
  recommendations?: string[];
}

/**
 * Check if a user is eligible for a trial
 * Prevents duplicate trials and enforces business rules
 */
export async function checkTrialEligibility(
  userId: string, 
  phoneNumber: string, 
  email?: string,
  isServerSide: boolean = false
): Promise<TrialEligibilityResult> {
  logSecurityEvent('trial_eligibility_check', { userId, phoneNumber: phoneNumber.slice(0, 4) + '****' });
  
  try {
    // Create appropriate Supabase client
    const supabase = isServerSide 
      ? createRouteHandlerClient<Database>({ cookies })
      : createClientSupabaseClient();
    
    // Check 1: User already has an active trial
    const { data: existingUserTrials, error: userTrialError } = await supabase
      .from('businesses')
      .select('id, name, trial_plan, trial_expiration_date, created_at')
      .eq('user_id', userId)
      .eq('trial_plan', true);
    
    if (userTrialError) {
      logSecurityEvent('trial_eligibility_error', { error: userTrialError }, 'error');
      throw new Error('Failed to check existing user trials');
    }
    
    // Filter active trials (not expired)
    const now = new Date();
    const activeTrials = existingUserTrials?.filter(trial => {
      if (!trial.trial_expiration_date) return false;
      const expirationDate = new Date(trial.trial_expiration_date);
      return expirationDate > now;
    }) || [];
    
    if (activeTrials.length > 0) {
      logSecurityEvent('trial_eligibility_denied', { 
        reason: 'active_trial_exists',
        activeTrials: activeTrials.length,
        userId 
      }, 'warning');
      
      return {
        eligible: false,
        reason: 'You already have an active trial',
        details: { activeTrials: activeTrials.length },
        recommendations: ['Complete your current trial', 'Contact support for assistance']
      };
    }
    
    // Check 2: Phone number already used for trial
    const { data: existingPhoneTrials, error: phoneTrialError } = await supabase
      .from('businesses')
      .select('id, user_id, trial_plan, trial_expiration_date, created_at')
      .eq('twilio_number', phoneNumber)
      .eq('trial_plan', true);
    
    if (phoneTrialError) {
      logSecurityEvent('trial_eligibility_error', { error: phoneTrialError }, 'error');
      throw new Error('Failed to check phone number usage');
    }
    
    // Check for recent phone number usage (within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentPhoneTrials = existingPhoneTrials?.filter(trial => {
      const createdDate = new Date(trial.created_at);
      return createdDate > thirtyDaysAgo && trial.user_id !== userId;
    }) || [];
    
    if (recentPhoneTrials.length > 0) {
      logSecurityEvent('trial_eligibility_denied', { 
        reason: 'phone_recently_used',
        phoneNumber: phoneNumber.slice(0, 4) + '****',
        recentUsage: recentPhoneTrials.length 
      }, 'warning');
      
      return {
        eligible: false,
        reason: 'This phone number was recently used for a trial',
        details: { recentUsage: recentPhoneTrials.length },
        recommendations: ['Use a different phone number', 'Wait 30 days before trying again']
      };
    }
    
    // Check 3: User has too many expired trials (abuse prevention)
    const totalUserTrials = existingUserTrials?.length || 0;
    const maxTrialsPerUser = parseInt(process.env.MAX_TRIALS_PER_USER || '3');
    
    if (totalUserTrials >= maxTrialsPerUser) {
      logSecurityEvent('trial_eligibility_denied', { 
        reason: 'max_trials_exceeded',
        totalTrials: totalUserTrials,
        maxAllowed: maxTrialsPerUser,
        userId 
      }, 'warning');
      
      return {
        eligible: false,
        reason: `You have reached the maximum number of trials (${maxTrialsPerUser})`,
        details: { totalTrials: totalUserTrials, maxAllowed: maxTrialsPerUser },
        recommendations: ['Contact support for assistance', 'Consider upgrading to a paid plan']
      };
    }
    
    // Check 4: Rate limiting - prevent rapid trial creation
    const recentUserTrials = existingUserTrials?.filter(trial => {
      const createdDate = new Date(trial.created_at);
      return createdDate > thirtyDaysAgo;
    }) || [];
    
    if (recentUserTrials.length > 0) {
      logSecurityEvent('trial_eligibility_denied', { 
        reason: 'recent_trial_created',
        recentTrials: recentUserTrials.length,
        userId 
      }, 'warning');
      
      return {
        eligible: false,
        reason: 'You recently created a trial. Please wait before creating another.',
        details: { recentTrials: recentUserTrials.length },
        recommendations: ['Wait 30 days before creating a new trial', 'Contact support if needed']
      };
    }
    
    // All checks passed
    logSecurityEvent('trial_eligibility_approved', { userId, phoneNumber: phoneNumber.slice(0, 4) + '****' });
    
    return {
      eligible: true
    };
    
  } catch (error) {
    logSecurityEvent('trial_eligibility_error', { 
      error: error instanceof Error ? error.message : String(error),
      userId 
    }, 'error');
    
    // In case of error, default to not eligible for security
    return {
      eligible: false,
      reason: 'Unable to verify trial eligibility. Please try again later.',
      details: { error: 'system_error' },
      recommendations: ['Try again in a few minutes', 'Contact support if problem persists']
    };
  }
}

/**
 * Enforce one trial per user policy
 * Returns existing business if user already has one
 */
export async function enforceOneTrialPerUser(
  userId: string,
  isServerSide: boolean = false
): Promise<{ hasExisting: boolean; business?: any; error?: string }> {
  logSecurityEvent('one_trial_enforcement_check', { userId });
  
  try {
    const supabase = isServerSide 
      ? createRouteHandlerClient<Database>({ cookies })
      : createClientSupabaseClient();
    
    const { data: existingBusinesses, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      logSecurityEvent('one_trial_enforcement_error', { error }, 'error');
      return { hasExisting: false, error: 'Failed to check existing businesses' };
    }
    
    if (existingBusinesses && existingBusinesses.length > 0) {
      const activeBusiness = existingBusinesses[0];
      
      logSecurityEvent('existing_business_found', { 
        businessId: activeBusiness.id,
        isTrialPlan: activeBusiness.trial_plan,
        userId 
      }, 'warning');
      
      return { 
        hasExisting: true, 
        business: activeBusiness 
      };
    }
    
    return { hasExisting: false };
    
  } catch (error) {
    logSecurityEvent('one_trial_enforcement_error', { 
      error: error instanceof Error ? error.message : String(error),
      userId 
    }, 'error');
    
    return { 
      hasExisting: false, 
      error: 'System error checking business eligibility' 
    };
  }
}

/**
 * Validate business creation data for security issues
 */
export function validateBusinessSecurityData(data: {
  businessName: string;
  twilioNumber: string;
  subscriptionTier: string;
}): { valid: boolean; issues: string[]; sanitized?: any } {
  const issues: string[] = [];
  const sanitized = { ...data };
  
  // Business name security checks
  if (data.businessName) {
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /script/i,
      /<[^>]*>/,
      /javascript:/i,
      /on\w+=/i,
      /eval\(/i,
      /document\./i,
      /window\./i
    ];
    
    const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
      pattern.test(data.businessName)
    );
    
    if (hasSuspiciousContent) {
      issues.push('Business name contains suspicious content');
      logSecurityEvent('suspicious_business_name', { 
        businessName: data.businessName.slice(0, 20) + '...',
        patterns: 'detected' 
      }, 'warning');
    }
    
    // Length validation
    if (data.businessName.length > 100) {
      issues.push('Business name too long');
    }
    
    // Sanitize business name
    sanitized.businessName = data.businessName
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>]/g, '') // Remove angle brackets
      .trim();
  }
  
  // Phone number security validation
  if (data.twilioNumber) {
    // Check for non-phone number patterns
    if (!/^\+[1-9]\d{1,14}$/.test(data.twilioNumber)) {
      issues.push('Invalid phone number format');
    }
    
    // Check for suspicious phone patterns (premium numbers, etc.)
    const suspiciousPhonePrefixes = ['+1900', '+1976']; // Premium numbers
    if (suspiciousPhonePrefixes.some(prefix => data.twilioNumber.startsWith(prefix))) {
      issues.push('Phone number not allowed for trials');
      logSecurityEvent('suspicious_phone_number', { 
        phonePrefix: data.twilioNumber.slice(0, 5),
        reason: 'premium_number' 
      }, 'warning');
    }
  }
  
  // Subscription tier validation
  const allowedTiers = ['free', 'basic', 'pro', 'enterprise'];
  if (!allowedTiers.includes(data.subscriptionTier?.toLowerCase())) {
    issues.push('Invalid subscription tier');
    sanitized.subscriptionTier = 'free'; // Default to free for security
  }
  
  const isValid = issues.length === 0;
  
  if (!isValid) {
    logSecurityEvent('business_data_validation_failed', { 
      issues,
      dataKeys: Object.keys(data) 
    }, 'warning');
  }
  
  return {
    valid: isValid,
    issues,
    sanitized: isValid ? sanitized : undefined
  };
}

/**
 * Security monitoring for trial creation patterns
 */
export async function monitorTrialCreationPatterns(
  userId: string,
  userAgent?: string,
  ipAddress?: string
): Promise<{ suspicious: boolean; reason?: string }> {
  logSecurityEvent('trial_pattern_monitoring', { 
    userId,
    userAgent: userAgent?.slice(0, 50),
    ipAddress: ipAddress ? ipAddress.slice(0, 10) + '***' : undefined
  });
  
  // This could be expanded with more sophisticated monitoring
  // For now, basic checks
  
  if (userAgent) {
    // Check for bot user agents
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /automated/i
    ];
    
    if (botPatterns.some(pattern => pattern.test(userAgent))) {
      logSecurityEvent('suspicious_user_agent', { 
        userAgent: userAgent.slice(0, 50),
        userId 
      }, 'warning');
      
      return { 
        suspicious: true, 
        reason: 'Automated/bot user agent detected' 
      };
    }
  }
  
  return { suspicious: false };
}

export { logSecurityEvent };
