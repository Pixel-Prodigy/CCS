-- Add size column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS size VARCHAR(10);
-- Create index for size filtering
CREATE INDEX IF NOT EXISTS idx_products_size ON products(size);