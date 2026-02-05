-- Create storage bucket for product images
-- NOTE: Run this in Supabase Dashboard > Storage or via Supabase CLI
-- Storage bucket: product-images
-- Settings:
--   - Public bucket: YES (for public image URLs)
--   - File size limit: 5MB
--   - Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
-- Storage policies (run in SQL editor):
-- Allow public read access to product images
CREATE POLICY "Public read access for product images" ON storage.objects FOR
SELECT USING (bucket_id = 'product-images');
-- Allow authenticated users to upload product images
CREATE POLICY "Authenticated upload for product images" ON storage.objects FOR
INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
-- Allow authenticated users to update product images
CREATE POLICY "Authenticated update for product images" ON storage.objects FOR
UPDATE TO authenticated USING (bucket_id = 'product-images');
-- Allow authenticated users to delete product images
CREATE POLICY "Authenticated delete for product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images');