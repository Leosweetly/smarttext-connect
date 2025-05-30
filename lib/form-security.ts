/**
 * Form security utilities including CSRF protection and enhanced validation
 */

import { debug, info, warning, error as logError } from '@/lib/debug';
import { logSecurityEvent } from '@/lib/trial-security';

// Environment-aware configuration
const isSecurityLoggingEnabled = () => {
  return process.env.ENABLE_SECURITY_LOGS === 'true' || process.env.NODE_ENV === 'development';
};

/**
 * CSRF Token management
 */
export class CSRFTokenManager {
  private static readonly TOKEN_LENGTH = 32;
  private static readonly TOKEN_LIFETIME = 30 * 60 * 1000; // 30 minutes
  
  /**
   * Generate a CSRF token
   */
  static generateToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < this.TOKEN_LENGTH; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  /**
   * Store CSRF token with timestamp
   */
  static storeToken(token: string): void {
    if (typeof window !== 'undefined') {
      const tokenData = {
        token,
        timestamp: Date.now()
      };
      sessionStorage.setItem('csrf_token', JSON.stringify(tokenData));
      logSecurityEvent('csrf_token_generated', { tokenId: token.slice(0, 8) + '***' });
    }
  }
  
  /**
   * Retrieve and validate CSRF token
   */
  static getValidToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const tokenDataStr = sessionStorage.getItem('csrf_token');
      if (!tokenDataStr) return null;
      
      const tokenData = JSON.parse(tokenDataStr);
      const now = Date.now();
      
      // Check if token is expired
      if (now - tokenData.timestamp > this.TOKEN_LIFETIME) {
        sessionStorage.removeItem('csrf_token');
        logSecurityEvent('csrf_token_expired', { age: now - tokenData.timestamp }, 'warning');
        return null;
      }
      
      return tokenData.token;
    } catch (error) {
      logSecurityEvent('csrf_token_retrieval_error', { error }, 'error');
      return null;
    }
  }
  
  /**
   * Validate submitted CSRF token
   */
  static validateToken(submittedToken: string): boolean {
    const storedToken = this.getValidToken();
    
    if (!storedToken || !submittedToken) {
      logSecurityEvent('csrf_validation_failed', { 
        reason: !storedToken ? 'no_stored_token' : 'no_submitted_token' 
      }, 'warning');
      return false;
    }
    
    const isValid = storedToken === submittedToken;
    
    if (!isValid) {
      logSecurityEvent('csrf_validation_failed', { 
        reason: 'token_mismatch',
        submittedId: submittedToken.slice(0, 8) + '***',
        storedId: storedToken.slice(0, 8) + '***'
      }, 'warning');
    } else {
      logSecurityEvent('csrf_validation_success', { 
        tokenId: submittedToken.slice(0, 8) + '***'
      });
    }
    
    return isValid;
  }
  
  /**
   * Generate and store a new CSRF token
   */
  static createAndStoreToken(): string {
    const token = this.generateToken();
    this.storeToken(token);
    return token;
  }
}

/**
 * Input sanitization utilities
 */
export class InputSanitizer {
  
  /**
   * Sanitize business name input
   */
  static sanitizeBusinessName(input: string): { sanitized: string; issues: string[] } {
    const issues: string[] = [];
    let sanitized = input;
    
    // Remove HTML tags
    const htmlTagPattern = /<[^>]*>/g;
    if (htmlTagPattern.test(sanitized)) {
      issues.push('HTML tags removed');
      sanitized = sanitized.replace(htmlTagPattern, '');
    }
    
    // Remove script-like content
    const scriptPatterns = [
      /javascript:/gi,
      /on\w+\s*=/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi
    ];
    
    scriptPatterns.forEach(pattern => {
      if (pattern.test(sanitized)) {
        issues.push('Script-like content removed');
        sanitized = sanitized.replace(pattern, '');
      }
    });
    
    // Remove dangerous characters
    const dangerousChars = /[<>'"&]/g;
    if (dangerousChars.test(sanitized)) {
      issues.push('Dangerous characters removed');
      sanitized = sanitized.replace(dangerousChars, '');
    }
    
    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim();
    
    // Length check
    if (sanitized.length > 100) {
      issues.push('Input truncated to 100 characters');
      sanitized = sanitized.slice(0, 100);
    }
    
    if (issues.length > 0) {
      logSecurityEvent('input_sanitization_performed', { 
        inputType: 'business_name',
        issues,
        originalLength: input.length,
        sanitizedLength: sanitized.length
      }, 'warning');
    }
    
    return { sanitized, issues };
  }
  
  /**
   * Sanitize phone number input
   */
  static sanitizePhoneNumber(input: string): { sanitized: string; issues: string[] } {
    const issues: string[] = [];
    let sanitized = input;
    
    // Remove any non-digit and non-plus characters
    const originalLength = sanitized.length;
    sanitized = sanitized.replace(/[^\d+]/g, '');
    
    if (sanitized.length !== originalLength) {
      issues.push('Non-digit characters removed');
    }
    
    // Ensure only one + at the beginning
    const plusCount = (sanitized.match(/\+/g) || []).length;
    if (plusCount > 1) {
      issues.push('Multiple + signs normalized');
      sanitized = '+' + sanitized.replace(/\+/g, '');
    } else if (plusCount === 1 && !sanitized.startsWith('+')) {
      issues.push('Plus sign moved to beginning');
      sanitized = '+' + sanitized.replace(/\+/g, '');
    }
    
    // Length validation
    if (sanitized.length > 16) { // Max E.164 length
      issues.push('Phone number truncated');
      sanitized = sanitized.slice(0, 16);
    }
    
    if (issues.length > 0) {
      logSecurityEvent('input_sanitization_performed', { 
        inputType: 'phone_number',
        issues,
        originalLength: input.length,
        sanitizedLength: sanitized.length
      }, 'warning');
    }
    
    return { sanitized, issues };
  }
}

/**
 * Form submission rate limiting
 */
export class FormRateLimiter {
  private static readonly MAX_SUBMISSIONS = 5;
  private static readonly TIME_WINDOW = 15 * 60 * 1000; // 15 minutes
  
