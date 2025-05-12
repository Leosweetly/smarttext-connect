-- Create businesses table
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    hours JSONB,
    faqs JSONB,
    ordering_instructions TEXT,
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

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS businesses_user_id_idx ON public.businesses(user_id);

-- Enable Row Level Security
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Allow users to read their own business
CREATE POLICY "User can read their own business"
ON public.businesses
FOR SELECT
USING (user_id = auth.uid());

-- Allow users to insert their own business
CREATE POLICY "User can insert their own business"
ON public.businesses
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Allow users to update their own business
CREATE POLICY "User can update their own business"
ON public.businesses
FOR UPDATE
USING (user_id = auth.uid());

-- Allow users to delete their own business
CREATE POLICY "User can delete their own business"
ON public.businesses
FOR DELETE
USING (user_id = auth.uid());

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

-- Add security settings for email-only authentication
-- Disable signups with passwords (we're using OTP/magic links only)
UPDATE auth.config
SET enable_signup_with_password = false
WHERE id = 1;

-- Add comment to explain the security model
COMMENT ON TABLE public.businesses IS 'Stores business information with row-level security based on user_id';
