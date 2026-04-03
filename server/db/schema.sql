-- Database setup for Digital Core Platform
-- Copy and run this in the Supabase SQL Editor

-- 1. Users table (extended profile)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  phone TEXT UNIQUE,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'client',  -- 'client' | 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Sessions/Activity log
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT,   -- 'login', 'page_view', etc.
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Service Inquiries (Contact form data)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  service TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',  -- pending|replied|closed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- User can only see their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Activity log policies
CREATE POLICY "Users can view own activity" ON public.user_activity
  FOR SELECT USING (auth.uid() = user_id);

-- Inquiries policies
CREATE POLICY "Users can view own inquiries" ON public.inquiries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can submit inquiry" ON public.inquiries
  FOR INSERT WITH CHECK (true);

-- 5. Profile Sync Trigger
-- Automatically create/update public.users when auth.users is modified
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, phone, email, full_name)
  VALUES (
    NEW.id, 
    NEW.phone, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
