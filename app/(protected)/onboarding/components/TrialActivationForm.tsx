'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { formatToE164, isValidE164PhoneNumber } from '../../../../lib/business-utils';
import { Button } from '../../../../src/components/ui/button';
import { Input } from '../../../../src/components/ui/input';
import { Label } from '../../../../src/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '../../../../src/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

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
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    twilioNumber: '',
    subscriptionTier: 'free'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
        } else {
          setFormData(prev => ({ ...prev, [name]: value }));
        }
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
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
      
      // Submit data to API
      const response = await fetch('/api/create-business-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to activate trial');
      }
      
      // Handle success
      setSubmitSuccess(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error activating trial:', error);
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Activate Your 14-Day Free Trial</h2>
      
      {submitSuccess ? (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your trial has been activated. Redirecting to dashboard...
          </AlertDescription>
        </Alert>
      ) : submitError ? (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">{submitError}</AlertDescription>
        </Alert>
      ) : null}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className={errors.businessName ? "border-red-500" : ""}
            disabled={isSubmitting || submitSuccess}
          />
          {errors.businessName && (
            <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
          )}
        </div>
        
        <div className="mb-4">
          <Label htmlFor="twilioNumber">Phone Number</Label>
          <Input
            id="twilioNumber"
            name="twilioNumber"
            value={formData.twilioNumber}
            onChange={handleChange}
            placeholder="+18186519003"
            className={errors.twilioNumber ? "border-red-500" : isValidE164PhoneNumber(formData.twilioNumber) ? "border-green-500" : ""}
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
          disabled={isSubmitting || submitSuccess}
        >
          {isSubmitting ? "Activating..." : "Activate Free Trial"}
        </Button>
      </form>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        By activating your trial, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
