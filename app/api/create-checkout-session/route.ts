import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(request: NextRequest) {
  try {
    console.log('=== CREATE CHECKOUT SESSION DEBUG START ===');
    
    // Parse the request body
    const body = await request.json();
    console.log('[DEBUG] 1. Raw request body:', JSON.stringify(body, null, 2));
    
    // Validate required environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('[DEBUG] Missing STRIPE_SECRET_KEY environment variable');
      return NextResponse.json(
        { error: 'Server configuration error', message: 'Stripe not configured' },
        { status: 500 }
      );
    }
    
    // Extract and validate request data
    const {
      priceId,
      customerId,
      customerEmail,
      trialDays = 14,
      successUrl,
      cancelUrl,
      metadata = {},
      userId,
      planId
    } = body;
    
    console.log('[DEBUG] 2. Extracted data:', {
      priceId,
      customerId,
      customerEmail,
      trialDays,
      successUrl,
      cancelUrl,
      metadata,
      userId,
      planId
    });
    
    // Validate required fields
    if (!customerEmail && !customerId) {
      return NextResponse.json(
        { error: 'Missing required field', message: 'Either customerEmail or customerId is required' },
        { status: 400 }
      );
    }
    
    if (!successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'successUrl and cancelUrl are required' },
        { status: 400 }
      );
    }
    
    // Use a default price ID if none provided (you can customize this)
    const finalPriceId = priceId || planId || 'price_1234567890'; // Replace with your actual price ID
    
    console.log('[DEBUG] 3. Using price ID:', finalPriceId);
    
    // Prepare checkout session parameters
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        ...metadata,
        source: 'smarttext-connect',
        userId: userId || 'unknown',
      },
    };
    
    // Add customer information
    if (customerId) {
      sessionParams.customer = customerId;
    } else if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }
    
    // Add trial period if specified
    if (trialDays && trialDays > 0) {
      sessionParams.subscription_data = {
        trial_period_days: trialDays,
      };
    }
    
    console.log('[DEBUG] 4. Session params:', JSON.stringify(sessionParams, null, 2));
    
    // Create the checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);
    
    console.log('[DEBUG] 5. Stripe session created:', {
      id: session.id,
      url: session.url,
      mode: session.mode,
      status: session.status
    });
    
    // Return the session URL
    if (!session.url) {
      console.error('[DEBUG] No URL returned from Stripe session');
      return NextResponse.json(
        { error: 'Stripe error', message: 'No checkout URL generated' },
        { status: 500 }
      );
    }
    
    console.log('[DEBUG] 6. Returning success response with URL:', session.url);
    console.log('=== CREATE CHECKOUT SESSION DEBUG END ===');
    
    return NextResponse.json({
      url: session.url,
      sessionId: session.id
    });
    
  } catch (error: any) {
    console.error('=== CREATE CHECKOUT SESSION ERROR ===');
    console.error('Error creating checkout session:', error);
    console.error('Error stack:', error.stack);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return NextResponse.json(
        { error: 'Card error', message: error.message },
        { status: 400 }
      );
    } else if (error.type === 'StripeRateLimitError') {
      return NextResponse.json(
        { error: 'Rate limit error', message: 'Too many requests' },
        { status: 429 }
      );
    } else if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: 'Invalid request', message: error.message },
        { status: 400 }
      );
    } else if (error.type === 'StripeAPIError') {
      return NextResponse.json(
        { error: 'Stripe API error', message: 'An error occurred with Stripe' },
        { status: 500 }
      );
    } else if (error.type === 'StripeConnectionError') {
      return NextResponse.json(
        { error: 'Connection error', message: 'Network error occurred' },
        { status: 500 }
      );
    } else if (error.type === 'StripeAuthenticationError') {
      return NextResponse.json(
        { error: 'Authentication error', message: 'Stripe authentication failed' },
        { status: 500 }
      );
    }
    
    // Generic error handling
    return NextResponse.json(
      { 
        error: 'Server error', 
        message: error.message || 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed', message: 'Only POST requests are supported' },
    { status: 405 }
  );
}
