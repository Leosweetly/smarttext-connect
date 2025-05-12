#!/usr/bin/env node

/**
 * Test script for the trial activation flow
 * 
 * This script tests the trial activation flow by:
 * 1. Creating a test user
 * 2. Activating a trial for the user
 * 3. Verifying the trial was activated correctly
 * 
 * Usage:
 *   node scripts/test-trial-activation.js
 */

const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test data
const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'password123',
  businessName: 'Test Business',
  twilioNumber: '+18186519003',
  subscriptionTier: 'free'
};

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Log a step in the test process
 */
function logStep(step, message) {
  console.log(`\n${colors.bright}${colors.blue}Step ${step}:${colors.reset} ${message}`);
}

/**
 * Log a success message
 */
function logSuccess(message) {
  console.log(`${colors.green}✓ ${message}${colors.reset}`);
}

/**
 * Log an error message
 */
function logError(message, error) {
  console.error(`${colors.red}✗ ${message}${colors.reset}`);
  if (error) {
    console.error(`  ${colors.dim}${error.message || error}${colors.reset}`);
  }
}

/**
 * Log data for debugging
 */
function logData(label, data) {
  console.log(`${colors.cyan}${label}:${colors.reset}`, JSON.stringify(data, null, 2));
}

/**
 * Create a test user
 */
async function createTestUser() {
  logStep(1, 'Creating test user');
  
  try {
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      email_confirm: true
    });
    
    if (userError) {
      throw userError;
    }
    
    logSuccess(`Created test user: ${userData.user.email} (ID: ${userData.user.id})`);
    return userData.user;
  } catch (error) {
    logError('Failed to create test user', error);
    throw error;
  }
}

/**
 * Activate a trial for the test user
 */
async function activateTrial(userId) {
  logStep(2, 'Activating trial for test user');
  
  try {
    // Calculate trial expiration date (14 days from now)
    const trialExpirationDate = new Date();
    trialExpirationDate.setDate(trialExpirationDate.getDate() + 14);
    
    // Create business record with trial
    const { data: businessData, error: businessError } = await supabase
      .from('businesses')
      .insert({
        user_id: userId,
        name: testUser.businessName,
        trial_plan: true,
        trial_expiration_date: trialExpirationDate.toISOString(),
        subscription_tier: testUser.subscriptionTier,
        twilio_number: testUser.twilioNumber
      })
      .select()
      .single();
    
    if (businessError) {
      throw businessError;
    }
    
    logSuccess(`Activated trial for business: ${businessData.name} (ID: ${businessData.id})`);
    logData('Business data', businessData);
    
    return businessData;
  } catch (error) {
    logError('Failed to activate trial', error);
    throw error;
  }
}

/**
 * Verify the trial was activated correctly
 */
async function verifyTrial(userId, businessId) {
  logStep(3, 'Verifying trial activation');
  
  try {
    // Get the business record
    const { data: businessData, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();
    
    if (businessError) {
      throw businessError;
    }
    
    // Verify trial_plan is true
    if (businessData.trial_plan !== true) {
      throw new Error(`Expected trial_plan to be true, got ${businessData.trial_plan}`);
    }
    
    // Verify trial_expiration_date is in the future
    const trialExpirationDate = new Date(businessData.trial_expiration_date);
    const now = new Date();
    if (trialExpirationDate <= now) {
      throw new Error(`Expected trial_expiration_date to be in the future, got ${businessData.trial_expiration_date}`);
    }
    
    // Verify trial_expiration_date is approximately 14 days from now
    const daysUntilExpiration = Math.round((trialExpirationDate - now) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiration < 13 || daysUntilExpiration > 15) {
      throw new Error(`Expected trial_expiration_date to be ~14 days from now, got ${daysUntilExpiration} days`);
    }
    
    logSuccess('Trial activation verified successfully');
    logData('Verification details', {
      trial_plan: businessData.trial_plan,
      trial_expiration_date: businessData.trial_expiration_date,
      days_until_expiration: daysUntilExpiration
    });
    
    return true;
  } catch (error) {
    logError('Trial verification failed', error);
    throw error;
  }
}

/**
 * Clean up test data
 */
async function cleanUp(userId, businessId) {
  logStep(4, 'Cleaning up test data');
  
  try {
    // Delete business record
    if (businessId) {
      const { error: deleteBusinessError } = await supabase
        .from('businesses')
        .delete()
        .eq('id', businessId);
      
      if (deleteBusinessError) {
        throw deleteBusinessError;
      }
      
      logSuccess(`Deleted business record: ${businessId}`);
    }
    
    // Delete user
    if (userId) {
      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(userId);
      
      if (deleteUserError) {
        throw deleteUserError;
      }
      
      logSuccess(`Deleted user: ${userId}`);
    }
    
    return true;
  } catch (error) {
    logError('Clean up failed', error);
    // Don't throw here, as we want the script to continue even if cleanup fails
    return false;
  }
}

/**
 * Run the test
 */
async function runTest() {
  console.log(`\n${colors.bright}${colors.yellow}=== Testing Trial Activation Flow ===${colors.reset}\n`);
  
  let userId = null;
  let businessId = null;
  
  try {
    // Create test user
    const user = await createTestUser();
    userId = user.id;
    
    // Activate trial
    const business = await activateTrial(userId);
    businessId = business.id;
    
    // Verify trial
    await verifyTrial(userId, businessId);
    
    console.log(`\n${colors.bright}${colors.green}=== Test Completed Successfully ===${colors.reset}\n`);
  } catch (error) {
    console.error(`\n${colors.bright}${colors.red}=== Test Failed ===${colors.reset}\n`);
    console.error(`${colors.red}Error: ${error.message || error}${colors.reset}\n`);
  } finally {
    // Clean up
    await cleanUp(userId, businessId);
  }
}

// Run the test
runTest();
