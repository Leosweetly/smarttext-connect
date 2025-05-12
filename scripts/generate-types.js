/**
 * Script to generate TypeScript types from Supabase database
 * 
 * This script uses the Supabase CLI to generate TypeScript types
 * from your Supabase database schema.
 * 
 * Usage:
 * node scripts/generate-types.js
 * 
 * Requirements:
 * - Supabase CLI installed
 * - .env.local file with Supabase credentials
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

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
async function generateTypes() {
  log('Starting TypeScript type generation');
  
  // Check if Supabase CLI is installed
  try {
    execSync('supabase --version', { stdio: 'ignore' });
    log('Supabase CLI detected', 'success');
  } catch (error) {
    log('Supabase CLI not installed', 'error');
    log('Please install the Supabase CLI: npm install -g supabase', 'info');
    process.exit(1);
  }
  
  // Check if environment variables are set
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!SUPABASE_URL) {
    log('NEXT_PUBLIC_SUPABASE_URL is not set in .env.local', 'error');
    process.exit(1);
  }
  
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    log('SUPABASE_SERVICE_ROLE_KEY is not set in .env.local', 'error');
    log('This is required for generating types', 'error');
    process.exit(1);
  }
  
  // Extract project ID from URL
  const projectId = SUPABASE_URL.match(/https:\/\/([^.]+)\./)?.[1];
  
  if (!projectId) {
    log('Could not extract project ID from Supabase URL', 'error');
    process.exit(1);
  }
  
  log(`Generating types for project: ${projectId}`);
  
  try {
    // Create types directory if it doesn't exist
    const typesDir = path.join(__dirname, '..', 'types');
    if (!fs.existsSync(typesDir)) {
      fs.mkdirSync(typesDir, { recursive: true });
    }
    
    // Generate types
    const command = `supabase gen types typescript --project-id ${projectId} --schema public,auth > types/database.types.ts`;
    
    log('Running command: ' + command);
    execSync(command, { stdio: 'inherit' });
    
    log('Types generated successfully', 'success');
    log('Types saved to: types/database.types.ts', 'info');
  } catch (error) {
    log(`Error generating types: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run the main function
generateTypes();
