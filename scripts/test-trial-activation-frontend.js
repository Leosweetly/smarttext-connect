#!/usr/bin/env node

/**
 * Test script for trial activation frontend integration
 * This script tests the complete trial activation flow
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testTrialActivationFlow() {
  console.log('🧪 Testing Trial Activation Frontend Integration\n');

  try {
    // Test 1: Check if API endpoint exists
    console.log('1. Testing API endpoint availability...');
    try {
      const response = await fetch('http://localhost:3000/api/create-business-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      if (response.status === 401) {
        console.log('✅ API endpoint exists and requires authentication');
      } else {
        console.log(`⚠️  API endpoint returned status: ${response.status}`);
      }
    } catch (error) {
      console.log('❌ API endpoint not accessible. Make sure the dev server is running.');
      console.log('   Run: npm run dev');
      return;
    }

    // Test 2: Check database schema
    console.log('\n2. Checking database schema...');
    
    const { data: businesses, error: businessError } = await supabase
      .from('businesses')
      .select('id, trial_plan, trial_expiration_date')
      .limit(1);
    
    if (businessError) {
      console.log('❌ Database schema issue:', businessError.message);
      return;
    }
    
    console.log('✅ Database schema is correct');

    // Test 3: Check for existing test user
    console.log('\n3. Checking for test users...');
    
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.log('❌ Cannot access users:', userError.message);
      return;
    }
    
    const testUsers = users.users.filter(user => 
      user.email && user.email.includes('test')
    );
    
    console.log(`✅ Found ${testUsers.length} test users`);

    // Test 4: Check trial businesses
    console.log('\n4. Checking existing trial businesses...');
    
    const { data: trialBusinesses, error: trialError } = await supabase
      .from('businesses')
      .select('*')
      .eq('trial_plan', true);
    
    if (trialError) {
      console.log('❌ Cannot query trial businesses:', trialError.message);
      return;
    }
    
    console.log(`✅ Found ${trialBusinesses.length} trial businesses`);
    
    if (trialBusinesses.length > 0) {
      console.log('\nTrial businesses:');
      trialBusinesses.forEach(business => {
        const expirationDate = new Date(business.trial_expiration_date);
        const daysRemaining = Math.ceil((expirationDate - new Date()) / (1000 * 60 * 60 * 24));
        console.log(`  - ${business.name}: ${daysRemaining} days remaining`);
      });
    }

    // Test 5: Frontend component checks
    console.log('\n5. Checking frontend components...');
    
    const fs = require('fs');
    const path = require('path');
    
    const componentsToCheck = [
      'app/(protected)/onboarding/components/TrialActivationForm.tsx',
      'app/success/page.tsx',
      'app/(protected)/dashboard/page.tsx',
      'app/pricing/page.tsx'
    ];
    
    let allComponentsExist = true;
    
    componentsToCheck.forEach(componentPath => {
      if (fs.existsSync(path.join(process.cwd(), componentPath))) {
        console.log(`✅ ${componentPath} exists`);
      } else {
        console.log(`❌ ${componentPath} missing`);
        allComponentsExist = false;
      }
    });
    
    if (allComponentsExist) {
      console.log('✅ All required frontend components exist');
    }

    // Test 6: Check for required dependencies
    console.log('\n6. Checking dependencies...');
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = ['zod', 'lucide-react', '@supabase/auth-helpers-nextjs'];
    
    let allDepsInstalled = true;
    
    requiredDeps.forEach(dep => {
      if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
        console.log(`✅ ${dep} is installed`);
      } else {
        console.log(`❌ ${dep} is missing`);
        allDepsInstalled = false;
      }
    });
    
    if (allDepsInstalled) {
      console.log('✅ All required dependencies are installed');
    }

    console.log('\n🎉 Trial Activation Frontend Integration Test Complete!');
    console.log('\n📋 Manual Testing Steps:');
    console.log('1. Start the dev server: npm run dev');
    console.log('2. Visit http://localhost:3000');
    console.log('3. Click "Start Free Trial"');
    console.log('4. Sign up with a test email');
    console.log('5. Complete the trial activation form');
    console.log('6. Verify success page shows trial information');
    console.log('7. Check dashboard shows trial status banner');
    console.log('8. Verify business appears in Supabase database');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run the test
testTrialActivationFlow();
