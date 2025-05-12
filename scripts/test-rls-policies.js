/**
 * Test script for Row Level Security (RLS) policies
 * 
 * This script tests:
 * 1. RLS policies on the businesses table
 * 2. RLS policies on the conversations table
 * 3. RLS policies on the missed_calls table
 * 
 * Usage:
 * node scripts/test-rls-policies.js
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

// Test emails
const TEST_EMAIL_1 = 'test1@example.com';
const TEST_EMAIL_2 = 'test2@example.com';

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
  log('Starting RLS policy tests');
  
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
    // Step 1: Clean up any existing test users
    log('Cleaning up existing test users');
    
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    
    const testUser1 = existingUsers?.users?.find(user => user.email === TEST_EMAIL_1);
    const testUser2 = existingUsers?.users?.find(user => user.email === TEST_EMAIL_2);
    
    if (testUser1) {
      log(`Found existing test user 1: ${testUser1.id}`, 'warning');
      
      // Delete any businesses for this user
      const { error: deleteBusinessError } = await supabaseAdmin
        .from('businesses')
        .delete()
        .eq('subscription_tier', testUser1.id);
      
      if (deleteBusinessError) {
        log(`Error deleting businesses: ${deleteBusinessError.message}`, 'error');
      } else {
        log('Deleted any existing businesses for test user 1', 'success');
      }
      
      // Delete the user
      const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(testUser1.id);
      
      if (deleteUserError) {
        log(`Error deleting user: ${deleteUserError.message}`, 'error');
      } else {
        log('Deleted test user 1', 'success');
      }
    }
    
    if (testUser2) {
      log(`Found existing test user 2: ${testUser2.id}`, 'warning');
      
      // Delete any businesses for this user
      const { error: deleteBusinessError } = await supabaseAdmin
        .from('businesses')
        .delete()
        .eq('subscription_tier', testUser2.id);
      
      if (deleteBusinessError) {
        log(`Error deleting businesses: ${deleteBusinessError.message}`, 'error');
      } else {
        log('Deleted any existing businesses for test user 2', 'success');
      }
      
      // Delete the user
      const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(testUser2.id);
      
      if (deleteUserError) {
        log(`Error deleting user: ${deleteUserError.message}`, 'error');
      } else {
        log('Deleted test user 2', 'success');
      }
    }
    
    // Step 2: Create two test users
    log('Creating test users');
    
    const { data: signUpData1, error: signUpError1 } = await supabaseAdmin.auth.admin.createUser({
      email: TEST_EMAIL_1,
      email_confirm: true,
      user_metadata: { name: 'Test User 1' }
    });
    
    if (signUpError1) {
      log(`Error creating test user 1: ${signUpError1.message}`, 'error');
      process.exit(1);
    }
    
    const userId1 = signUpData1.user.id;
    log(`Created test user 1 with ID: ${userId1}`, 'success');
    
    const { data: signUpData2, error: signUpError2 } = await supabaseAdmin.auth.admin.createUser({
      email: TEST_EMAIL_2,
      email_confirm: true,
      user_metadata: { name: 'Test User 2' }
    });
    
    if (signUpError2) {
      log(`Error creating test user 2: ${signUpError2.message}`, 'error');
      process.exit(1);
    }
    
    const userId2 = signUpData2.user.id;
    log(`Created test user 2 with ID: ${userId2}`, 'success');
    
    // Step 3: Create businesses for both users
    log('Creating businesses for test users');
    
    // Calculate trial expiration date (14 days from now)
    const trialExpirationDate = new Date();
    trialExpirationDate.setDate(trialExpirationDate.getDate() + 14);
    
    const business1Data = {
      subscription_tier: userId1,
      name: 'Test Business 1',
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
      // ordering_instructions field doesn't exist in the actual database
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
      // trial_plan and trial_expiration_date fields don't exist in the actual database
    };
    
    const { data: business1, error: business1Error } = await supabaseAdmin
      .from('businesses')
      .insert(business1Data)
      .select()
      .single();
    
    if (business1Error) {
      log(`Error creating business 1: ${business1Error.message}`, 'error');
      process.exit(1);
    }
    
    log(`Created business 1 with ID: ${business1.id}`, 'success');
    
    const business2Data = {
      subscription_tier: userId2,
      name: 'Test Business 2',
      hours_json: {
        Monday: { open: '08:00', close: '16:00' },
        Tuesday: { open: '08:00', close: '16:00' },
        Wednesday: { open: '08:00', close: '16:00' },
        Thursday: { open: '08:00', close: '16:00' },
        Friday: { open: '08:00', close: '16:00' },
        Saturday: { open: '09:00', close: '14:00' },
        Sunday: { open: '09:00', close: '14:00' }
      },
      faqs_json: [
        { question: 'What are your hours?', answer: 'We are open 8-4 weekdays and 9-2 weekends.' },
        { question: 'Do you offer refunds?', answer: 'Yes, within 30 days of purchase.' }
      ],
      // ordering_instructions field doesn't exist in the actual database
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
      // trial_plan and trial_expiration_date fields don't exist in the actual database
    };
    
    const { data: business2, error: business2Error } = await supabaseAdmin
      .from('businesses')
      .insert(business2Data)
      .select()
      .single();
    
    if (business2Error) {
      log(`Error creating business 2: ${business2Error.message}`, 'error');
      process.exit(1);
    }
    
    log(`Created business 2 with ID: ${business2.id}`, 'success');
    
    // Step 4: Create conversations and missed calls for both businesses
    log('Creating conversations and missed calls for both businesses');
    
    // Create a conversation for business 1
    const conversation1Data = {
      business_id: business1.id,
      customer_name: 'John Smith',
      customer_phone: '(555) 123-4567',
      last_message: 'When will my order be ready?',
      last_message_time: new Date().toISOString(),
      unread: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: conversation1, error: conversation1Error } = await supabaseAdmin
      .from('conversations')
      .insert(conversation1Data)
      .select()
      .single();
    
    if (conversation1Error) {
      log(`Error creating conversation for business 1: ${conversation1Error.message}`, 'error');
    } else {
      log(`Created conversation for business 1 with ID: ${conversation1.id}`, 'success');
    }
    
    // Create a conversation for business 2
    const conversation2Data = {
      business_id: business2.id,
      customer_name: 'Jane Doe',
      customer_phone: '(555) 987-6543',
      last_message: 'Do you have any appointments available tomorrow?',
      last_message_time: new Date().toISOString(),
      unread: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: conversation2, error: conversation2Error } = await supabaseAdmin
      .from('conversations')
      .insert(conversation2Data)
      .select()
      .single();
    
    if (conversation2Error) {
      log(`Error creating conversation for business 2: ${conversation2Error.message}`, 'error');
    } else {
      log(`Created conversation for business 2 with ID: ${conversation2.id}`, 'success');
    }
    
    // Create a missed call for business 1
    const missedCall1Data = {
      business_id: business1.id,
      phone_number: '(555) 234-5678',
      call_time: new Date().toISOString(),
      duration: '0:15',
      status: 'Not Called Back',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: missedCall1, error: missedCall1Error } = await supabaseAdmin
      .from('missed_calls')
      .insert(missedCall1Data)
      .select()
      .single();
    
    if (missedCall1Error) {
      log(`Error creating missed call for business 1: ${missedCall1Error.message}`, 'error');
    } else {
      log(`Created missed call for business 1 with ID: ${missedCall1.id}`, 'success');
    }
    
    // Create a missed call for business 2
    const missedCall2Data = {
      business_id: business2.id,
      phone_number: '(555) 876-5432',
      call_time: new Date().toISOString(),
      duration: '0:22',
      status: 'Not Called Back',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: missedCall2, error: missedCall2Error } = await supabaseAdmin
      .from('missed_calls')
      .insert(missedCall2Data)
      .select()
      .single();
    
    if (missedCall2Error) {
      log(`Error creating missed call for business 2: ${missedCall2Error.message}`, 'error');
    } else {
      log(`Created missed call for business 2 with ID: ${missedCall2.id}`, 'success');
    }
    
    // Step 5: Test RLS policies by signing in as user 1 and trying to access user 2's data
    log('Testing RLS policies');
    
    // Get a session for user 1 using the admin API
    log('Getting session for user 1 using admin API');
    
    // Create a temporary password for the user
    const tempPassword = 'TemporaryPassword123!';
    
    // Update the user with a temporary password
    const { error: updateUserError } = await supabaseAdmin.auth.admin.updateUserById(
      userId1,
      { password: tempPassword }
    );
    
    if (updateUserError) {
      log(`Error updating user with temporary password: ${updateUserError.message}`, 'error');
      process.exit(1);
    }
    
    // Sign in with the temporary password
    const { data: { session: session1 }, error: signInError1 } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL_1,
      password: tempPassword
    });
    
    if (signInError1) {
      log(`Error signing in with temporary password: ${signInError1.message}`, 'error');
      process.exit(1);
    }
    
    log('Created session for user 1 successfully', 'success');
    
    // Create a client with user 1's session
    const supabaseUser1 = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${session1.access_token}`
        }
      }
    });
    
    // Test 1: User 1 should be able to access their own business
    const { data: user1Business, error: user1BusinessError } = await supabaseUser1
      .from('businesses')
      .select('*')
      .eq('subscription_tier', userId1);
    
    if (user1BusinessError) {
      log(`Error: User 1 could not access their own business: ${user1BusinessError.message}`, 'error');
    } else {
      log('User 1 successfully accessed their own business', 'success');
    }
    
    // Test 2: User 1 should NOT be able to access user 2's business
    const { data: user2Business, error: user2BusinessError } = await supabaseUser1
      .from('businesses')
      .select('*')
      .eq('id', business2.id)
      .single();
    
    if (user2BusinessError && user2BusinessError.code === 'PGRST116') {
      log('RLS policy correctly prevented user 1 from accessing user 2\'s business', 'success');
    } else if (!user2BusinessError) {
      log('RLS policy failed! User 1 was able to access user 2\'s business', 'error');
      log(`Accessed business: ${JSON.stringify(user2Business)}`, 'error');
    } else {
      log(`Unexpected error: ${user2BusinessError.message}`, 'warning');
    }
    
    // Test 3: User 1 should be able to access their own conversations
    const { data: user1Conversations, error: user1ConversationsError } = await supabaseUser1
      .from('conversations')
      .select('*')
      .eq('business_id', business1.id);
    
    if (user1ConversationsError) {
      log(`Error: User 1 could not access their own conversations: ${user1ConversationsError.message}`, 'error');
    } else {
      log('User 1 successfully accessed their own conversations', 'success');
    }
    
    // Test 4: User 1 should NOT be able to access user 2's conversations
    const { data: user2Conversations, error: user2ConversationsError } = await supabaseUser1
      .from('conversations')
      .select('*')
      .eq('business_id', business2.id);
    
    if (user2Conversations && user2Conversations.length === 0) {
      log('RLS policy correctly prevented user 1 from accessing user 2\'s conversations', 'success');
    } else if (user2Conversations && user2Conversations.length > 0) {
      log('RLS policy failed! User 1 was able to access user 2\'s conversations', 'error');
      log(`Accessed conversations: ${JSON.stringify(user2Conversations)}`, 'error');
    } else {
      log(`Unexpected error: ${user2ConversationsError?.message}`, 'warning');
    }
    
    // Test 5: User 1 should be able to access their own missed calls
    const { data: user1MissedCalls, error: user1MissedCallsError } = await supabaseUser1
      .from('missed_calls')
      .select('*')
      .eq('business_id', business1.id);
    
    if (user1MissedCallsError) {
      log(`Error: User 1 could not access their own missed calls: ${user1MissedCallsError.message}`, 'error');
    } else {
      log('User 1 successfully accessed their own missed calls', 'success');
    }
    
    // Test 6: User 1 should NOT be able to access user 2's missed calls
    const { data: user2MissedCalls, error: user2MissedCallsError } = await supabaseUser1
      .from('missed_calls')
      .select('*')
      .eq('business_id', business2.id);
    
    if (user2MissedCalls && user2MissedCalls.length === 0) {
      log('RLS policy correctly prevented user 1 from accessing user 2\'s missed calls', 'success');
    } else if (user2MissedCalls && user2MissedCalls.length > 0) {
      log('RLS policy failed! User 1 was able to access user 2\'s missed calls', 'error');
      log(`Accessed missed calls: ${JSON.stringify(user2MissedCalls)}`, 'error');
    } else {
      log(`Unexpected error: ${user2MissedCallsError?.message}`, 'warning');
    }
    
    // Test 7: User 1 should be able to update their own business
    const updateData = {
      name: 'Updated Test Business 1'
    };
    
    const { data: updatedBusiness, error: updateError } = await supabaseUser1
      .from('businesses')
      .update(updateData)
      .eq('subscription_tier', userId1)
      .select();
    
    if (updateError) {
      log(`Error: User 1 could not update their own business: ${updateError.message}`, 'error');
    } else {
      log('User 1 successfully updated their own business', 'success');
      log(`Updated business name: ${updatedBusiness.name}`, 'success');
    }
    
    // Test 8: User 1 should NOT be able to update user 2's business
    const updateData2 = {
      name: 'Hacked Business 2'
    };
    
    const { data: updatedBusiness2, error: updateError2 } = await supabaseUser1
      .from('businesses')
      .update(updateData2)
      .eq('id', business2.id)
      .select()
      .single();
    
    if (updateError2 && updateError2.code === 'PGRST116') {
      log('RLS policy correctly prevented user 1 from updating user 2\'s business', 'success');
    } else if (!updateError2) {
      log('RLS policy failed! User 1 was able to update user 2\'s business', 'error');
      log(`Updated business: ${JSON.stringify(updatedBusiness2)}`, 'error');
    } else {
      log(`Unexpected error: ${updateError2.message}`, 'warning');
    }
    
    // All tests passed
    log('All RLS policy tests completed!', 'success');
    log(`Test user 1 email: ${TEST_EMAIL_1}`, 'info');
    log(`Test user 1 ID: ${userId1}`, 'info');
    log(`Test user 2 email: ${TEST_EMAIL_2}`, 'info');
    log(`Test user 2 ID: ${userId2}`, 'info');
    
  } catch (error) {
    log(`Unexpected error: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run the tests
runTests();
