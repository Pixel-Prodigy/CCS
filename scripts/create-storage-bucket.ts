/**
 * Script to create the product-images storage bucket in Supabase
 * Run with: pnpm setup:storage
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables:");
  console.error("- NEXT_PUBLIC_SUPABASE_URL");
  console.error("- SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createBucket() {
  console.log("Creating product-images bucket...");

  const { data, error } = await supabase.storage.createBucket(
    "product-images",
    {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    }
  );

  if (error) {
    if (error.message.includes("already exists")) {
      console.log("✓ Bucket 'product-images' already exists");
      return;
    }
    console.error("Error creating bucket:", error.message);
    process.exit(1);
  }

  console.log("✓ Bucket 'product-images' created successfully!");
  console.log(data);
}

createBucket();
