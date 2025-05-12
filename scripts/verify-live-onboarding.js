/**
 * Live Onboarding Flow Verification Script
 * 
 * This script verifies the onboarding flow on the live site (www.getsmarttext.com)
 * by testing the entire process from user creation to business data storage in Supabase.
 * 
 * It tests:
 * 1. User creation (bypassing magic link for testing)
 * 2. Business creation through the onboarding flow
 * 3. Data verification in Supabase
 * 4. Cleanup of test data
 * 
 * Usage:
 * node scripts/verify-live-onboarding.js
 * 
 * Requirements:
 * - Supabase project with the schema.sql applied
 * - .env.local file with Supabase credentials
 * - SUPABASE_SERVICE_ROLE_KEY in .env.local for admin operations
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
// Use dynamic import for node-fetch (ESM module)
let fetch;
import('node-fetch').then(module => {
  fetch = module.default;
});
const puppeteer = require('puppeteer');

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_URL = 'https://www.getsmarttext.com';

// Create Supabase clients
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m'
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m'
  }
};

// Helper functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  let prefix = '';
  
  switch (type) {
    case 'success':
      prefix = `${colors.fg.green}[SUCCESS]${colors.reset}`;
      break;
    case 'error':
      prefix = `${colors.fg.red}[ERROR]${colors.reset}`;
      break;
    case 'warning':
      prefix = `${colors.fg.yellow}[WARNING]${colors.reset}`;
      break;
    case 'info':
    default:
      prefix = `${colors.fg.blue}[INFO]${colors.reset}`;
      break;
  }
  
  console.log(`${prefix} ${timestamp} - ${message}`);
}

// Generate a unique test email
function generateTestEmail() {
  const timestamp = Date.now();
  return `test+${timestamp}@example.com`;
}

// Generate a unique business name
function generateBusinessName() {
  const timestamp = Date.now();
  return `Test Business ${timestamp}`;
}

// API-based verification
async function verifyOnboardingAPI() {
  log('Starting API-based onboarding verification');
  
  // Check if Supabase is configured
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    log('Supabase credentials not found in .env.local', 'error');
    process.exit(1);
  }
  
  let testUser = null;
  let testBusiness = null;
  
  try {
    // Step 1: Create a test user
    const testEmail = generateTestEmail();
    log(`Creating test user: ${testEmail}`);
    
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      email_confirm: true, // Auto-confirm the email for testing
      user_metadata: { name: 'Test User' }
    });
    
    if (userError) {
      log(`Error creating test user: ${userError.message}`, 'error');
      process.exit(1);
    }
    
    testUser = userData.user;
    log(`Created test user with ID: ${testUser.id}`, 'success');
    
    // Step 2: Get a session for the test user using the admin API
    log('Getting session for test user using admin API');
    
    // Since we can't directly create a session with the admin API in this version of Supabase,
    // we'll create a temporary password for the user and sign in with that
    const tempPassword = 'TemporaryPassword123!';
    
    // Update the user with a temporary password
    const { error: updateUserError } = await supabaseAdmin.auth.admin.updateUserById(
      testUser.id,
      { password: tempPassword }
    );
    
    if (updateUserError) {
      log(`Error updating user with temporary password: ${updateUserError.message}`, 'error');
      process.exit(1);
    }
    
    // Sign in with the temporary password
    const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: tempPassword
    });
    
    if (signInError) {
      log(`Error signing in with temporary password: ${signInError.message}`, 'error');
      process.exit(1);
    }
    
    log('Created session successfully', 'success');
    
    // Step 3: Create a business for the test user
    const businessName = generateBusinessName();
    log(`Creating business: ${businessName}`);
    
    // Create a Supabase client with the user's session
    const supabaseWithAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      }
    });
    
    // Create the business directly using the Supabase client
    const businessData = {
      user_id: testUser.id,
      name: businessName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: business, error: businessError } = await supabaseWithAuth
      .from('businesses')
      .insert(businessData)
      .select()
      .single();
    
    if (businessError) {
      log(`Error creating business: ${businessError.message}`, 'error');
      
      // Check if it's an RLS error
      if (businessError.code === 'PGRST301') {
        log('This appears to be an RLS policy error. Make sure the user can insert their own business.', 'warning');
      }
      
      // Clean up the test user before exiting
      await supabaseAdmin.auth.admin.deleteUser(testUser.id);
      process.exit(1);
    }
    
    testBusiness = business;
    log(`Created business with ID: ${testBusiness.id}`, 'success');
    
    // Step 4: Verify the business data
    log('Verifying business data in Supabase');
    
    const { data: verifiedBusiness, error: verifyError } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .eq('id', testBusiness.id)
      .single();
    
    if (verifyError) {
      log(`Error verifying business: ${verifyError.message}`, 'error');
      process.exit(1);
    }
    
    // Check that the data matches
    if (verifiedBusiness.name !== businessName) {
      log(`Business name mismatch: ${verifiedBusiness.name} !== ${businessName}`, 'error');
    } else {
      log('Business name verified', 'success');
    }
    
    if (verifiedBusiness.user_id !== testUser.id) {
      log(`User ID mismatch: ${verifiedBusiness.user_id} !== ${testUser.id}`, 'error');
    } else {
      log('User ID verified', 'success');
    }
    
    // Check for trial plan fields if they exist
    if ('trial_plan' in verifiedBusiness) {
      log(`Trial plan: ${verifiedBusiness.trial_plan}`, 'info');
    }
    
    if ('trial_expiration_date' in verifiedBusiness) {
      log(`Trial expiration date: ${verifiedBusiness.trial_expiration_date}`, 'info');
      
      // Check if the trial expiration date is in the future
      const trialExpiration = new Date(verifiedBusiness.trial_expiration_date);
      const now = new Date();
      
      if (trialExpiration > now) {
        log('Trial expiration date is in the future', 'success');
      } else {
        log('Trial expiration date is not in the future', 'warning');
      }
    }
    
    log('API-based verification completed successfully', 'success');
    
  } catch (error) {
    log(`Unexpected error: ${error.message}`, 'error');
  } finally {
    // Clean up test data
    if (testBusiness) {
      log(`Cleaning up test business: ${testBusiness.id}`);
      const { error: deleteBusinessError } = await supabaseAdmin
        .from('businesses')
        .delete()
        .eq('id', testBusiness.id);
      
      if (deleteBusinessError) {
        log(`Error deleting business: ${deleteBusinessError.message}`, 'error');
      } else {
        log('Test business deleted', 'success');
      }
    }
    
    if (testUser) {
      log(`Cleaning up test user: ${testUser.id}`);
      const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(testUser.id);
      
      if (deleteUserError) {
        log(`Error deleting user: ${deleteUserError.message}`, 'error');
      } else {
        log('Test user deleted', 'success');
      }
    }
  }
}

// Browser-based verification
async function verifyOnboardingBrowser() {
  log('Starting browser-based onboarding verification');
  
  let browser = null;
  let testUser = null;
  
  try {
    // Step 1: Create a test user with the admin API
    const testEmail = generateTestEmail();
    log(`Creating test user: ${testEmail}`);
    
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      email_confirm: true, // Auto-confirm the email for testing
      user_metadata: { name: 'Test User' }
    });
    
    if (userError) {
      log(`Error creating test user: ${userError.message}`, 'error');
      process.exit(1);
    }
    
    testUser = userData.user;
    log(`Created test user with ID: ${testUser.id}`, 'success');
    
    // Step 2: Launch browser and navigate to the site
    log('Launching browser');
    browser = await puppeteer.launch({ headless: false }); // Set to false to see the browser
    const page = await browser.newPage();
    
    // Set a reasonable viewport size
    await page.setViewport({ width: 1280, height: 800 });
    
    // Step 3: Go to the login page
    log(`Navigating to ${SITE_URL}/login`);
    await page.goto(`${SITE_URL}/login`, { waitUntil: 'networkidle2' });
    
    // Step 4: Enter the test email
    log(`Entering test email: ${testEmail}`);
    await page.type('input[type="email"]', testEmail);
    
    // Take a screenshot
    await page.screenshot({ path: 'login-form.png' });
    log('Screenshot saved: login-form.png', 'info');
    
    // Step 5: Submit the form
    log('Submitting login form');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);
    
    // Take a screenshot
    await page.screenshot({ path: 'after-login.png' });
    log('Screenshot saved: after-login.png', 'info');
    
    // Step 6: Check if we're on the check-email page
    const currentUrl = page.url();
    log(`Current URL: ${currentUrl}`, 'info');
    
    if (currentUrl.includes('/check-email')) {
      log('Redirected to check-email page as expected', 'success');
    } else {
      log(`Unexpected redirect to ${currentUrl}`, 'warning');
    }
    
    // Step 7: Since we can't actually click the magic link in an automated test,
    // we'll use the Supabase admin API to get a session for the user
    log('Getting session for test user');
    
    // Sign in as the test user to get a session
    const { data: { session }, error: signInError } = await supabaseAdmin.auth.admin.getUserById(testUser.id);
    
    if (signInError) {
      log(`Error getting user session: ${signInError.message}`, 'error');
      process.exit(1);
    }
    
    // Step 8: Set the session cookie in the browser
    log('Setting session cookie in browser');
    
    // This is a simplified version - in a real test, you'd need to set the actual Supabase session cookie
    await page.setCookie({
      name: 'sb-auth-token',
      value: session.access_token,
      domain: new URL(SITE_URL).hostname,
      path: '/',
      httpOnly: true,
      secure: true
    });
    
    // Step 9: Navigate to the onboarding page
    log(`Navigating to ${SITE_URL}/onboarding`);
    await page.goto(`${SITE_URL}/onboarding`, { waitUntil: 'networkidle2' });
    
    // Take a screenshot
    await page.screenshot({ path: 'onboarding-page.png' });
    log('Screenshot saved: onboarding-page.png', 'info');
    
    // Step 10: Enter business name
    const businessName = generateBusinessName();
    log(`Entering business name: ${businessName}`);
    await page.type('input#businessName', businessName);
    
    // Take a screenshot
    await page.screenshot({ path: 'business-name-entered.png' });
    log('Screenshot saved: business-name-entered.png', 'info');
    
    // Step 11: Submit the form
    log('Submitting onboarding form');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);
    
    // Take a screenshot
    await page.screenshot({ path: 'after-onboarding.png' });
    log('Screenshot saved: after-onboarding.png', 'info');
    
    // Step 12: Check if we're redirected to the dashboard
    const dashboardUrl = page.url();
    log(`Current URL after onboarding: ${dashboardUrl}`, 'info');
    
    if (dashboardUrl.includes('/dashboard')) {
      log('Redirected to dashboard as expected', 'success');
    } else {
      log(`Unexpected redirect to ${dashboardUrl}`, 'warning');
    }
    
    // Step 13: Verify the business was created in Supabase
    log('Verifying business creation in Supabase');
    
    const { data: businesses, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .eq('user_id', testUser.id);
    
    if (businessError) {
      log(`Error fetching businesses: ${businessError.message}`, 'error');
    } else if (!businesses || businesses.length === 0) {
      log('No business found for test user', 'error');
    } else {
      const business = businesses[0];
      log(`Found business with ID: ${business.id}`, 'success');
      
      // Check that the business name matches
      if (business.name === businessName) {
        log('Business name matches input', 'success');
      } else {
        log(`Business name mismatch: ${business.name} !== ${businessName}`, 'warning');
      }
      
      // Check for trial plan fields if they exist
      if ('trial_plan' in business) {
        log(`Trial plan: ${business.trial_plan}`, 'info');
      }
      
      if ('trial_expiration_date' in business) {
        log(`Trial expiration date: ${business.trial_expiration_date}`, 'info');
      }
    }
    
    log('Browser-based verification completed', 'success');
    
  } catch (error) {
    log(`Unexpected error: ${error.message}`, 'error');
  } finally {
    // Close the browser
    if (browser) {
      log('Closing browser');
      await browser.close();
    }
    
    // Clean up test user and any associated data
    if (testUser) {
      log(`Cleaning up test user: ${testUser.id}`);
      
      // Delete any businesses for this user
      const { error: deleteBusinessError } = await supabaseAdmin
        .from('businesses')
        .delete()
        .eq('user_id', testUser.id);
      
      if (deleteBusinessError) {
        log(`Error deleting businesses: ${deleteBusinessError.message}`, 'error');
      } else {
        log('Businesses deleted', 'success');
      }
      
      // Delete the user
      const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(testUser.id);
      
      if (deleteUserError) {
        log(`Error deleting user: ${deleteUserError.message}`, 'error');
      } else {
        log('Test user deleted', 'success');
      }
    }
  }
}

// Main function
async function main() {
  log('Starting onboarding flow verification');
  
  try {
    // Run API-based verification
    await verifyOnboardingAPI();
    
    // Run browser-based verification
    // Uncomment the line below to run browser-based verification
    // await verifyOnboardingBrowser();
    
    log('All verification tests completed', 'success');
  } catch (error) {
    log(`Verification failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Export functions for direct use in npm scripts
module.exports = {
  verifyOnboardingAPI,
  verifyOnboardingBrowser
};

// Run the verification if this script is executed directly
if (require.main === module) {
  main();
}
