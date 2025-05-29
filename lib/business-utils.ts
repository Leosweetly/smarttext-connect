import { z } from 'zod';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { error as logError } from '@/lib/debug';

/**
 * Zod schema for validating business trial data
 */
export const BusinessTrialSchema = z.object({
  user_id: z.string().uuid({
    message: "User ID must be a valid UUID"
  }),
  trial_plan: z.boolean().default(true),
  trial_expiration_date: z.string().regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
    { message: "Trial expiration date must be in ISO 8601 format" }
  ),
  subscription_tier: z.string(),
  twilio_number: z.string().regex(
    /^\+[1-9]\d{1,14}$/,
    { message: "Twilio number must be in E.164 format (e.g., +18186519003)" }
  ),
  name: z.string().min(1, { message: "Business name is required" })
});

// Type for the business data
export type BusinessTrialData = z.infer<typeof BusinessTrialSchema>;

/**
 * Creates a new business record with trial information in Supabase
 * 
 * @param userData User data containing ID and business information
 * @param trialDays Number of days for the trial period (default: 14)
 * @returns The created business record or error information
 */
export async function createBusinessWithTrial(
  userData: {
    userId: string;
    businessName: string;
    twilioNumber: string;
    subscriptionTier: string;
  },
  trialDays: number = 14
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  details?: any;
  message: string;
}> {
  try {
    // Calculate trial expiration date (14 days from now by default)
    const trialExpirationDate = new Date();
    trialExpirationDate.setDate(trialExpirationDate.getDate() + trialDays);
    
    // Create the business data object
    const businessData: BusinessTrialData = {
      user_id: userData.userId,
      name: userData.businessName,
      trial_plan: true,
      trial_expiration_date: trialExpirationDate.toISOString(),
      subscription_tier: userData.subscriptionTier,
      twilio_number: userData.twilioNumber
    };

    // Validate the business data using Zod
    const validationResult = BusinessTrialSchema.safeParse(businessData);
    
    if (!validationResult.success) {
      // Log validation errors
      console.error('Business data validation failed:', validationResult.error.format());
      return {
        success: false,
        error: 'Validation failed',
        details: validationResult.error.format(),
        message: validationResult.error.errors.map(e => e.message).join(', ')
      };
    }

    // Get the validated data
    const validatedData = validationResult.data;
    
    // Create a Supabase client
    const supabase = createClientSupabaseClient();
    
    // Prepare the final insert data
    const finalInsertData = {
      user_id: validatedData.user_id,
      name: validatedData.name,
      trial_plan: validatedData.trial_plan,
      trial_expiration_date: validatedData.trial_expiration_date,
      subscription_tier: validatedData.subscription_tier,
      twilio_number: validatedData.twilio_number
    };
    
    console.log("[DEBUG] Final data being inserted into Supabase:", JSON.stringify(finalInsertData, null, 2));
    
    // Insert the business record
    const { data, error } = await supabase
      .from('businesses')
      .insert(finalInsertData)
      .select()
      .single();
    
    // Handle database errors
    if (error) {
      console.error("=== SUPABASE INSERT ERROR ===");
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", JSON.stringify(error.details, null, 2));
      console.error("Error hint:", error.hint);
      console.error("Data attempted to insert:", JSON.stringify(finalInsertData, null, 2));
      console.error("Full error object:", JSON.stringify(error, null, 2));
      
      return {
        success: false,
        error: error.message,
        details: error,
        message: 'Failed to create business record'
      };
    }
    
    console.log("[DEBUG] Business record inserted successfully:", JSON.stringify(data, null, 2));
    
    // Return success with the created business data
    return {
      success: true,
      data,
      message: 'Business created successfully with trial plan'
    };
  } catch (error) {
    // Log any unexpected errors
    console.error('Unexpected error creating business:', error);
    logError('create-business-trial', {}, error instanceof Error ? error : new Error(String(error)));
    
    return {
      success: false,
      error: 'Unexpected error',
      details: error,
      message: 'An unexpected error occurred while creating the business'
    };
  }
}

/**
 * Validates a phone number to ensure it's in E.164 format
 * 
 * @param phoneNumber The phone number to validate
 * @returns True if the phone number is valid, false otherwise
 */
export function isValidE164PhoneNumber(phoneNumber: string): boolean {
  // E.164 format: +[country code][number]
  // Example: +18186519003
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phoneNumber);
}

/**
 * Formats a phone number to E.164 format if possible
 * 
 * @param phoneNumber The phone number to format
 * @returns The formatted phone number or null if it can't be formatted
 */
export function formatToE164(phoneNumber: string): string | null {
  // Remove all non-digit characters except the leading +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // If the number doesn't start with +, assume it's a US number and add +1
  if (!cleaned.startsWith('+')) {
    // If it's a 10-digit US number, add +1
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    // If it's already an 11-digit number starting with 1, add +
    else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    }
  }
  
  // If it already starts with + and has between 8 and 15 digits, it might be valid
  if (cleaned.startsWith('+') && cleaned.length >= 8 && cleaned.length <= 15) {
    return cleaned;
  }
  
  // Can't format to E.164
  return null;
}
