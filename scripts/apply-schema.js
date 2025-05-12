/**
 * Script to apply the schema.sql to a Supabase project
 * 
 * This script reads the schema.sql file and applies it to a Supabase project
 * using the Supabase CLI or the Supabase dashboard.
 * 
 * Usage:
 * node scripts/apply-schema.js
 * 
 * Requirements:
 * - Supabase CLI installed (optional)
 * - .env.local file with Supabase credentials
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

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

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Main function
async function applySchema() {
  log('Starting schema application process');
  
  // Check if schema.sql exists
  const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    log('schema.sql not found at ' + schemaPath, 'error');
    process.exit(1);
  }
  
  // Read schema.sql
  const schema = fs.readFileSync(schemaPath, 'utf8');
  log('Read schema.sql successfully', 'success');
  
  // Check if Supabase CLI is installed
  let hasSupabaseCLI = false;
  try {
    execSync('supabase --version', { stdio: 'ignore' });
    hasSupabaseCLI = true;
    log('Supabase CLI detected', 'info');
  } catch (error) {
    log('Supabase CLI not detected', 'warning');
  }
  
  // Ask user how they want to apply the schema
  console.log('\n');
  console.log('How would you like to apply the schema?');
  console.log('1. Copy SQL to clipboard (for pasting into Supabase dashboard)');
  if (hasSupabaseCLI) {
    console.log('2. Apply using Supabase CLI');
  }
  console.log('3. Show SQL in console');
  console.log('4. Exit');
  
  rl.question('\nEnter your choice (1-4): ', async (choice) => {
    switch (choice) {
      case '1':
        try {
          // Copy to clipboard
          if (process.platform === 'darwin') { // macOS
            execSync(`echo "${schema}" | pbcopy`);
          } else if (process.platform === 'win32') { // Windows
            execSync(`echo ${schema} | clip`);
          } else { // Linux
            execSync(`echo "${schema}" | xclip -selection clipboard`);
          }
          log('Schema copied to clipboard', 'success');
          log('Paste this into the SQL editor in your Supabase dashboard', 'info');
        } catch (error) {
          log('Failed to copy to clipboard: ' + error.message, 'error');
          log('Here is the schema to copy manually:', 'info');
          console.log('\n' + schema);
        }
        break;
        
      case '2':
        if (hasSupabaseCLI) {
          log('Applying schema using Supabase CLI...', 'info');
          
          rl.question('Enter your Supabase project ID: ', (projectId) => {
            try {
              // Create a temporary file with the schema
              const tempFile = path.join(__dirname, 'temp-schema.sql');
              fs.writeFileSync(tempFile, schema);
              
              // Apply the schema
              execSync(`supabase db push --db-url postgresql://postgres:postgres@localhost:54322/postgres --project-id ${projectId}`, {
                stdio: 'inherit'
              });
              
              // Remove the temporary file
              fs.unlinkSync(tempFile);
              
              log('Schema applied successfully', 'success');
            } catch (error) {
              log('Failed to apply schema: ' + error.message, 'error');
            }
            rl.close();
          });
          return;
        } else {
          log('Supabase CLI not installed. Please install it first.', 'error');
          rl.close();
        }
        break;
        
      case '3':
        // Show SQL in console
        console.log('\n' + colors.fg.yellow + 'SQL SCHEMA:' + colors.reset);
        console.log(schema);
        log('Copy this SQL and run it in your Supabase SQL editor', 'info');
        break;
        
      case '4':
      default:
        log('Exiting...', 'info');
        break;
    }
    
    rl.close();
  });
}

// Run the main function
applySchema();
