'use client';

import { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { formatToE164, isValidE164PhoneNumber } from '../../../../lib/business-utils';
import { Button } from '../../../../src/components/ui/button';
import { Input } from '../../../../src/components/ui/input';
import { Label } from '../../../../src/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '../../../../src/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

// Define the form schema using Zod
const formSchema = z.object({
  businessName: z.string().min(1, { message: "Business name is required" }),
  twilioNumber: z.string().regex(
    /^\+[1-9]\d{1,14}$/,
    { message: "Phone number must be in E.164 format (e.g., +18186519003)" }
  ),
  subscriptionTier: z.string().default('free')
});

type FormData = z.infer<typeof formSchema>;

export default function TrialActivationForm() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientSupabaseClient();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    twilioNumber: '',
    subscriptionTier: 'free'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fieldValidation, setFieldValidation] = useState<Record<string, boolean>>({});

  // Real-time field validation
  const validateField = (name: string, value: string) => {
    try {
      const fieldSchema = formSchema.pick({ [name]: true } as any);
      fieldSchema.parse({ [name]: value });
      setFieldValidation(prev => ({ ...prev, [name]: true }));
      return true;
    } catch {
      setFieldValidation(prev => ({ ...prev, [name]: false }));
      return false;
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone number formatting
    if (name === 'twilioNumber') {
      // Only attempt to format if the user isn't actively typing a plus sign
      // (to avoid interfering with manual E.164 formatting)
      if (value && !value.startsWith('+') && value !== '+') {
        const formattedNumber = formatToE164(value);
        if (formattedNumber) {
          setFormData(prev => ({ ...prev, [name]: formattedNumber }));
          validateField(name, formattedNumber);
        } else {
          setFormData(prev => ({ ...prev, [name]: value }));
          validateField(name, value);
        }
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      validateField(name, value);
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Scroll to first error
  const scrollToFirstError = () => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  };

  // Auto-scroll to errors when they appear
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      scrollToFirstError();
    }
  }, [errors]);

  // Parse API errors and map to form fields
  const parseApiErrors = (result: any) => {
    if (result.details && typeof result.details === 'object') {
      const fieldErrors: Record<string, string> = {};
      
      // Map common backend field names to frontend field names
      const fieldMapping: Record<string, string> = {
        'business_name': 'businessName',
        'businessName': 'businessName',
        'twilio_number': 'twilioNumber',
        'twilioNumber': 'twilioNumber',
        'phone_number': 'twilioNumber'
      };
      
      Object.entries(result.details).forEach(([key, value]) => {
        const frontendField = fieldMapping[key] || key;
        if (typeof value === 'string') {
          fieldErrors[frontendField] = value;
        }
      });
      
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        return true;
      }
    }
    return false;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setErrors({});
    
    try {
      // Check if user is authenticated
      if (!user) {
        throw new Error('You must be logged in to activate a trial');
      }
      
      // Validate form data
      const validationResult = formSchema.safeParse(formData);
      
      if (!validationResult.success) {
        // Format validation errors
        const formattedErrors: Record<string, string> = {};
        validationResult.error.errors.forEach(err => {
          if (err.path[0]) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });
        
        setErrors(formattedErrors);
        setIsSubmitting(false);
        return;
      }
      
      // Get auth token for backup authentication
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;
      
      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add auth token as backup (cookies should handle auth, but this is extra security)
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      // Sanitize and prepare form data
      const sanitizedData = {
        businessName: formData.businessName.trim(),
        twilioNumber: formData.twilioNumber.trim(),
        subscriptionTier: formData.subscriptionTier || 'free'
      };
      
      // Submit data to API
      const response = await fetch('/api/create-business-trial', {
        method: 'POST',
        headers,
        body: JSON.stringify(sanitizedData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        // Try to parse field-specific errors first
        if (!parseApiErrors(result)) {
          // If no field errors, show general error
          const errorMessage = result.message || result.error || 'Failed to activate trial';
          
          // Handle specific error types
          if (response.status === 401) {
            throw new Error('Authentication failed. Please try logging out and back in.');
          } else if (response.status === 409) {
            throw new Error('You already have a business account. Please contact support if you need assistance.');
          } else if (response.status >= 500) {
            throw new Error('Server error. Please try again in a few moments.');
          } else {
            throw new Error(errorMessage);
          }
        }
        setIsSubmitting(false);
        return;
      }
      
      // Handle success
      setSubmitSuccess(true);
      
      // Redirect to success page with trial parameters
      setTimeout(() => {
        router.push('/success?trial=true&plan=Pro');
      }, 1500);
      
    } catch (error) {
      console.error('Error activating trial:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Activate Your 14-Day Free Trial</h2>
      
      {/* Authentication check */}
      {!user && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Authentication Required</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Please make sure you're logged in to activate your trial.
          </AlertDescription>
        </Alert>
      )}
      
      {submitSuccess ? (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your trial has been activated. Redirecting to success page...
          </AlertDescription>
        </Alert>
      ) : submitError ? (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">{submitError}</AlertDescription>
        </Alert>
      ) : null}
      
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className={
              errors.businessName 
                ? "border-red-500" 
                : fieldValidation.businessName 
                ? "border-green-500" 
                : ""
            }
            disabled={isSubmitting || submitSuccess}
            placeholder="Enter your business name"
          />
          {errors.businessName && (
            <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
          )}
        </div>
        
        <div className="mb-6">
          <Label htmlFor="twilioNumber">Phone Number</Label>
          <Input
            id="twilioNumber"
            name="twilioNumber"
            value={formData.twilioNumber}
            onChange={handleChange}
            placeholder="+18186519003"
            className={
              errors.twilioNumber 
                ? "border-red-500" 
                : isValidE164PhoneNumber(formData.twilioNumber) 
                ? "border-green-500" 
                : ""
            }
            disabled={isSubmitting || submitSuccess}
          />
          {errors.twilioNumber ? (
            <p className="text-red-500 text-sm mt-1">{errors.twilioNumber}</p>
          ) : (
            <p className="text-gray-500 text-xs mt-1">
              Enter your phone number. US numbers will be automatically formatted (e.g., 8186519003 → +18186519003)
            </p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting || submitSuccess || !user}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Activating Trial...
            </>
          ) : (
            "Activate Free Trial"
          )}
        </Button>
      </form>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        By activating your trial, you agree to our{' '}
        <a href="/terms" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>.
      </p>
    </div>
  );
}
