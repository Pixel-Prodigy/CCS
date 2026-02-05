-- Create shops table
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(255),
  logo_url TEXT,
  category VARCHAR(50) NOT NULL DEFAULT 'clothing',
  settings JSONB DEFAULT '{}',
  is_onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create profiles table (links auth.users to shops)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE
  SET NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'owner',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shops_slug ON shops(slug);
CREATE INDEX IF NOT EXISTS idx_shops_category ON shops(category);
CREATE INDEX IF NOT EXISTS idx_profiles_shop_id ON profiles(shop_id);
-- Enable RLS
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- Shops policies
-- Users can read their own shop
CREATE POLICY "Users can view own shop" ON shops FOR
SELECT USING (
    id IN (
      SELECT shop_id
      FROM profiles
      WHERE id = auth.uid()
    )
  );
-- Users can update their own shop
CREATE POLICY "Users can update own shop" ON shops FOR
UPDATE USING (
    id IN (
      SELECT shop_id
      FROM profiles
      WHERE id = auth.uid()
    )
  ) WITH CHECK (
    id IN (
      SELECT shop_id
      FROM profiles
      WHERE id = auth.uid()
    )
  );
-- Users can insert a shop (during onboarding)
CREATE POLICY "Authenticated users can create shop" ON shops FOR
INSERT TO authenticated WITH CHECK (true);
-- Profiles policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR
SELECT USING (id = auth.uid());
-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles FOR
UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());
-- Users can insert their own profile
CREATE POLICY "Users can create own profile" ON profiles FOR
INSERT TO authenticated WITH CHECK (id = auth.uid());
-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.profiles (id, full_name)
VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Triggers for updated_at
CREATE TRIGGER update_shops_updated_at BEFORE
UPDATE ON shops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE
UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();