  /**
   * Check if form submission is rate limited
   */
  static checkRateLimit(formId: string, userId?: string): { allowed: boolean; remaining: number; resetTime?: number } {
    if (typeof window === 'undefined') return { allowed: true, remaining: this.MAX_SUBMISSIONS };
    
    const key = `form_rate_limit_${formId}_${userId || 'anonymous'}`;
    const now = Date.now();
    
    try {
      const dataStr = localStorage.getItem(key);
      let submissions: number[] = [];
      
      if (dataStr) {
        submissions = JSON.parse(dataStr);
      }
      
      // Remove old submissions outside the time window
      submissions = submissions.filter(timestamp => now - timestamp < this.TIME_WINDOW);
      
      const remaining = this.MAX_SUBMISSIONS - submissions.length;
      const allowed = remaining > 0;
      
      if (!allowed) {
        const oldestSubmission = Math.min(...submissions);
        const resetTime = oldestSubmission + this.TIME_WINDOW;
        
        logSecurityEvent('form_rate_limit_exceeded', { 
          formId,
          userId,
          submissions: submissions.length,
          resetTime: new Date(resetTime).toISOString()
        }, 'warning');
        
        return { allowed: false, remaining: 0, resetTime };
      }
      
      // Record this submission
      submissions.push(now);
      localStorage.setItem(key, JSON.stringify(submissions));
      
      logSecurityEvent('form_submission_tracked', { 
        formId,
        userId,
        submissions: submissions.length,
        remaining: remaining - 1
      });
      
      return { allowed: true, remaining: remaining - 1 };
      
    } catch (error) {
      logSecurityEvent('form_rate_limit_error', { 
        formId,
        userId,
        error: error instanceof Error ? error.message : String(error)
      }, 'error');
      
      // On error, allow submission but log the issue
      return { allowed: true, remaining: this.MAX_SUBMISSIONS };
    }
  }
  
  /**
   * Reset rate limit for a specific form/user combination
   */
  static resetRateLimit(formId: string, userId?: string): void {
    if (typeof window === 'undefined') return;
    
    const key = `form_rate_limit_${formId}_${userId || 'anonymous'}`;
    localStorage.removeItem(key);
    
    logSecurityEvent('form_rate_limit_reset', { formId, userId });
  }
}

/**
 * Bot detection utilities
 */
export class BotDetector {
  
  /**
   * Detect suspicious form submission patterns
   */
  static detectSuspiciousSubmission(data: {
    submissionTime: number;
    formLoadTime?: number;
    mouseMovements?: number;
    keyboardEvents?: number;
    fieldFocusEvents?: number;
  }): { suspicious: boolean; reasons: string[] } {
    const reasons: string[] = [];
    
    // Check if form was submitted too quickly (likely automated)
    if (data.formLoadTime && data.submissionTime) {
      const timeDiff = data.submissionTime - data.formLoadTime;
      if (timeDiff < 3000) { // Less than 3 seconds
        reasons.push('Form submitted too quickly');
      }
    }
    
    // Check for lack of human interaction
    if (data.mouseMovements !== undefined && data.mouseMovements < 3) {
      reasons.push('Insufficient mouse interaction');
    }
    
    if (data.keyboardEvents !== undefined && data.keyboardEvents < 5) {
      reasons.push('Insufficient keyboard interaction');
    }
    
    if (data.fieldFocusEvents !== undefined && data.fieldFocusEvents < 2) {
      reasons.push('Insufficient field interaction');
    }
    
    const suspicious = reasons.length >= 2; // Require multiple indicators
    
    if (suspicious) {
      logSecurityEvent('suspicious_form_submission', { 
        reasons,
        timeDiff: data.formLoadTime ? data.submissionTime - data.formLoadTime : undefined,
        ...data
      }, 'warning');
    }
    
    return { suspicious, reasons };
  }
  
