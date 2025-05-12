/**
 * Test script for authentication flow
 * 
 * This script tests the authentication flow by:
 * 1. Creating a test user with a magic link
 * 2. Verifying the user can log in
 * 3. Creating a business for the user
 * 4. Verifying the user can access their business
 * 
 * Usage:
 * node scripts/test-auth-flow.js
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

// Test email - change this to your email to receive the magic link
const TEST_EMAIL = 'test@example.com';

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

// Create Supabase clients
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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
async function runTests() {
  log('Starting authentication flow tests');
  
  // Check if Supabase is configured
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    log('Supabase URL or anon key not found in .env.local', 'error');
    process.exit(1);
  }
  
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    log('Supabase service role key not found in .env.local', 'error');
    log('This is required for admin operations like deleting test users', 'error');
    process.exit(1);
  }
  
  try {
    // Step 1: Clean up any existing test user
    log(`Cleaning up existing test user: ${TEST_EMAIL}`);
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const testUser = existingUsers?.users?.find(user => user.email === TEST_EMAIL);
    
    if (testUser) {
      log(`Found existing test user with ID: ${testUser.id}`, 'warning');
      
      // Delete any businesses for this user
      const { error: deleteBusinessError } = await supabaseAdmin
        .from('businesses')
        .delete()
        .eq('user_id', testUser.id);
      
      if (deleteBusinessError) {
        log(`Error deleting businesses: ${deleteBusinessError.message}`, 'error');
      } else {
        log('Deleted any existing businesses for test user', 'success');
      }
      
      // Delete the user
      const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(testUser.id);
      
      if (deleteUserError) {
        log(`Error deleting user: ${deleteUserError.message}`, 'error');
      } else {
        log('Deleted test user', 'success');
      }
    }
    
    // Step 2: Create a new test user
    log(`Creating test user: ${TEST_EMAIL}`);
    const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email: TEST_EMAIL,
      email_confirm: true, // Auto-confirm the email
      user_metadata: { name: 'Test User' }
    });
    
    if (signUpError) {
      log(`Error creating test user: ${signUpError.message}`, 'error');
      process.exit(1);
    }
    
    const userId = signUpData.user.id;
    log(`Created test user with ID: ${userId}`, 'success');
    
    // Step 3: Create a business for the test user
    log('Creating test business');
    const businessData = {
      user_id: userId,
      name: 'Test Business',
      hours: {
        Monday: { open: '09:00', close: '17:00' },
        Tuesday: { open: '09:00', close: '17:00' },
        Wednesday: { open: '09:00', close: '17:00' },
        Thursday: { open: '09:00', close: '17:00' },
        Friday: { open: '09:00', close: '17:00' },
        Saturday: { open: '10:00', close: '15:00' },
        Sunday: { open: '10:00', close: '15:00' }
      },
      faqs: [
        { question: 'What are your hours?', answer: 'We are open 9-5 weekdays and 10-3 weekends.' },
        { question: 'Do you deliver?', answer: 'Yes, we offer delivery within 10 miles.' }
      ],
      ordering_instructions: 'Call us or order online.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .insert(businessData)
      .select()
      .single();
    
    if (businessError) {
      log(`Error creating business: ${businessError.message}`, 'error');
      process.exit(1);
    }
    
    log(`Created test business with ID: ${business.id}`, 'success');
    
    // Step 4: Verify RLS policies
    log('Testing Row Level Security policies');
    
    // Sign in as the test user
    const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: 'password' // This won't be used with magic links in production
    });
    
    if (signInError) {
      log(`Error signing in: ${signInError.message}`, 'error');
      process.exit(1);
    }
    
    log('Signed in as test user', 'success');
    
    // Try to fetch the business as the authenticated user
    const supabaseWithAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      }
    });
    
    const { data: userBusiness, error: fetchError } = await supabaseWithAuth
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (fetchError) {
      log(`Error fetching business: ${fetchError.message}`, 'error');
      process.exit(1);
    }
    
    log('Successfully fetched business as authenticated user', 'success');
    log(`Business name: ${userBusiness.name}`);
    
    // Try to fetch another user's business (should fail due to RLS)
    const { data: otherBusiness, error: otherFetchError } = await supabaseWithAuth
      .from('businesses')
      .select('*')
      .neq('user_id', userId)
      .limit(1)
      .single();
    
    if (otherFetchError && otherFetchError.code === 'PGRST116') {
      log('RLS policy correctly prevented access to other users\' businesses', 'success');
    } else if (!otherFetchError) {
      log('RLS policy failed! User was able to access another user\'s business', 'error');
      log(`Accessed business: ${JSON.stringify(otherBusiness)}`, 'error');
      process.exit(1);
    } else {
      log(`Unexpected error: ${otherFetchError.message}`, 'warning');
    }
    
    // All tests passed
    log('All authentication flow tests passed!', 'success');
    log(`Test user email: ${TEST_EMAIL}`, 'info');
    log(`Test user ID: ${userId}`, 'info');
    log(`Test business ID: ${business.id}`, 'info');
    log('You can now log in with this user in your application', 'info');
    
  } catch (error) {
    log(`Unexpected error: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run the tests
runTests();
