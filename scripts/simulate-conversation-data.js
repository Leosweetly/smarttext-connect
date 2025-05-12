/**
 * Script to simulate conversation and missed call data
 * 
 * This script creates sample data for:
 * 1. Conversations
 * 2. Missed calls
 * 
 * Usage:
 * node scripts/simulate-conversation-data.js
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

// Sample data
const customerNames = [
  'John Smith',
  'Jane Doe',
  'Michael Johnson',
  'Emily Williams',
  'David Brown',
  'Sarah Miller',
  'Robert Wilson',
  'Jennifer Taylor',
  'William Davis',
  'Elizabeth Anderson'
];

const phoneNumbers = [
  '(555) 123-4567',
  '(555) 234-5678',
  '(555) 345-6789',
  '(555) 456-7890',
  '(555) 567-8901',
  '(555) 678-9012',
  '(555) 789-0123',
  '(555) 890-1234',
  '(555) 901-2345',
  '(555) 012-3456'
];

const messages = [
  'When will my order be ready?',
  'Do you have any appointments available tomorrow?',
  'I need to reschedule my appointment.',
  'What are your hours today?',
  'Do you offer delivery services?',
  'I have a question about my recent purchase.',
  'Can I get a refund for my order?',
  'Is the item I ordered in stock?',
  'I need to speak with a manager.',
  'Thank you for your help!'
];

const durations = [
  '0:15',
  '0:22',
  '0:31',
  '0:45',
  '1:03',
  '1:17',
  '1:28',
  '1:42',
  '2:05',
  '2:30'
];

const statuses = [
  'Not Called Back',
  'Called Back',
  'Left Voicemail',
  'Requires Follow-up',
  'Resolved'
];

// Function to get a random item from an array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to get a random date within the last 7 days
function getRandomRecentDate() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  now.setDate(now.getDate() - daysAgo);
  now.setHours(now.getHours() - hoursAgo);
  now.setMinutes(now.getMinutes() - minutesAgo);
  
  return now.toISOString();
}

// Main function
async function simulateData() {
  log('Starting data simulation');
  
  // Check if Supabase is configured
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    log('Supabase URL or service role key not found in .env.local', 'error');
    process.exit(1);
  }
  
  try {
    // Step 1: Get all businesses
    log('Fetching businesses');
    
    const { data: businesses, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id, name, subscription_tier');
    
    if (businessError) {
      log(`Error fetching businesses: ${businessError.message}`, 'error');
      process.exit(1);
    }
    
    if (!businesses || businesses.length === 0) {
      log('No businesses found. Please create at least one business before running this script.', 'error');
      process.exit(1);
    }
    
    log(`Found ${businesses.length} businesses`, 'success');
    
    // Step 2: Check if conversations and missed_calls tables exist
    log('Checking for conversations and missed_calls tables');
    
    // Check if the conversations table exists
    log('Checking if the conversations table exists');
    
    try {
      const { data: conversationsData, error: conversationsError } = await supabaseAdmin
        .from('conversations')
        .select('*')
        .limit(1);
      
      if (conversationsError && conversationsError.message.includes('relation "conversations" does not exist')) {
        log('Conversations table does not exist', 'warning');
        log('To create the conversations table, run the following SQL in the Supabase SQL editor:');
        log(`
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  last_message TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  unread BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create index on business_id for faster lookups
CREATE INDEX IF NOT EXISTS conversations_business_id_idx ON public.conversations(business_id);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Allow users to read their own conversations
CREATE POLICY "User can read their own conversations"
ON public.conversations
FOR SELECT
USING (business_id IN (
  SELECT id FROM public.businesses WHERE subscription_tier = auth.uid()
));

-- Allow users to insert their own conversations
CREATE POLICY "User can insert their own conversations"
ON public.conversations
FOR INSERT
WITH CHECK (business_id IN (
  SELECT id FROM public.businesses WHERE subscription_tier = auth.uid()
));

-- Allow users to update their own conversations
CREATE POLICY "User can update their own conversations"
ON public.conversations
FOR UPDATE
USING (business_id IN (
  SELECT id FROM public.businesses WHERE subscription_tier = auth.uid()
));

-- Allow users to delete their own conversations
CREATE POLICY "User can delete their own conversations"
ON public.conversations
FOR DELETE
USING (business_id IN (
  SELECT id FROM public.businesses WHERE subscription_tier = auth.uid()
));
        `);
      } else if (!conversationsError) {
        log('Conversations table exists', 'success');
      } else {
        log(`Error checking conversations table: ${conversationsError.message}`, 'error');
      }
    } catch (error) {
      log(`Error checking conversations table: ${error.message}`, 'error');
    }
    
    // Check if the missed_calls table exists
    log('Checking if the missed_calls table exists');
    
    try {
      const { data: missedCallsData, error: missedCallsError } = await supabaseAdmin
        .from('missed_calls')
        .select('*')
        .limit(1);
      
      if (missedCallsError && missedCallsError.message.includes('relation "missed_calls" does not exist')) {
        log('Missed calls table does not exist', 'warning');
        log('To create the missed_calls table, run the following SQL in the Supabase SQL editor:');
        log(`
CREATE TABLE IF NOT EXISTS public.missed_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  call_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  duration TEXT,
  status TEXT DEFAULT 'Not Called Back',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create index on business_id for faster lookups
CREATE INDEX IF NOT EXISTS missed_calls_business_id_idx ON public.missed_calls(business_id);

-- Enable Row Level Security
ALTER TABLE public.missed_calls ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Allow users to read their own missed calls
CREATE POLICY "User can read their own missed calls"
ON public.missed_calls
FOR SELECT
USING (business_id IN (
  SELECT id FROM public.businesses WHERE subscription_tier = auth.uid()
));

-- Allow users to insert their own missed calls
CREATE POLICY "User can insert their own missed calls"
ON public.missed_calls
FOR INSERT
WITH CHECK (business_id IN (
  SELECT id FROM public.businesses WHERE subscription_tier = auth.uid()
));

-- Allow users to update their own missed calls
CREATE POLICY "User can update their own missed calls"
ON public.missed_calls
FOR UPDATE
USING (business_id IN (
  SELECT id FROM public.businesses WHERE subscription_tier = auth.uid()
));

-- Allow users to delete their own missed calls
CREATE POLICY "User can delete their own missed calls"
ON public.missed_calls
FOR DELETE
USING (business_id IN (
  SELECT id FROM public.businesses WHERE subscription_tier = auth.uid()
));
        `);
      } else if (!missedCallsError) {
        log('Missed calls table exists', 'success');
      } else {
        log(`Error checking missed_calls table: ${missedCallsError.message}`, 'error');
      }
    } catch (error) {
      log(`Error checking missed_calls table: ${error.message}`, 'error');
    }
    
    // Step 3: Create sample conversations for each business
    log('Creating sample conversations');
    
    for (const business of businesses) {
      // Create 3-5 conversations per business
      const numConversations = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < numConversations; i++) {
        const conversationData = {
          business_id: business.id,
          customer_name: getRandomItem(customerNames),
          customer_phone: getRandomItem(phoneNumbers),
          last_message: getRandomItem(messages),
          last_message_time: getRandomRecentDate(),
          unread: Math.random() > 0.5, // 50% chance of being unread
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        try {
          const { data: conversation, error: conversationError } = await supabaseAdmin
            .from('conversations')
            .insert(conversationData)
            .select()
            .single();
          
          if (conversationError) {
            if (conversationError.message && conversationError.message.includes('relation "conversations" does not exist')) {
              log('Conversations table does not exist. Please create it manually.', 'error');
              break;
            } else {
              log(`Error creating conversation for business ${business.name}: ${conversationError.message || 'Unknown error'}`, 'error');
            }
          } else if (conversation) {
            log(`Created conversation for business ${business.name} with ID: ${conversation.id}`, 'success');
          } else {
            log(`Unknown error creating conversation for business ${business.name}`, 'error');
          }
        } catch (error) {
          log(`Error creating conversation: ${error.message}`, 'error');
        }
      }
    }
    
    // Step 4: Create sample missed calls for each business
    log('Creating sample missed calls');
    
    for (const business of businesses) {
      // Create 3-5 missed calls per business
      const numMissedCalls = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < numMissedCalls; i++) {
        const missedCallData = {
          business_id: business.id,
          phone_number: getRandomItem(phoneNumbers),
          call_time: getRandomRecentDate(),
          duration: getRandomItem(durations),
          status: getRandomItem(statuses),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        try {
          const { data: missedCall, error: missedCallError } = await supabaseAdmin
            .from('missed_calls')
            .insert(missedCallData)
            .select()
            .single();
          
          if (missedCallError) {
            if (missedCallError.message && missedCallError.message.includes('relation "missed_calls" does not exist')) {
              log('Missed calls table does not exist. Please create it manually.', 'error');
              break;
            } else {
              log(`Error creating missed call for business ${business.name}: ${missedCallError.message || 'Unknown error'}`, 'error');
            }
          } else if (missedCall) {
            log(`Created missed call for business ${business.name} with ID: ${missedCall.id}`, 'success');
          } else {
            log(`Unknown error creating missed call for business ${business.name}`, 'error');
          }
        } catch (error) {
          log(`Error creating missed call: ${error.message}`, 'error');
        }
      }
    }
    
    log('Data simulation completed', 'success');
    
  } catch (error) {
    log(`Unexpected error: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run the simulation
simulateData();
