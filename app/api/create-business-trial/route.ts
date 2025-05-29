import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/database.types';
import { error as logError } from '@/lib/debug';
import { createBusinessWithTrial, formatToE164 } from '@/lib/business-utils';

/**
 * API route handler for creating a business with trial
 */
export async function POST(request: Request) {
  try {
    console.log("=== CREATE BUSINESS TRIAL DEBUG START ===");
    
    // Parse the request body
    const body = await request.json();
    console.log("[DEBUG] 1. Raw request body:", JSON.stringify(body, null, 2));
    
    // Get the authenticated user
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log("[DEBUG] Authentication failed:", userError);
      return NextResponse.json(
        { error: 'Authentication required', message: 'User must be logged in' },
        { status: 401 }
      );
    }
    
    console.log("[DEBUG] 2. User ID:", user.id);
    console.log("[DEBUG] 3. User email:", user.email);
    
    // Format phone number if possible
    let twilioNumber = body.twilioNumber;
    console.log("[DEBUG] 4. Original phone number:", twilioNumber);
    
    if (twilioNumber && !twilioNumber.startsWith('+')) {
      const formattedNumber = formatToE164(twilioNumber);
      if (formattedNumber) {
        twilioNumber = formattedNumber;
      }
    }
    
    console.log("[DEBUG] 5. Formatted phone number:", twilioNumber);
    
    // Prepare the data that will be sent to createBusinessWithTrial
    const businessData = {
      userId: user.id,
      businessName: body.businessName,
      twilioNumber: twilioNumber,
      subscriptionTier: body.subscriptionTier || 'free'
    };
    
    console.log("[DEBUG] 6. Data being sent to createBusinessWithTrial:", JSON.stringify(businessData, null, 2));
    
    // Create the business with trial using our utility function
    const result = await createBusinessWithTrial(businessData);
    
    console.log("[DEBUG] 7. Result from createBusinessWithTrial:", JSON.stringify(result, null, 2));
    
    if (!result.success) {
      console.log("[DEBUG] Business creation failed:", result.error);
      console.log("[DEBUG] Error details:", result.details);
      return NextResponse.json(
        { error: result.error, message: result.message, details: result.details },
        { status: 400 }
      );
    }
    
    console.log("[DEBUG] 8. Business created successfully!");
    console.log("=== CREATE BUSINESS TRIAL DEBUG END ===");
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("=== CREATE BUSINESS TRIAL ERROR ===");
    console.error('Error in create-business-trial API route:', error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    logError('create-business-trial-api', {}, error instanceof Error ? error : new Error(String(error)));
    
    return NextResponse.json(
      { error: 'Server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
