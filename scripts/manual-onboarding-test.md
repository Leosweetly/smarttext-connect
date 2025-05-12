# Manual Onboarding Test Guide

This guide provides step-by-step instructions for manually testing the onboarding flow of the SmartText application.

## Prerequisites

- Access to the SmartText application (www.getsmarttext.com)
- A valid email address that you can access
- A web browser (Chrome, Firefox, Safari, or Edge)

## Test Cases

### Test Case 1: New User Signup and Onboarding

#### Steps

1. **Visit the SmartText website**
   - Navigate to www.getsmarttext.com
   - Verify that the homepage loads correctly

2. **Sign up with a new email address**
   - Click on the "Sign Up" or "Get Started" button
   - Enter a valid email address that you can access
   - Click the "Sign Up" button
   - Verify that you are redirected to the "Check Email" page

3. **Check your email and click the magic link**
   - Open your email inbox
   - Find the email from SmartText (check spam/junk folder if necessary)
   - Click the magic link in the email
   - Verify that you are redirected to the onboarding page

4. **Complete the onboarding process**
   - Enter your business name
   - Fill out any other required information
   - Click the "Continue" or "Next" button
   - Verify that you are redirected to the dashboard

5. **Verify trial plan assignment**
   - Check if there is any indication of a trial plan
   - Look for a trial expiration date or countdown
   - Verify that the trial period is 14 days from the signup date

#### Expected Results

- You should be able to sign up with a new email address
- You should receive a magic link email
- Clicking the magic link should authenticate you
- You should be redirected to the onboarding page
- After completing onboarding, you should be redirected to the dashboard
- You should be automatically placed on a trial plan

### Test Case 2: Returning User Login

#### Steps

1. **Visit the SmartText website**
   - Navigate to www.getsmarttext.com
   - Verify that the homepage loads correctly

2. **Log in with an existing email address**
   - Click on the "Log In" button
   - Enter the email address you used in Test Case 1
   - Click the "Log In" button
   - Verify that you are redirected to the "Check Email" page

3. **Check your email and click the magic link**
   - Open your email inbox
   - Find the email from SmartText (check spam/junk folder if necessary)
   - Click the magic link in the email
   - Verify that you are redirected to the dashboard (not the onboarding page)

#### Expected Results

- You should be able to log in with an existing email address
- You should receive a magic link email
- Clicking the magic link should authenticate you
- You should be redirected to the dashboard, not the onboarding page

### Test Case 3: Protected Routes

#### Steps

1. **Log out of the application**
   - Click on your profile or account menu
   - Click the "Log Out" button
   - Verify that you are redirected to the homepage or login page

2. **Try to access protected routes directly**
   - Try to navigate to the following URLs:
     - www.getsmarttext.com/dashboard
     - www.getsmarttext.com/dashboard/conversations
     - www.getsmarttext.com/dashboard/missed-calls
     - www.getsmarttext.com/dashboard/settings
   - Verify that you are redirected to the login page for each URL

3. **Log in again**
   - Follow the steps in Test Case 2 to log in
   - Verify that you can now access the protected routes

#### Expected Results

- You should not be able to access protected routes when logged out
- You should be redirected to the login page when trying to access protected routes while logged out
- After logging in, you should be able to access the protected routes

### Test Case 4: Data Access Controls

#### Steps

1. **Create a second account**
   - Open a new browser or use incognito/private browsing mode
   - Follow the steps in Test Case 1 to create a new account with a different email address
   - Complete the onboarding process

2. **Try to access the first account's data**
   - Note the URL structure of your dashboard
   - Try to modify the URL to access the first account's data
   - For example, if your dashboard URL is www.getsmarttext.com/dashboard?id=123, try changing the ID to the first account's ID

#### Expected Results

- You should not be able to access the first account's data
- You should see an error message or be redirected to your own dashboard

## Reporting Issues

If you encounter any issues during testing, please document the following:

1. Test case number and step where the issue occurred
2. Expected behavior
3. Actual behavior
4. Screenshots (if applicable)
5. Browser and operating system information

Submit this information to the development team for investigation.
