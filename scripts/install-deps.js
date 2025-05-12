/**
 * Script to install dependencies for the project
 * 
 * This script installs the necessary dependencies for the project
 * and verifies that they are installed correctly.
 * 
 * Usage:
 * node scripts/install-deps.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
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
async function installDependencies() {
  log('Starting dependency installation');
  
  // Check if package.json exists
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log('package.json not found', 'error');
    process.exit(1);
  }
  
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  log('Read package.json successfully', 'success');
  
  // Get dependencies
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};
  
  const totalDependencies = Object.keys(dependencies).length + Object.keys(devDependencies).length;
  log(`Found ${totalDependencies} dependencies to install`);
  
  // Ask user which package manager to use
  console.log('\n');
  console.log('Which package manager would you like to use?');
  console.log('1. npm');
  console.log('2. yarn');
  console.log('3. pnpm');
  console.log('4. bun');
  
  rl.question('\nEnter your choice (1-4): ', async (choice) => {
    let packageManager;
    let installCommand;
    
    switch (choice) {
      case '1':
        packageManager = 'npm';
        installCommand = 'npm install';
        break;
      case '2':
        packageManager = 'yarn';
        installCommand = 'yarn';
        break;
      case '3':
        packageManager = 'pnpm';
        installCommand = 'pnpm install';
        break;
      case '4':
        packageManager = 'bun';
        installCommand = 'bun install';
        break;
      default:
        log('Invalid choice, defaulting to npm', 'warning');
        packageManager = 'npm';
        installCommand = 'npm install';
        break;
    }
    
    log(`Using ${packageManager} to install dependencies`);
    
    try {
      // Check if package manager is installed
      try {
        execSync(`${packageManager} --version`, { stdio: 'ignore' });
      } catch (error) {
        log(`${packageManager} is not installed`, 'error');
        log(`Please install ${packageManager} and try again`, 'info');
        rl.close();
        process.exit(1);
      }
      
      // Install dependencies
      log(`Installing dependencies with ${packageManager}...`);
      execSync(installCommand, { stdio: 'inherit' });
      
      log('Dependencies installed successfully', 'success');
      
      // Check if Next.js is installed
      try {
        const nextPath = path.join(__dirname, '..', 'node_modules', 'next');
        if (fs.existsSync(nextPath)) {
          log('Next.js installed successfully', 'success');
        } else {
          log('Next.js not found in node_modules', 'warning');
        }
      } catch (error) {
        log('Error checking Next.js installation', 'warning');
      }
      
      // Check if Supabase is installed
      try {
        const supabasePath = path.join(__dirname, '..', 'node_modules', '@supabase');
        if (fs.existsSync(supabasePath)) {
          log('Supabase installed successfully', 'success');
        } else {
          log('Supabase not found in node_modules', 'warning');
        }
      } catch (error) {
        log('Error checking Supabase installation', 'warning');
      }
      
      // Suggest next steps
      log('Next steps:', 'info');
      log('1. Create a .env.local file with your Supabase credentials', 'info');
      log('2. Run "npm run test:connection" to test your Supabase connection', 'info');
      log('3. Run "npm run apply:schema" to apply the database schema', 'info');
      log('4. Run "npm run dev" to start the development server', 'info');
      
    } catch (error) {
      log(`Error installing dependencies: ${error.message}`, 'error');
    }
    
    rl.close();
  });
}

// Run the main function
installDependencies();
