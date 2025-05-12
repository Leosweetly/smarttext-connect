/**
 * Script to deploy the application to Vercel
 * 
 * This script helps with deploying the application to Vercel
 * by guiding the user through the process.
 * 
 * Usage:
 * node scripts/deploy-vercel.js
 * 
 * Requirements:
 * - Vercel CLI installed
 * - Git repository
 * - .env.local file with Supabase credentials
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
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

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Main function
async function deployToVercel() {
  log('Starting Vercel deployment process');
  
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    log('Vercel CLI detected', 'success');
  } catch (error) {
    log('Vercel CLI not installed', 'error');
    log('Please install the Vercel CLI: npm install -g vercel', 'info');
    process.exit(1);
  }
  
  // Check if Git is installed
  try {
    execSync('git --version', { stdio: 'ignore' });
    log('Git detected', 'success');
  } catch (error) {
    log('Git not installed', 'error');
    log('Please install Git: https://git-scm.com/downloads', 'info');
    process.exit(1);
  }
  
  // Check if the project is a Git repository
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    log('Git repository detected', 'success');
  } catch (error) {
    log('Not a Git repository', 'error');
    log('Please initialize a Git repository: git init', 'info');
    process.exit(1);
  }
  
  // Check if there are uncommitted changes
  try {
    const status = execSync('git status --porcelain').toString().trim();
    if (status) {
      log('Uncommitted changes detected', 'warning');
      
      rl.question('Do you want to commit these changes before deploying? (y/n): ', (answer) => {
        if (answer.toLowerCase() === 'y') {
          try {
            execSync('git add .', { stdio: 'inherit' });
            execSync('git commit -m "Prepare for Vercel deployment"', { stdio: 'inherit' });
            log('Changes committed', 'success');
            continueDeployment();
          } catch (error) {
            log(`Error committing changes: ${error.message}`, 'error');
            process.exit(1);
          }
        } else {
          log('Continuing without committing changes', 'warning');
          continueDeployment();
        }
      });
    } else {
      log('No uncommitted changes', 'success');
      continueDeployment();
    }
  } catch (error) {
    log(`Error checking Git status: ${error.message}`, 'error');
    process.exit(1);
  }
  
  function continueDeployment() {
    // Check if environment variables are set
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      log('Supabase environment variables not found in .env.local', 'warning');
      log('You will need to set these in the Vercel dashboard after deployment', 'warning');
    }
    
    // Ask if the user wants to deploy to production
    rl.question('Do you want to deploy to production? (y/n): ', (answer) => {
      const productionFlag = answer.toLowerCase() === 'y' ? '--prod' : '';
      
      log('Deploying to Vercel...');
      
      try {
        // Deploy to Vercel
        execSync(`vercel ${productionFlag}`, { stdio: 'inherit' });
        
        log('Deployment initiated', 'success');
        log('If this is your first deployment, follow the prompts in the Vercel CLI', 'info');
        log('After deployment, make sure to set your environment variables in the Vercel dashboard', 'info');
        
        // Remind about environment variables
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
          log('Remember to set these environment variables in the Vercel dashboard:', 'warning');
          log('NEXT_PUBLIC_SUPABASE_URL', 'warning');
          log('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'warning');
        }
      } catch (error) {
        log(`Error deploying to Vercel: ${error.message}`, 'error');
      }
      
      rl.close();
    });
  }
}

// Run the main function
deployToVercel();
