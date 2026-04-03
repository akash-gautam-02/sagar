-- PRD Section 5: Database Schema (Supabase PostgreSQL)
-- Run this in your Supabase SQL Editor

-- 1. Create custom users table for persistence
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY, -- Linked to auth.users.id
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    auth_provider TEXT CHECK (auth_provider IN ('email', 'phone')),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Note: In Supabase, the server code often uses the 'service_role' or a custom role 
-- set in the client settings. To allow users to view their own data:
CREATE POLICY "Users can view their own record" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

-- Allow server-side service_role to manage all (automatic if using service_role key)
