-- Add shop_id to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS shop_id UUID REFERENCES shops(id) ON DELETE CASCADE;
-- Create index for shop_id
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON products(shop_id);
-- Drop existing policies
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Authenticated insert" ON products;
DROP POLICY IF EXISTS "Authenticated update" ON products;
DROP POLICY IF EXISTS "Authenticated delete" ON products;
-- New RLS policies for multi-tenant products
-- Public can read products from any shop (for kiosk)
CREATE POLICY "Public read products" ON products FOR
SELECT USING (true);
-- Users can only insert products for their own shop
CREATE POLICY "Users insert own shop products" ON products FOR
INSERT TO authenticated WITH CHECK (
    shop_id IN (
      SELECT shop_id
      FROM profiles
      WHERE id = auth.uid()
    )
  );
-- Users can only update products from their own shop
CREATE POLICY "Users update own shop products" ON products FOR
UPDATE TO authenticated USING (
    shop_id IN (
      SELECT shop_id
      FROM profiles
      WHERE id = auth.uid()
    )
  ) WITH CHECK (
    shop_id IN (
      SELECT shop_id
      FROM profiles
      WHERE id = auth.uid()
    )
  );
-- Users can only delete products from their own shop
CREATE POLICY "Users delete own shop products" ON products FOR DELETE TO authenticated USING (
  shop_id IN (
    SELECT shop_id
    FROM profiles
    WHERE id = auth.uid()
  )
);
-- Make product_code unique per shop (not globally)
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_product_code_key;
ALTER TABLE products
ADD CONSTRAINT products_product_code_shop_unique UNIQUE (shop_id, product_code);