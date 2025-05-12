# Trial Activation Flow

This document explains the trial activation flow for the SmartText application, which allows users to create a business with a 14-day free trial.

## Overview

The trial activation flow consists of the following components:

1. **Frontend Form**: A React component that collects business information and validates it
2. **API Endpoint**: A Next.js API route that processes the form submission and creates the business record
3. **Utility Functions**: Helper functions for creating businesses with trial plans and validating phone numbers
4. **Test Script**: A script for testing the trial activation flow

## Components

### Frontend Form (`app/(protected)/onboarding/components/TrialActivationForm.tsx`)

This React component renders a form that collects:
- Business name
- Phone number (in E.164 format)

Features:
- Client-side validation using Zod
- Automatic phone number formatting to E.164 format
- Error handling and success feedback
- Redirect to dashboard after successful activation

### API Endpoint (`app/api/create-business-trial/route.ts`)

This Next.js API route handles the form submission and:
- Authenticates the user
- Formats the phone number if needed
- Creates a business record with trial information
- Returns success or error response

### Utility Functions (`lib/business-utils.ts`)

These utility functions help with:
- Creating businesses with trial plans
- Validating and formatting phone numbers to E.164 format
- Defining Zod schemas for validation

### Test Script (`scripts/test-trial-activation.js`)

This script tests the trial activation flow by:
1. Creating a test user
2. Activating a trial for the user
3. Verifying the trial was activated correctly
4. Cleaning up test data

## Database Schema

The `businesses` table includes the following fields related to trials:

- `trial_plan` (boolean): Indicates if the business is on a trial plan
- `trial_expiration_date` (timestamp): When the trial expires (14 days from creation)
- `subscription_tier` (text): The subscription tier (e.g., "free", "pro")
- `twilio_number` (text): The business phone number in E.164 format

## How It Works

1. User signs up and is directed to the onboarding page
2. User fills out the trial activation form with business name and phone number
3. Form validates input and submits to the API endpoint
4. API endpoint creates a business record with trial information
5. User is redirected to the dashboard

## Error Handling

The system handles various error cases:

- Invalid phone number format (must be E.164)
- Missing required fields
- Authentication errors
- Database errors

## Testing

To test the trial activation flow:

```bash
# Run the test script
node scripts/test-trial-activation.js
```

The test script will:
1. Create a test user
2. Activate a trial
3. Verify the trial was activated correctly
4. Clean up test data

## Debugging

If you encounter issues with the trial activation flow:

1. Check the browser console for client-side errors
2. Check the server logs for API errors
3. Verify the database schema matches the expected structure
4. Run the test script to verify the flow works end-to-end

## Common Issues

### "The string did not match the expected pattern" Error

This error typically occurs when:

1. The `user_id` is not a valid UUID
2. The `trial_expiration_date` is not in ISO 8601 format
3. The `twilio_number` is not in E.164 format (e.g., +18186519003)

### Phone Number Formatting

Phone numbers must be in E.164 format:
- Must start with a plus sign (+)
- Followed by the country code
- Followed by the phone number
- No spaces, dashes, or other characters
- Example: +18186519003

The system attempts to automatically format phone numbers, but it's best to ensure they're in the correct format before submission.

## Future Improvements

Potential improvements to the trial activation flow:

1. Add support for international phone numbers
2. Implement trial expiration notifications
3. Add ability to extend trial period
4. Create admin interface for managing trials
