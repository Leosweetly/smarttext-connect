// This service handles Stripe checkout and subscription management through backend API endpoints
import { SubscriptionStatus } from './airtable';

interface StripeCheckoutOptions {
  priceId: string;
  customerId?: string;
  customerEmail?: string;
  trialDays?: number;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

/**
 * Redirects the user to Stripe Checkout via backend API
 */
export const redirectToStripeCheckout = async ({
  priceId,
  customerId,
  customerEmail,
  trialDays = 14, // Default to 14-day trial
  successUrl,
  cancelUrl,
  metadata = {},
}: StripeCheckoutOptions): Promise<void> => {
  try {
    console.log('stripe.ts: redirectToStripeCheckout called with:', {
      priceId,
      customerId,
      customerEmail,
      trialDays,
      successUrl,
      cancelUrl,
      metadata,
    });

    // Get base URL from environment
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const apiUrl = `${baseUrl}/api/create-checkout-session`;
    console.log('stripe.ts: sending request to:', apiUrl);

    // Prepare request data
    const requestData = {
      priceId,
      customerId,
      customerEmail,
      trialDays,
      successUrl,
      cancelUrl,
      metadata: {
        ...metadata,
        source: 'smarttext-connect',
      },
    };

    // Make the API call
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('stripe.ts: API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('stripe.ts: API error:', errorData.error || 'Unknown error');
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    // Parse the response
    const result = await response.json();
    console.log('stripe.ts: API response data:', result);

    // Redirect to Stripe Checkout
    if (result.url) {
      console.log('stripe.ts: redirecting to Stripe Checkout URL:', result.url);
      window.location.href = result.url;
    } else {
      throw new Error('No checkout URL returned from API');
    }
  } catch (error: any) {
    console.error('stripe.ts: Error redirecting to Stripe Checkout:', error.message || error);
    throw error;
  }
};

/**
 * Gets the current subscription status for a customer via backend API
 */
export const getSubscriptionStatus = async (customerId: string): Promise<{
  active: boolean;
  status?: SubscriptionStatus;
  trialEnd?: Date;
  planName?: string;
  planId?: string;
  subscriptionId?: string;
}> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const response = await fetch(`${baseUrl}/api/stripe/subscriptions/${encodeURIComponent(customerId)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      active: data.active || false,
      status: data.status,
      trialEnd: data.trialEnd ? new Date(data.trialEnd) : undefined,
      planName: data.planName,
      planId: data.planId,
      subscriptionId: data.subscriptionId,
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return {
      active: false,
    };
  }
};

/**
 * Cancels a subscription via backend API
 */
export const cancelSubscription = async (
  subscriptionId: string,
  customerId: string,
  userId: string,
  options?: {
    reason?: string;
    feedback?: string;
    sendFeedbackRequest?: boolean;
    email?: string;
    businessName?: string;
    phone?: string;
  }
): Promise<{ success: boolean }> => {
  try {
    console.log('stripe.ts: cancelSubscription called with:', {
      subscriptionId,
      customerId,
      userId,
      options,
    });

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const apiUrl = `${baseUrl}/api/stripe/subscriptions/${subscriptionId}/cancel`;
    console.log('stripe.ts: sending request to:', apiUrl);

    // Prepare request data
    const requestData = {
      customerId,
      userId,
      reason: options?.reason,
      feedback: options?.feedback,
      sendFeedbackRequest: options?.sendFeedbackRequest !== false, // Default to true
      email: options?.email,
      businessName: options?.businessName,
      phone: options?.phone,
    };

    // Make the API call
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('stripe.ts: API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('stripe.ts: API error:', errorData.error || 'Unknown error');
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    // Parse the response
    const result = await response.json();
    console.log('stripe.ts: API response data:', result);

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('stripe.ts: Error canceling subscription:', error.message || error);
    return {
      success: false,
    };
  }
};

/**
 * Logs subscription data via backend API
 */
export const logSubscriptionToAirtable = async (
  userId: string,
  subscriptionData: {
    customerId: string;
    subscriptionId: string;
    planId: string;
    planName: string;
    trialStart: Date;
    trialEnd: Date;
  }
): Promise<{ success: boolean }> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const response = await fetch(`${baseUrl}/api/airtable/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        ...subscriptionData,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error logging subscription to Airtable:', error);
    return {
      success: false,
    };
  }
};
