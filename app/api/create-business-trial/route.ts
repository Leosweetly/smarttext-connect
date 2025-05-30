import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/database.types';
import { error as logError, debug, info, warning } from '@/lib/debug';
import { createBusinessWithTrial, formatToE164 } from '@/lib/business-utils';
import { 
  checkTrialEligibility, 
  validateBusinessSecurityData,
  monitorTrialCreationPatterns,
  logSecurityEvent 
} from '@/lib/trial-security';
import { 
  SecureFormValidator,
  FormRateLimiter 
} from '@/lib/form-security';

/**
 * API route handler for creating a business with trial
 * Enhanced with comprehensive security checks
 */
export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    logSecurityEvent('trial_creation_attempt_started', {
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent')?.slice(0, 100)
    });
    
    console.log("=== CREATE BUSINESS TRIAL SECURITY DEBUG START ===");
    
    // Get request metadata for security monitoring
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || '';
    const xForwardedFor = headersList.get('x-forwarded-for');
    const clientIP = xForwardedFor ? xForwardedFor.split(',')[0] : 'unknown';
    
    console.log("[SECURITY] User-Agent:", userAgent.slice(0, 100));
    console.log("[SECURITY] Client IP:", clientIP.slice(0, 15) + '***');
    
    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      logSecurityEvent('invalid_request_body', { error: 'JSON parse failed' }, 'warning');
      return NextResponse.json(
        { error: 'Invalid request format', message: 'Request body must be valid JSON' },
        { status: 400 }
      );
    }
    
    console.log("[DEBUG] 1. Raw request body:", JSON.stringify(body, null, 2));
    
    // Enhanced form validation with security checks
    const formValidation = SecureFormValidator.validateTrialForm({
      businessName: body.businessName || '',
      twilioNumber: body.twilioNumber || '',
      subscriptionTier: body.subscriptionTier || 'free',
      csrfToken: body.csrfToken
    });
    
    if (!formValidation.valid) {
      logSecurityEvent('form_validation_failed', {
        errors: formValidation.errors,
        fieldCount: Object.keys(formValidation.errors).length
      }, 'warning');
      
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          message: 'Please check your input and try again',
          details: formValidation.errors 
        },
        { status: 400 }
      );
    }
    
    // Get the authenticated user
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      logSecurityEvent('authentication_failed', { error: userError?.message }, 'warning');
      console.log("[DEBUG] Authentication failed:", userError);
      return NextResponse.json(
        { error: 'Authentication required', message: 'User must be logged in' },
        { status: 401 }
      );
    }
    
    console.log("[DEBUG] 2. User ID:", user.id);
    console.log("[DEBUG] 3. User email:", user.email);
    
    // Check form submission rate limiting
    const rateLimitCheck = FormRateLimiter.checkRateLimit('trial-activation', user.id);
    if (!rateLimitCheck.allowed) {
      logSecurityEvent('rate_limit_exceeded', {
        userId: user.id,
        resetTime: rateLimitCheck.resetTime
      }, 'warning');
      
      return NextResponse.json(
        { 
          error: 'Too many attempts', 
          message: 'Please wait before submitting again',
          details: { resetTime: rateLimitCheck.resetTime }
        },
        { status: 429 }
      );
    }
    
    // Monitor for suspicious patterns
    const patternCheck = await monitorTrialCreationPatterns(user.id, userAgent, clientIP);
    if (patternCheck.suspicious) {
      logSecurityEvent('suspicious_activity_detected', {
        userId: user.id,
        reason: patternCheck.reason,
        userAgent: userAgent.slice(0, 50)
      }, 'warning');
      
      // Don't block immediately, but log for monitoring
      warning('[SECURITY] Suspicious trial creation pattern detected', {
        userId: user.id,
        reason: patternCheck.reason
      });
    }
    
    // Format phone number with security validation
    let twilioNumber = formValidation.sanitized.twilioNumber;
    console.log("[DEBUG] 4. Sanitized phone number:", twilioNumber);
    
    // Additional business data security validation
    const securityValidation = validateBusinessSecurityData({
      businessName: formValidation.sanitized.businessName,
      twilioNumber: twilioNumber,
      subscriptionTier: formValidation.sanitized.subscriptionTier
    });
    
    if (!securityValidation.valid) {
      logSecurityEvent('security_validation_failed', {
        issues: securityValidation.issues,
        userId: user.id
      }, 'warning');
      
      return NextResponse.json(
        { 
          error: 'Security validation failed', 
          message: 'Input contains security issues',
          details: { issues: securityValidation.issues }
        },
        { status: 400 }
      );
    }
    
    // Check trial eligibility (duplicate prevention)
    const eligibilityCheck = await checkTrialEligibility(
      user.id, 
      twilioNumber, 
      user.email || undefined,
      true // isServerSide
    );
    
    if (!eligibilityCheck.eligible) {
      logSecurityEvent('trial_eligibility_denied', {
        userId: user.id,
        reason: eligibilityCheck.reason,
        phoneNumber: twilioNumber.slice(0, 4) + '****'
      }, 'warning');
      
      return NextResponse.json(
        { 
          error: 'Trial not eligible', 
          message: eligibilityCheck.reason,
          details: eligibilityCheck.details,
          recommendations: eligibilityCheck.recommendations
        },
        { status: 409 }
      );
    }
    
    // Prepare the data that will be sent to createBusinessWithTrial
    const businessData = {
      userId: user.id,
      businessName: securityValidation.sanitized.businessName,
      twilioNumber: securityValidation.sanitized.twilioNumber,
      subscriptionTier: securityValidation.sanitized.subscriptionTier
    };
    
    console.log("[DEBUG] 5. Security-validated data:", JSON.stringify(businessData, null, 2));
    
    // Create the business with trial using our utility function
    const result = await createBusinessWithTrial(businessData);
    
    console.log("[DEBUG] 6. Result from createBusinessWithTrial:", JSON.stringify(result, null, 2));
    
    if (!result.success) {
      logSecurityEvent('business_creation_failed', {
        userId: user.id,
        error: result.error,
        details: result.details
      }, 'error');
      
      console.log("[DEBUG] Business creation failed:", result.error);
      console.log("[DEBUG] Error details:", result.details);
      return NextResponse.json(
        { error: result.error, message: result.message, details: result.details },
        { status: 400 }
      );
    }
    
    // Log successful trial creation
    const processingTime = Date.now() - startTime;
    logSecurityEvent('trial_creation_successful', {
      userId: user.id,
      businessId: result.data?.id,
      processingTime,
      clientIP: clientIP.slice(0, 15) + '***'
    });
    
    info('[TRIAL] Business trial created successfully', {
      userId: user.id,
      businessId: result.data?.id,
      processingTime
    });
    
    console.log("[DEBUG] 7. Business created successfully!");
    console.log("=== CREATE BUSINESS TRIAL SECURITY DEBUG END ===");
    
    // Add security headers to response
    const response = NextResponse.json(result, { status: 201 });
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    return response;
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    logSecurityEvent('trial_creation_error', {
      error: error instanceof Error ? error.message : String(error),
      processingTime,
      stack: error instanceof Error ? error.stack : undefined
    }, 'error');
    
    console.error("=== CREATE BUSINESS TRIAL ERROR ===");
    console.error('Error in create-business-trial API route:', error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    logError('create-business-trial-api', { processingTime }, error instanceof Error ? error : new Error(String(error)));
    
    return NextResponse.json(
      { error: 'Server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
