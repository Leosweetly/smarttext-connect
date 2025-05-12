-- Updated schema.sql file for SmartText application
-- This file includes:
-- 1. The businesses table with the correct column names
-- 2. The trial_plan and trial_expiration_date fields
-- 3. The conversations and missed_calls tables with appropriate RLS policies

-- Create businesses table
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_tier UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    hours_json JSONB,
    faqs_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    trial_plan BOOLEAN DEFAULT true,
    trial_expiration_date TIMESTAMP WITH TIME ZONE
);

-- Add trial plan fields if they don't exist
DO $$
BEGIN
    BEGIN
        ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS trial_plan BOOLEAN DEFAULT true;
    EXCEPTION WHEN duplicate_column THEN
        RAISE NOTICE 'Column trial_plan already exists in businesses table';
    END;
    
    BEGIN
        ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS trial_expiration_date TIMESTAMP WITH TIME ZONE;
    EXCEPTION WHEN duplicate_column THEN
        RAISE NOTICE 'Column trial_expiration_date already exists in businesses table';
    END;
END $$;

-- Create index on subscription_tier for faster lookups
CREATE INDEX IF NOT EXISTS businesses_subscription_tier_idx ON public.businesses(subscription_tier);

-- Enable Row Level Security
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Allow users to read their own business
CREATE POLICY "User can read their own business"
ON public.businesses
FOR SELECT
USING (subscription_tier = auth.uid());

-- Allow users to insert their own business
CREATE POLICY "User can insert their own business"
ON public.businesses
FOR INSERT
WITH CHECK (subscription_tier = auth.uid());

-- Allow users to update their own business
CREATE POLICY "User can update their own business"
ON public.businesses
FOR UPDATE
USING (subscription_tier = auth.uid());

-- Allow users to delete their own business
CREATE POLICY "User can delete their own business"
ON public.businesses
FOR DELETE
USING (subscription_tier = auth.uid());

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_businesses_updated_at
BEFORE UPDATE ON public.businesses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create conversations table
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

-- Create RLS policies for conversations

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

-- Create trigger to automatically update the updated_at column for conversations
CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create missed_calls table
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

-- Create RLS policies for missed_calls

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

-- Create trigger to automatically update the updated_at column for missed_calls
CREATE TRIGGER update_missed_calls_updated_at
BEFORE UPDATE ON public.missed_calls
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add security settings for email-only authentication
-- Disable signups with passwords (we're using OTP/magic links only)
UPDATE auth.config
SET enable_signup_with_password = false
WHERE id = 1;

-- Add comments to explain the security model
COMMENT ON TABLE public.businesses IS 'Stores business information with row-level security based on subscription_tier';
COMMENT ON TABLE public.conversations IS 'Stores customer conversations with row-level security based on business_id';
COMMENT ON TABLE public.missed_calls IS 'Stores missed calls with row-level security based on business_id';
