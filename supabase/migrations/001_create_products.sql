-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  color VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  location VARCHAR(100),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes for filtering
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_color ON products(color);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_product_code ON products(product_code);
-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- Policy: Anyone can read products (for kiosk)
CREATE POLICY "Public read access" ON products FOR
SELECT USING (true);
-- Policy: Only authenticated users can insert
CREATE POLICY "Authenticated insert" ON products FOR
INSERT TO authenticated WITH CHECK (true);
-- Policy: Only authenticated users can update
CREATE POLICY "Authenticated update" ON products FOR
UPDATE TO authenticated USING (true) WITH CHECK (true);
-- Policy: Only authenticated users can delete
CREATE POLICY "Authenticated delete" ON products FOR DELETE TO authenticated USING (true);