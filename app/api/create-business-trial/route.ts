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
    // Parse the request body
    const body = await request.json();
    
    // Get the authenticated user
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required', message: 'User must be logged in' },
        { status: 401 }
      );
    }
    
    // Format phone number if possible
    let twilioNumber = body.twilioNumber;
    if (twilioNumber && !twilioNumber.startsWith('+')) {
      const formattedNumber = formatToE164(twilioNumber);
      if (formattedNumber) {
        twilioNumber = formattedNumber;
      }
    }
    
    // Create the business with trial using our utility function
    const result = await createBusinessWithTrial({
      userId: user.id,
      businessName: body.businessName,
      twilioNumber: twilioNumber,
      subscriptionTier: body.subscriptionTier || 'free'
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error, message: result.message, details: result.details },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in create-business-trial API route:', error);
    logError('create-business-trial-api', {}, error instanceof Error ? error : new Error(String(error)));
    
    return NextResponse.json(
      { error: 'Server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