  /**
   * Track human interaction events
   */
  static createInteractionTracker() {
    if (typeof window === 'undefined') return null;
    
    const tracker = {
      formLoadTime: Date.now(),
      mouseMovements: 0,
      keyboardEvents: 0,
      fieldFocusEvents: 0,
      
      trackMouseMovement: () => {
        tracker.mouseMovements++;
      },
      
      trackKeyboardEvent: () => {
        tracker.keyboardEvents++;
      },
      
      trackFieldFocus: () => {
        tracker.fieldFocusEvents++;
      },
      
      getSubmissionData: () => ({
        submissionTime: Date.now(),
        formLoadTime: tracker.formLoadTime,
        mouseMovements: tracker.mouseMovements,
        keyboardEvents: tracker.keyboardEvents,
        fieldFocusEvents: tracker.fieldFocusEvents
      })
    };
    
    // Attach event listeners
    document.addEventListener('mousemove', tracker.trackMouseMovement);
    document.addEventListener('keydown', tracker.trackKeyboardEvent);
    document.addEventListener('focusin', tracker.trackFieldFocus);
    
    return tracker;
  }
}

/**
 * Enhanced form validation with security checks
 */
export class SecureFormValidator {
  
  /**
   * Validate trial activation form data
   */
  static validateTrialForm(data: {
    businessName: string;
    twilioNumber: string;
    subscriptionTier: string;
    csrfToken?: string;
  }): { valid: boolean; errors: Record<string, string[]>; sanitized?: any } {
    const errors: Record<string, string[]> = {};
    
    // CSRF validation
    if (data.csrfToken) {
      if (!CSRFTokenManager.validateToken(data.csrfToken)) {
        errors.csrf = ['Invalid security token. Please refresh and try again.'];
      }
    } else {
      errors.csrf = ['Security token missing. Please refresh and try again.'];
    }
    
    // Business name validation and sanitization
    if (!data.businessName || data.businessName.trim().length === 0) {
      errors.businessName = ['Business name is required'];
    } else {
      const { sanitized: sanitizedName, issues } = InputSanitizer.sanitizeBusinessName(data.businessName);
      if (issues.length > 0) {
        errors.businessName = issues;
      }
      if (sanitizedName.length < 2) {
        errors.businessName = errors.businessName || [];
        errors.businessName.push('Business name must be at least 2 characters');
      }
    }
    
    // Phone number validation and sanitization
    if (!data.twilioNumber || data.twilioNumber.trim().length === 0) {
      errors.twilioNumber = ['Phone number is required'];
    } else {
      const { sanitized: sanitizedPhone, issues } = InputSanitizer.sanitizePhoneNumber(data.twilioNumber);
      if (issues.length > 0) {
        errors.twilioNumber = issues;
      }
      if (!/^\+[1-9]\d{1,14}$/.test(sanitizedPhone)) {
        errors.twilioNumber = errors.twilioNumber || [];
        errors.twilioNumber.push('Phone number must be in valid international format');
      }
    }
    
    // Subscription tier validation
    const allowedTiers = ['free', 'basic', 'pro', 'enterprise'];
    if (!allowedTiers.includes(data.subscriptionTier?.toLowerCase())) {
      errors.subscriptionTier = ['Invalid subscription tier'];
    }
    
    const isValid = Object.keys(errors).length === 0;
    
    let sanitized;
    if (isValid) {
      const { sanitized: sanitizedName } = InputSanitizer.sanitizeBusinessName(data.businessName);
      const { sanitized: sanitizedPhone } = InputSanitizer.sanitizePhoneNumber(data.twilioNumber);
      
      sanitized = {
        businessName: sanitizedName,
        twilioNumber: sanitizedPhone,
        subscriptionTier: data.subscriptionTier.toLowerCase()
      };
    }
    
    if (!isValid) {
      logSecurityEvent('form_validation_failed', { 
        errorFields: Object.keys(errors),
        errorCount: Object.values(errors).flat().length
      }, 'warning');
    }
    
    return { valid: isValid, errors, sanitized };
  }
}
