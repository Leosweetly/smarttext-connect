# SmartText AI Onboarding Flow Manual Testing Guide

This guide provides step-by-step instructions for manually testing the SmartText AI onboarding flow, including the Stripe integration, trial flow, and cancellation experience.

## Prerequisites

- Local development server running (`npm run dev`)
- Stripe test mode enabled
- Test user account credentials

## 1. Auth0 to Stripe Checkout Flow

### Test Steps:

1. **Sign Up Process**:
   - Navigate to `/auth/signup`
   - Fill in the registration form with test data:
     - Name: `Test User`
     - Business Name: `Test Business`
     - Email: `test@example.com`
     - Password: `TestPassword123!`
   - Click "Create Account"

2. **Stripe Redirect**:
   - ✅ Verify loading state appears during redirect
   - ✅ Verify redirect to Stripe checkout page

3. **Stripe Checkout**:
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiration date
   - Any 3-digit CVC
   - Any billing address
   - Complete checkout

4. **Post-Checkout**:
   - ✅ Verify redirect to success page
   - ✅ Verify processing state on success page
   - ✅ Verify redirect to business info page

### Expected Results:

- User is created in Auth0
- Stripe checkout completes successfully
- User lands on business info page
- Console logs show:
  - Subscription creation
  - Airtable logging
  - Trial start date and plan selection

## 2. Onboarding Flow

### Test Steps:

1. **Business Info**:
   - Fill in business information
   - Click "Next"

2. **Communication Setup**:
   - Configure business hours and communication preferences
   - Click "Next"

3. **Message Templates**:
   - Customize message templates
   - Click "Complete Setup"

4. **Dashboard**:
   - ✅ Verify user lands on dashboard
   - ✅ Verify no tour page is shown

### Expected Results:

- User completes onboarding without seeing feature tour
- User information is saved at each step
- User lands on dashboard after completing onboarding

## 3. Subscription Management

### Test Steps:

1. **View Subscription**:
   - Navigate to Settings > Billing
   - ✅ Verify subscription details are displayed:
     - Plan name (Business Pro)
     - Trial status
     - Trial end date

2. **Cancel Subscription**:
   - Click "Cancel Subscription"
   - ✅ Verify cancellation modal appears
   - Select a reason (e.g., "Too expensive")
   - Add feedback text
   - Click "Confirm Cancellation"

3. **Post-Cancellation**:
   - ✅ Verify success message
   - ✅ Verify subscription status changes to canceled
   - ✅ Verify UI updates to reflect canceled status

### Expected Results:

- Subscription details are displayed correctly
- Cancellation process works smoothly
- UI updates to reflect cancellation
- Console logs show:
  - Cancellation API call
  - Airtable update
  - Email/SMS notifications (or logs)

## 4. Error Handling

### Test Steps:

1. **Network Error Simulation**:
   - Disconnect from internet
   - Attempt to cancel subscription
   - ✅ Verify error message is displayed
   - Reconnect to internet

2. **Form Validation**:
   - Try to submit cancellation without selecting a reason
   - ✅ Verify validation error is shown
   - ✅ Verify submit button is disabled

### Expected Results:

- Errors are handled gracefully
- User-friendly error messages are displayed
- Form validation prevents invalid submissions

## 5. Verification Checklist

Use this checklist to track your testing progress:

| Test Case | Status | Notes |
|-----------|--------|-------|
| Sign Up | ⬜ | |
| Stripe Redirect | ⬜ | |
| Stripe Checkout | ⬜ | |
| Post-Checkout Redirect | ⬜ | |
| Business Info | ⬜ | |
| Communication Setup | ⬜ | |
| Message Templates | ⬜ | |
| Dashboard Landing | ⬜ | |
| View Subscription | ⬜ | |
| Cancel Subscription | ⬜ | |
| Post-Cancellation UI | ⬜ | |
| Error Handling | ⬜ | |

## 6. Migration Notes

The following components are currently implemented in the frontend but should be moved to the backend (smarttext-ai):

1. **Webhook Handling**
   - `/api/stripe-webhook.ts`
   - Reason: Security (webhook signature verification), direct database access

2. **Stripe API Integration**
   - `/api/create-checkout-session.ts`
   - `/api/subscription-status.ts`
   - Reason: API key security, consistent error handling

3. **Airtable Integration**
   - `/api/log-subscription.ts`
   - `/services/airtable.ts`
   - Reason: Direct database access, API key security

4. **Notification Services**
   - `/services/notifications.ts`
   - Reason: API key security, reliable delivery, queuing

5. **Error Logging**
   - `/services/sentry.ts`
   - Reason: Centralized error tracking, better context

## 7. Reporting Issues

When reporting issues, please include:

1. Step where the issue occurred
2. Expected behavior
3. Actual behavior
4. Console logs/errors
5. Screenshots (if applicable)
6. Browser and OS information
