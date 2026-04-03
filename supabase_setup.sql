-- Migration: Create otps and activity_logs tables
-- Run this in your Supabase SQL Editor

-- 1. Create OTPS table for auth
CREATE TABLE IF NOT EXISTS public.otps (
    identifier TEXT PRIMARY KEY,
    otp TEXT NOT NULL,
    expiry BIGINT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Activity Logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    ip_address TEXT,
    device_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Users Profile table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users_profile (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user',
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;

-- Note: The server uses 'service_role' or 'admin' context for auth logic, 
-- but you should define policies for users_profile to allow users to read/edit their own data.

CREATE POLICY "Users can view their own profile" 
ON public.users_profile FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.users_profile FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can view their own activity" 
ON public.activity_logs FOR SELECT 
USING (auth.uid() = user_id);
