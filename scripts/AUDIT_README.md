# SmartText Security Audit Scripts

This directory contains scripts for auditing the security of the SmartText application. These scripts are designed to verify authentication, authorization, and data access controls.

## Scripts

### 1. add-trial-plan-fields.js

This script adds trial plan fields to the businesses table and updates the database.types.ts file.

```bash
npm run add:trial-fields
```

### 2. test-rls-policies.js

This script tests Row Level Security (RLS) policies on the businesses table to ensure that users can only access and modify their own data.

```bash
npm run verify:rls
```

### 3. verify-live-onboarding.js

This script tests the authentication and onboarding flow, including user creation, authentication, and business creation.

```bash
npm run verify:onboarding
```

### 4. test-auth-and-trial.js

This script tests the authentication flow and trial plan implementation, including automatic trial plan assignment for new users and setting a trial expiration date 14 days in the future.

```bash
npm run test:trial
```

### 5. simulate-conversation-data.js

This script creates sample data for conversations and missed calls, which can be used to test the conversations and missed calls sections of the application.

```bash
npm run simulate:data
```

## Usage

1. Ensure that the `.env.local` file is properly configured with Supabase credentials.
2. Run the scripts in the following order:
   1. `npm run add:trial-fields` - Add trial plan fields to the businesses table
   2. `npm run apply:schema` - Apply the schema.sql file to the database
   3. `npm run verify:rls` - Test Row Level Security policies
   4. `npm run test:trial` - Test authentication and trial plan implementation
   5. `npm run simulate:data` - Create sample data for conversations and missed calls
   6. `npm run verify:onboarding` - Test the onboarding flow

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

## Results

The scripts will output detailed logs to the console, indicating whether each test passed or failed. If a test fails, the script will provide information about the failure, which can be used to diagnose and fix the issue.

For a more comprehensive report, see the audit-report.md file in the root directory.
