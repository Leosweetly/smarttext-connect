/**
 * Script to add trial plan fields to the businesses table
 * 
 * This script:
 * 1. Checks if the trial_plan and trial_expiration_date fields exist in the businesses table
 * 2. If they don't exist, provides SQL statements to add them
 * 3. Updates the database.types.ts file to include these fields
 * 
 * Usage:
 * node scripts/add-trial-plan-fields.js
 * 
 * Requirements:
 * - Supabase project with the schema.sql applied
 * - .env.local file with Supabase credentials
 * - SUPABASE_SERVICE_ROLE_KEY in .env.local for admin operations
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase admin client
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

// Main function
async function addTrialPlanFields() {
  log('Starting trial plan fields check');
  
  // Check if Supabase is configured
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    log('Supabase URL or service role key not found in .env.local', 'error');
    process.exit(1);
  }
  
  try {
    // Step 1: Check if the businesses table exists
    log('Checking if the businesses table exists');
    
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .limit(1);
    
    if (tableError) {
      log(`Error accessing businesses table: ${tableError.message}`, 'error');
      log('Please run the apply-schema.js script to create the businesses table', 'error');
      process.exit(1);
    }
    
    log('Businesses table exists', 'success');
    
    // Step 2: Check if the trial_plan and trial_expiration_date fields exist
    log('Checking if trial_plan and trial_expiration_date fields exist');
    
    if (!tableInfo || tableInfo.length === 0) {
      log('No businesses found. Creating a sample business to check schema.', 'warning');
      
      // Create a sample business to check the schema
      const { data: sampleBusiness, error: sampleError } = await supabaseAdmin
        .from('businesses')
        .insert({
          subscription_tier: '00000000-0000-0000-0000-000000000000',
          name: 'Sample Business',
          hours_json: {},
          faqs_json: []
        })
        .select()
        .single();
      
      if (sampleError) {
        log(`Error creating sample business: ${sampleError.message}`, 'error');
        process.exit(1);
      }
      
      tableInfo = [sampleBusiness];
      
      // Delete the sample business
      await supabaseAdmin
        .from('businesses')
        .delete()
        .eq('id', sampleBusiness.id);
      
      log('Deleted sample business', 'success');
    }
    
    const sampleRow = tableInfo[0];
    const hasTrialPlan = sampleRow && 'trial_plan' in sampleRow;
    const hasTrialExpirationDate = sampleRow && 'trial_expiration_date' in sampleRow;
    
    if (hasTrialPlan) {
      log('trial_plan field exists', 'success');
    } else {
      log('trial_plan field does not exist', 'warning');
      log('To add the trial_plan field, run the following SQL in the Supabase SQL editor:');
      log('ALTER TABLE public.businesses ADD COLUMN trial_plan BOOLEAN DEFAULT true;');
    }
    
    if (hasTrialExpirationDate) {
      log('trial_expiration_date field exists', 'success');
    } else {
      log('trial_expiration_date field does not exist', 'warning');
      log('To add the trial_expiration_date field, run the following SQL in the Supabase SQL editor:');
      log('ALTER TABLE public.businesses ADD COLUMN trial_expiration_date TIMESTAMP WITH TIME ZONE;');
    }
    
    // Step 3: Update the database.types.ts file
    log('Updating database.types.ts file');
    
    const typesFilePath = path.join(process.cwd(), 'types', 'database.types.ts');
    
    if (!fs.existsSync(typesFilePath)) {
      log(`File not found: ${typesFilePath}`, 'error');
      log('Please run the generate-types.js script to create the database.types.ts file', 'error');
      process.exit(1);
    }
    
    let typesContent = fs.readFileSync(typesFilePath, 'utf8');
    
    // Check if the types file already has the trial plan fields
    const hasTrialPlanType = typesContent.includes('trial_plan:');
    const hasTrialExpirationDateType = typesContent.includes('trial_expiration_date:');
    
    if (hasTrialPlanType && hasTrialExpirationDateType) {
      log('database.types.ts already has trial plan fields', 'success');
    } else {
      // Find the businesses table interface
      const businessesInterfaceRegex = /interface Database\s*{[^}]*public:\s*{[^}]*tables:\s*{[^}]*businesses:\s*{[^}]*Row:\s*{([^}]*)}/s;
      const match = typesContent.match(businessesInterfaceRegex);
      
      if (!match) {
        log('Could not find businesses table interface in database.types.ts', 'error');
        process.exit(1);
      }
      
      let businessesRow = match[1];
      
      // Add the trial_plan field if it doesn't exist
      if (!hasTrialPlanType) {
        businessesRow = businessesRow.trim();
        if (!businessesRow.endsWith('\n')) {
          businessesRow += '\n';
        }
        businessesRow += '      trial_plan: boolean | null\n';
      }
      
      // Add the trial_expiration_date field if it doesn't exist
      if (!hasTrialExpirationDateType) {
        businessesRow = businessesRow.trim();
        if (!businessesRow.endsWith('\n')) {
          businessesRow += '\n';
        }
        businessesRow += '      trial_expiration_date: string | null\n';
      }
      
      // Replace the businesses table interface
      typesContent = typesContent.replace(businessesInterfaceRegex, (match) => {
        return match.replace(/Row:\s*{([^}]*)}/s, `Row: {${businessesRow}}`);
      });
      
      // Write the updated content back to the file
      fs.writeFileSync(typesFilePath, typesContent);
      
      log('Updated database.types.ts with trial plan fields', 'success');
    }
    
    log('Trial plan fields check completed', 'success');
    
  } catch (error) {
    log(`Unexpected error: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run the function
addTrialPlanFields();
