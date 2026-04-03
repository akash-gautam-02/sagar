-- ============================================================
-- DigitalCore Auth System — Database Migration
-- Run this DIRECTLY in Supabase Dashboard > SQL Editor
-- ============================================================

-- Step 1: Cleanup (safe to re-run)
DROP TABLE IF EXISTS public.user_activity CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.inquiries CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.users_profile CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: users_profile table
CREATE TABLE public.users_profile (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: activity_logs table
CREATE TABLE public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users_profile(id) ON DELETE CASCADE,
  action TEXT NOT NULL,        -- 'login', 'logout', 'profile_update'
  ip_address TEXT,
  device_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Enable Row Level Security
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Step 5: RLS Policies
CREATE POLICY "users_view_own_profile" ON public.users_profile
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON public.users_profile
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "service_role_profile" ON public.users_profile
  FOR ALL TO service_role USING (true);

CREATE POLICY "users_view_own_logs" ON public.activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "service_role_logs" ON public.activity_logs
  FOR ALL TO service_role USING (true);

-- Step 6: Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profile (id, email, phone, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, ''), '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- Step 7: otps table (Crucial for serverless stability)
CREATE TABLE public.otps (
  identifier TEXT PRIMARY KEY,
  otp TEXT NOT NULL,
  expiry BIGINT NOT NULL,
  type TEXT NOT NULL, -- 'email' or 'phone'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 8: RLS for otps
ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_otps" ON public.otps FOR ALL TO service_role USING (true);
