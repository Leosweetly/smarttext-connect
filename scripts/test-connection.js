/**
 * Test script for Supabase connection
 * 
 * This script tests the connection to your Supabase project
 * and verifies that your environment variables are set up correctly.
 * 
 * Usage:
 * node scripts/test-connection.js
 * 
 * Requirements:
 * - .env.local file with Supabase credentials
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

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
async function testConnection() {
  log('Starting Supabase connection test');
  
  // Check if environment variables are set
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!SUPABASE_URL) {
    log('NEXT_PUBLIC_SUPABASE_URL is not set in .env.local', 'error');
    process.exit(1);
  }
  
  if (!SUPABASE_ANON_KEY) {
    log('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in .env.local', 'error');
    process.exit(1);
  }
  
  log('Environment variables found', 'success');
  log(`Supabase URL: ${SUPABASE_URL}`);
  
  // Create Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  try {
    // Test connection with a simple query
    log('Testing connection to Supabase...');
    const { data, error } = await supabase.from('businesses').select('count()', { count: 'exact', head: true });
    
    if (error) {
      log(`Connection error: ${error.message}`, 'error');
      
      if (error.code === '42P01') {
        log('The "businesses" table does not exist. Have you run the schema.sql file?', 'warning');
        log('Run "npm run apply:schema" to apply the schema', 'info');
      }
      
      process.exit(1);
    }
    
    log('Successfully connected to Supabase!', 'success');
    log(`Found ${data[0].count} businesses in the database`);
    
    // Test service role key if available
    if (SUPABASE_SERVICE_ROLE_KEY) {
      log('Testing connection with service role key...');
      const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      try {
        // Try to list users (requires service role)
        const { data: users, error: adminError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (adminError) {
          log(`Service role key error: ${adminError.message}`, 'error');
        } else {
          log('Successfully connected with service role key!', 'success');
          log(`Found ${users.users.length} users in the auth system`);
        }
      } catch (err) {
        log(`Error using service role key: ${err.message}`, 'error');
      }
    } else {
      log('SUPABASE_SERVICE_ROLE_KEY is not set in .env.local', 'warning');
      log('This is required for admin operations like creating test users', 'warning');
    }
    
    // All tests passed
    log('All connection tests completed!', 'success');
    
  } catch (err) {
    log(`Unexpected error: ${err.message}`, 'error');
    process.exit(1);
  }
}

// Run the main function
testConnection();
