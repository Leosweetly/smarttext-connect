# SmartText AI Backend Migration Guide

This guide outlines the steps to migrate the current frontend API implementations to the backend (smarttext-ai). The current implementation has several API endpoints and services in the frontend that should be moved to the backend for security and architectural reasons.

## Overview

### Current Architecture

- **Frontend (smarttext-connect)**:
  - React components and UI
  - Client-side hooks and state management
  - API endpoints (Next.js API routes or similar)
  - Service implementations

### Target Architecture

- **Frontend (smarttext-connect)**:
  - React components and UI
  - Client-side hooks and state management
  - API client services that call backend endpoints

- **Backend (smarttext-ai)**:
  - API endpoints
  - Webhook handlers
  - Database/Airtable interactions
  - Stripe API integration
  - Email/SMS sending
  - Error logging

## Migration Steps

### 1. Stripe Webhook Handling

#### Current Implementation
- `/api/stripe-webhook.ts` in frontend

#### Migration Steps
1. Create a new endpoint in the backend:
   ```
   POST /api/webhooks/stripe
   ```

2. Implement webhook signature verification:
   ```javascript
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
   
   // Verify webhook signature
   const signature = req.headers['stripe-signature'];
   let event;
   
   try {
     event = stripe.webhooks.constructEvent(
       req.body,
       signature,
       process.env.STRIPE_WEBHOOK_SECRET
     );
   } catch (err) {
     return res.status(400).send(`Webhook Error: ${err.message}`);
   }
   ```

3. Implement event handlers for each event type:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

4. Update frontend to remove the webhook endpoint

### 2. Stripe API Integration

#### Current Implementation
- `/api/create-checkout-session.ts`
- `/api/subscription-status.ts`
- `/services/stripe.ts`

#### Migration Steps
1. Create new endpoints in the backend:
   ```
   POST /api/stripe/checkout-sessions
   GET /api/stripe/subscriptions/:customerId
   ```

2. Implement Stripe API calls in the backend:
   ```javascript
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
   
   // Create checkout session
   const session = await stripe.checkout.sessions.create({
     payment_method_types: ['card'],
     line_items: [{
       price: req.body.priceId,
       quantity: 1,
     }],
     mode: 'subscription',
     subscription_data: {
       trial_period_days: req.body.trialDays || 14,
     },
     success_url: req.body.successUrl,
     cancel_url: req.body.cancelUrl,
     metadata: req.body.metadata,
   });
   ```

3. Update frontend service to call backend endpoints:
   ```typescript
   export const redirectToStripeCheckout = async (options: StripeCheckoutOptions): Promise<void> => {
     try {
       const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
       const response = await fetch(`${baseUrl}/api/stripe/checkout-sessions`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(options),
       });
       
       const result = await response.json();
       
       if (result.url) {
         window.location.href = result.url;
       } else {
         throw new Error('No checkout URL returned from API');
       }
     } catch (error) {
       console.error('Error redirecting to Stripe Checkout:', error);
       throw error;
     }
   };
   ```

### 3. Airtable Integration

#### Current Implementation
- `/api/log-subscription.ts`
- `/services/airtable.ts`

#### Migration Steps
1. Create new endpoints in the backend:
   ```
   POST /api/airtable/subscriptions
   POST /api/airtable/businesses
   ```

2. Implement Airtable API calls in the backend:
   ```javascript
   const Airtable = require('airtable');
   const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
   
   // Log subscription to Airtable
   const record = await base('Subscriptions').create({
     userId: req.body.userId,
     customerId: req.body.customerId,
     subscriptionId: req.body.subscriptionId,
     planId: req.body.planId,
     planName: req.body.planName,
     trialStart: req.body.trialStart,
     trialEnd: req.body.trialEnd,
     status: 'trialing',
     isTestData: process.env.NODE_ENV !== 'production',
   });
   ```

3. Update frontend service to call backend endpoints:
   ```typescript
   export const logSubscriptionToAirtable = async (data: SubscriptionData): Promise<{ success: boolean; id?: string }> => {
     try {
       const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
       const response = await fetch(`${baseUrl}/api/airtable/subscriptions`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
       });
       
       const result = await response.json();
       return {
         success: response.ok,
         id: result.id,
       };
     } catch (error) {
       console.error('Error logging subscription to Airtable:', error);
       return { success: false };
     }
   };
   ```

### 4. Notification Services

#### Current Implementation
- `/services/notifications.ts`

#### Migration Steps
1. Create new endpoints in the backend:
   ```
   POST /api/notifications/email
   POST /api/notifications/sms
   ```

2. Implement email/SMS sending in the backend:
   ```javascript
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   
   // Send email
   const msg = {
     to: req.body.to,
     from: 'noreply@smarttext-ai.com',
     subject: req.body.subject,
     html: req.body.message,
   };
   
   await sgMail.send(msg);
   ```

3. Update frontend service to call backend endpoints:
   ```typescript
   export const sendEmail = async (options: NotificationOptions): Promise<{ success: boolean }> => {
     try {
       const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
       const response = await fetch(`${baseUrl}/api/notifications/email`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(options),
       });
       
       return { success: response.ok };
     } catch (error) {
       console.error('Error sending email:', error);
       return { success: false };
     }
   };
   ```

### 5. Error Logging

#### Current Implementation
- `/services/sentry.ts`

#### Migration Steps
1. Implement Sentry in the backend:
   ```javascript
   const Sentry = require('@sentry/node');
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

2. Keep a lightweight Sentry implementation in the frontend for client-side errors:
   ```typescript
   import * as Sentry from '@sentry/browser';
   
   Sentry.init({
     dsn: import.meta.env.VITE_SENTRY_DSN,
     environment: import.meta.env.MODE,
   });
   ```

## Environment Variables

### Backend Environment Variables
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
AIRTABLE_API_KEY=key...
AIRTABLE_BASE_ID=app...
SENDGRID_API_KEY=SG...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
SENTRY_DSN=https://...
```

### Frontend Environment Variables
```
VITE_API_BASE_URL=https://api.smarttext-ai.com
VITE_STRIPE_PRICE_ID=price_business_pro
VITE_STRIPE_TRIAL_DAYS=14
VITE_SENTRY_DSN=https://...
```

## Testing the Migration

1. Implement one endpoint at a time in the backend
2. Update the corresponding frontend service to call the new backend endpoint
3. Test the functionality to ensure it works as expected
4. Remove the old frontend API endpoint once the migration is complete

## Migration Checklist

| Component | Status | Notes |
|-----------|--------|-------|
| Stripe Webhook Handler | ⬜ | |
| Create Checkout Session | ⬜ | |
| Subscription Status | ⬜ | |
| Cancel Subscription | ⬜ | |
| Log Subscription to Airtable | ⬜ | |
| Business Info to Airtable | ⬜ | |
| Email Notifications | ⬜ | |
| SMS Notifications | ⬜ | |
| Error Logging | ⬜ | |

## Security Considerations

1. **API Keys**: Never expose API keys in the frontend
2. **Authentication**: Implement proper authentication for all backend endpoints
3. **CORS**: Configure CORS to only allow requests from trusted origins
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Input Validation**: Validate all input data to prevent injection attacks
6. **Error Handling**: Don't expose sensitive information in error messages

## Conclusion

By migrating these components to the backend, we'll improve the security and architecture of the application. The frontend will be responsible for UI and user interactions, while the backend will handle data processing, API integrations, and security-sensitive operations.
