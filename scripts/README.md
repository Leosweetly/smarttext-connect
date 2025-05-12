# SmartText AI Testing and Migration Scripts

This directory contains scripts and guides for testing and migrating the SmartText AI onboarding flow, including Stripe integration, trial flow, and cancellation experience.

## Scripts Overview

### 1. `verify-onboarding-flow.js`

**Purpose**: Automated testing script to verify the functionality of the onboarding flow, including Stripe webhook handling, trial flow, and cancellation experience.

**Usage**:
```bash
node scripts/verify-onboarding-flow.js
```

**Features**:
- Tests Stripe webhook handling for different event types
- Tests trial flow and subscription management
- Tests cancellation flow
- Tests error handling
- Provides migration notes for moving components to the backend

### 2. `manual-testing-guide.md`

**Purpose**: Step-by-step guide for manually testing the UI components and user flows.

**Usage**: Open in a markdown viewer or text editor and follow the instructions.

**Features**:
- Detailed steps for testing the Auth0 to Stripe checkout flow
- Instructions for testing the onboarding process
- Steps for testing subscription management and cancellation
- Error handling verification
- Verification checklist to track testing progress

### 3. `backend-migration-guide.md`

**Purpose**: Guide for migrating the current frontend API implementations to the backend.

**Usage**: Open in a markdown viewer or text editor and follow the migration steps.

**Features**:
- Detailed steps for migrating each component to the backend
- Code examples for backend implementation
- Code examples for updating frontend services
- Environment variable requirements
- Migration checklist
- Security considerations

## Testing Strategy

1. **Automated Testing**:
   - Run `verify-onboarding-flow.js` to test the API endpoints and service functionality
   - Check console output for any errors or issues

2. **Manual Testing**:
   - Follow the steps in `manual-testing-guide.md` to test the UI components and user flows
   - Use the verification checklist to track your progress
   - Report any issues with detailed information

3. **Migration Planning**:
   - Review `backend-migration-guide.md` to understand what needs to be moved to the backend
   - Follow the migration steps for each component
   - Test each migrated component to ensure it works as expected

## Important Notes

- The current implementation has several API endpoints and services in the frontend that should be moved to the backend for security and architectural reasons.
- The automated testing script simulates API calls and does not make actual API requests.
- The manual testing guide assumes you have a local development server running.
- The migration guide provides a step-by-step approach to moving components to the backend.

## Reporting Issues

When reporting issues, please include:
1. Script or guide where the issue was found
2. Step where the issue occurred
3. Expected behavior
4. Actual behavior
5. Console logs/errors
6. Screenshots (if applicable)
