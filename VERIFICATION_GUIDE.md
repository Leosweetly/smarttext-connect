# SmartText Security Verification Guide

This guide provides instructions for verifying the security of the SmartText application, focusing on authentication, authorization, and data access controls.

## Prerequisites

- Node.js installed
- Access to the SmartText Supabase project
- `.env.local` file with the following variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure the `.env.local` file is properly configured

## Verification Scripts

### 1. Test Row Level Security (RLS) Policies

This script tests that users can only access and modify their own data.

```bash
npm run verify:rls
```

Expected results:
- Users can read their own business data
- Users cannot read other users' business data
- Users can update their own business data
- Users cannot update other users' business data

### 2. Add Trial Plan Fields

This script checks if the trial plan fields exist in the businesses table and updates the database.types.ts file.

```bash
npm run add:trial-fields
```

Expected results:
- The script will check if the trial_plan and trial_expiration_date fields exist
- If they don't exist, it will provide SQL statements to add them
- It will update the database.types.ts file to include these fields

### 3. Verify Onboarding Flow

This script tests the authentication and onboarding flow.

```bash
npm run verify:onboarding
```

Expected results:
- A test user is created
- The user is authenticated
- A business is created for the user
- The user is redirected to the appropriate page based on whether they have a business

### 4. Simulate Conversation Data

This script creates sample data for the conversations and missed calls sections.

```bash
npm run simulate:data
```

Expected results:
- Sample conversations and missed calls are created for testing
- The data is associated with the correct business

## Manual Verification

### Authentication

1. Visit the live site at www.getsmarttext.com
2. Sign up with a new email address
3. Verify that you receive a magic link email
4. Click the magic link to authenticate
5. Verify that you are redirected to the onboarding page

### Protected Routes

1. Log in to the application
2. Try to access the following routes:
   - `/dashboard`
   - `/dashboard/conversations`
   - `/dashboard/missed-calls`
   - `/dashboard/settings`
3. Verify that you can access these routes only when authenticated
4. Log out and try to access these routes again
5. Verify that you are redirected to the login page

### Data Access

1. Log in with two different accounts
2. Create a business for each account
3. Try to access the other account's business data
4. Verify that you cannot access or modify the other account's data

## Troubleshooting

### Schema Issues

If the verification scripts report missing tables or columns:

1. Check the schema.sql file to see the expected schema
2. Run the apply-schema.js script to apply the schema:
   ```bash
   npm run apply:schema
   ```

### Authentication Issues

If you encounter authentication issues:

1. Check that the Supabase URL and keys are correct in the .env.local file
2. Verify that the Supabase project has email authentication enabled
3. Check the Supabase logs for any authentication errors

## Conclusion

By running these verification scripts and performing manual checks, you can ensure that the SmartText application maintains strong security controls for authentication, authorization, and data access.
