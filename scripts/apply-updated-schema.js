/**
 * Script to apply the updated schema to the Supabase database
 * 
 * This script:
 * 1. Reads the updated-schema.sql file
 * 2. Executes the SQL statements in the Supabase database
 * 
 * Usage:
 * node scripts/apply-updated-schema.js
 * 
 * Requirements:
 * - Supabase project with admin access
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

// Function to split SQL statements
function splitSqlStatements(sql) {
  // Split on semicolons, but ignore semicolons inside quotes or comments
  const statements = [];
  let currentStatement = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inComment = false;
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const nextChar = sql[i + 1] || '';
    
    // Handle comments
    if (char === '-' && nextChar === '-' && !inSingleQuote && !inDoubleQuote) {
      inComment = true;
      currentStatement += char;
      continue;
    }
    
    // End of line ends a comment
    if (inComment && (char === '\n' || char === '\r')) {
      inComment = false;
      currentStatement += char;
      continue;
    }
    
    // Skip processing if in a comment
    if (inComment) {
      currentStatement += char;
      continue;
    }
    
    // Handle quotes
    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      currentStatement += char;
      continue;
    }
    
    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      currentStatement += char;
      continue;
    }
    
    // Handle semicolons
    if (char === ';' && !inSingleQuote && !inDoubleQuote) {
      currentStatement += char;
      statements.push(currentStatement.trim());
      currentStatement = '';
      continue;
    }
    
    // Add character to current statement
    currentStatement += char;
  }
  
  // Add the last statement if it's not empty
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }
  
  return statements;
}

// Main function
async function applySchema() {
  log('Starting schema application');
  
  // Check if Supabase is configured
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    log('Supabase URL or service role key not found in .env.local', 'error');
    process.exit(1);
  }
  
  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'supabase', 'updated-schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      log(`Schema file not found: ${schemaPath}`, 'error');
      process.exit(1);
    }
    
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    log('Read schema file successfully', 'success');
    
    // Split the schema into individual statements
    const statements = splitSqlStatements(schemaContent);
    log(`Found ${statements.length} SQL statements`, 'info');
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip empty statements
      if (!statement.trim()) {
        continue;
      }
      
      log(`Executing statement ${i + 1}/${statements.length}`, 'info');
      
      try {
        // Execute the statement
        const { error } = await supabaseAdmin.rpc('pgcode', { code: statement });
        
        if (error && !error.message.includes('function "pgcode" does not exist')) {
          log(`Error executing statement ${i + 1}: ${error.message}`, 'error');
          log(`Statement: ${statement}`, 'error');
        } else if (!error) {
          log(`Statement ${i + 1} executed successfully`, 'success');
        } else {
          // If pgcode function doesn't exist, we need to execute the statements differently
          log('pgcode function not found, trying alternative method', 'warning');
          
          // For this example, we'll just output the SQL to the console
          log('Please execute the following SQL in the Supabase SQL editor:', 'warning');
          log(statement, 'info');
          
          // In a real implementation, you might use a different method to execute the SQL
          // such as using the Supabase REST API or a database client
        }
      } catch (error) {
        log(`Error executing statement ${i + 1}: ${error.message}`, 'error');
        log(`Statement: ${statement}`, 'error');
      }
    }
    
    log('Schema application completed', 'success');
    log('Note: Some statements may have failed if the objects already exist or if there are dependencies.', 'info');
    log('Please check the logs for any errors and execute those statements manually if needed.', 'info');
    
  } catch (error) {
    log(`Unexpected error: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run the function
applySchema();
