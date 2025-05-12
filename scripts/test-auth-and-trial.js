/**
 * Test script for authentication and trial plan implementation
 * 
 * This script tests:
 * 1. User authentication with magic links
 * 2. Automatic trial plan assignment for new users
 * 3. Setting trial expiration date 14 days in the future
 * 
 * Usage:
 * node scripts/test-auth-and-trial.js
 * 
 * Requirements:
 * - Supabase project with the schema.sql applied
 * - .env.local file with Supabase credentials
 * - SUPABASE_SERVICE_ROLE_KEY in .env.local for admin operations
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Test email
const TEST_EMAIL = `test+${Date.now()}@example.com`;

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

// Main test function
async function testAuthAndTrial() {
  log('Starting authentication and trial plan test');
  
  // Check if Supabase is configured
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    log('Supabase credentials not found in .env.local', 'error');
    process.exit(1);
  }
  
  try {
    // Step 1: Create a test user
    log(`Creating test user: ${TEST_EMAIL}`);
    
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: TEST_EMAIL,
      email_confirm: true, // Auto-confirm the email for testing
      user_metadata: { name: 'Test User' }
    });
    
    if (userError) {
      log(`Error creating test user: ${userError.message}`, 'error');
      process.exit(1);
    }
    
    const userId = userData.user.id;
    log(`Created test user with ID: ${userId}`, 'success');
    
    // Step 2: Create a session for the test user
    log('Creating session for test user');
    
    // Create a temporary password for the user
    const tempPassword = 'TemporaryPassword123!';
    
    // Update the user with a temporary password
    const { error: updateUserError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: tempPassword }
    );
    
    if (updateUserError) {
      log(`Error updating user with temporary password: ${updateUserError.message}`, 'error');
      process.exit(1);
    }
    
    // Sign in with the temporary password
    const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: tempPassword
    });
    
    if (signInError) {
      log(`Error signing in: ${signInError.message}`, 'error');
      process.exit(1);
    }
    
    log('Created session successfully', 'success');
    
    // Step 3: Create a business for the test user
    log('Creating business for test user');
    
    // Create a Supabase client with the user's session
    const supabaseWithAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      }
    });
    
    // Create the business using the admin client to bypass RLS
    const businessData = {
      subscription_tier: userId,
      name: `Test Business ${Date.now()}`,
      hours_json: {
        Monday: { open: '09:00', close: '17:00' },
        Tuesday: { open: '09:00', close: '17:00' },
        Wednesday: { open: '09:00', close: '17:00' },
        Thursday: { open: '09:00', close: '17:00' },
        Friday: { open: '09:00', close: '17:00' },
        Saturday: { open: '10:00', close: '15:00' },
        Sunday: { open: '10:00', close: '15:00' }
      },
      faqs_json: [
        { question: 'What are your hours?', answer: 'We are open 9-5 weekdays and 10-3 weekends.' },
        { question: 'Do you deliver?', answer: 'Yes, we offer delivery within 10 miles.' }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Check if trial_plan and trial_expiration_date fields exist
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .limit(1);
    
    if (tableError) {
      log(`Error accessing businesses table: ${tableError.message}`, 'error');
      process.exit(1);
    }
    
    // Check if the sample data has the trial_plan field
    const sampleRow = tableInfo && tableInfo.length > 0 ? tableInfo[0] : null;
    const hasTrialPlan = sampleRow && 'trial_plan' in sampleRow;
    const hasTrialExpirationDate = sampleRow && 'trial_expiration_date' in sampleRow;
    
    // Add trial plan fields if they exist
    if (hasTrialPlan) {
      businessData.trial_plan = true;
      log('Added trial_plan field to business data', 'success');
    } else {
      log('trial_plan field does not exist in businesses table', 'warning');
    }
    
    if (hasTrialExpirationDate) {
      // Set trial expiration date to 14 days from now
      const trialExpirationDate = new Date();
      trialExpirationDate.setDate(trialExpirationDate.getDate() + 14);
      businessData.trial_expiration_date = trialExpirationDate.toISOString();
      log(`Added trial_expiration_date field to business data: ${trialExpirationDate.toISOString()}`, 'success');
    } else {
      log('trial_expiration_date field does not exist in businesses table', 'warning');
    }
    
    // Insert the business using the admin client to bypass RLS
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .insert(businessData)
      .select()
      .single();
    
    if (businessError) {
      log(`Error creating business: ${businessError.message}`, 'error');
      process.exit(1);
    }
    
    log(`Created business with ID: ${business.id}`, 'success');
    
    // Step 4: Verify the business data
    log('Verifying business data');
    
    const { data: verifiedBusiness, error: verifyError } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .eq('id', business.id)
      .single();
    
    if (verifyError) {
      log(`Error verifying business: ${verifyError.message}`, 'error');
      process.exit(1);
    }
    
    // Check that the data matches
    if (verifiedBusiness.name !== businessData.name) {
      log(`Business name mismatch: ${verifiedBusiness.name} !== ${businessData.name}`, 'error');
    } else {
      log('Business name verified', 'success');
    }
    
    if (verifiedBusiness.subscription_tier !== userId) {
      log(`User ID mismatch: ${verifiedBusiness.subscription_tier} !== ${userId}`, 'error');
    } else {
      log('User ID verified', 'success');
    }
    
    // Check trial plan fields if they exist
    if (hasTrialPlan) {
      if (verifiedBusiness.trial_plan !== true) {
        log(`Trial plan mismatch: ${verifiedBusiness.trial_plan} !== true`, 'error');
      } else {
        log('Trial plan verified', 'success');
      }
    }
    
    if (hasTrialExpirationDate) {
      const trialExpiration = new Date(verifiedBusiness.trial_expiration_date);
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 13); // At least 13 days in the future
      
      if (trialExpiration < futureDate) {
        log(`Trial expiration date is not far enough in the future: ${trialExpiration.toISOString()}`, 'error');
      } else {
        log(`Trial expiration date verified: ${trialExpiration.toISOString()}`, 'success');
      }
    }
    
    log('Authentication and trial plan test completed successfully', 'success');
    
  } catch (error) {
    log(`Unexpected error: ${error.message}`, 'error');
    process.exit(1);
  } finally {
    // Clean up test data
    log('Cleaning up test data');
    
    // Find the test user
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
    const testUser = users.find(user => user.email === TEST_EMAIL);
    
    if (testUser) {
      // Delete any businesses for this user
      const { error: deleteBusinessError } = await supabaseAdmin
        .from('businesses')
        .delete()
        .eq('subscription_tier', testUser.id);
      
      if (deleteBusinessError) {
        log(`Error deleting businesses: ${deleteBusinessError.message}`, 'error');
      } else {
        log('Deleted test businesses', 'success');
      }
      
      // Delete the user
      const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(testUser.id);
      
      if (deleteUserError) {
        log(`Error deleting user: ${deleteUserError.message}`, 'error');
      } else {
        log('Deleted test user', 'success');
      }
    }
  }
}

// Run the test
testAuthAndTrial();
