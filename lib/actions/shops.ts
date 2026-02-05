"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getUser, getProfile } from "./auth";
import type { Shop } from "@/lib/types";

const shopSchema = z.object({
  name: z.string().min(2, "Shop name must be at least 2 characters"),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  category: z.string().min(1, "Please select a category"),
});

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .concat("-", Math.random().toString(36).substring(2, 8));
}

export async function createShop(formData: FormData) {
  const user = await getUser();
  if (!user) {
    return { error: "You must be logged in to create a shop" };
  }

  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    postal_code: formData.get("postal_code") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    category: formData.get("category") as string,
  };

  const result = shopSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  // Use admin client to bypass RLS for shop creation
  // This is safe because we've already verified user authentication above
  const adminClient = createAdminClient();

  // Create the shop
  const { data: shop, error: shopError } = await adminClient
    .from("shops")
    .insert({
      name: data.name,
      slug: generateSlug(data.name),
      description: data.description || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      postal_code: data.postal_code || null,
      phone: data.phone || null,
      email: data.email || null,
      category: data.category,
      is_onboarded: false,
    })
    .select()
    .single();

  if (shopError) {
    console.error("Shop creation error:", shopError);
    return { error: "Failed to create shop. Please try again." };
  }

  // Link the shop to the user's profile
  const { error: profileError } = await adminClient
    .from("profiles")
    .update({ shop_id: shop.id })
    .eq("id", user.id);

  if (profileError) {
    console.error("Profile update error:", profileError);
    // Try to clean up the shop
    await adminClient.from("shops").delete().eq("id", shop.id);
    return { error: "Failed to link shop to your account. Please try again." };
  }

  return { success: true, shop };
}

export async function completeOnboarding() {
  const profile = await getProfile();

  if (!profile?.shop_id) {
    return { error: "No shop found. Please create a shop first." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("shops")
    .update({ is_onboarded: true })
    .eq("id", profile.shop_id);

  if (error) {
    console.error("Onboarding completion error:", error);
    return { error: "Failed to complete onboarding. Please try again." };
  }

  redirect("/admin");
}

export async function updateShop(formData: FormData) {
  const profile = await getProfile();

  if (!profile?.shop_id) {
    return { error: "No shop found" };
  }

  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    postal_code: formData.get("postal_code") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    category: formData.get("category") as string,
  };

  const result = shopSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("shops")
    .update({
      name: data.name,
      description: data.description || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      postal_code: data.postal_code || null,
      phone: data.phone || null,
      email: data.email || null,
      category: data.category,
    })
    .eq("id", profile.shop_id);

  if (error) {
    console.error("Shop update error:", error);
    return { error: "Failed to update shop. Please try again." };
  }

  return { success: true };
}

export async function getShopStats() {
  const profile = await getProfile();

  if (!profile?.shop_id) {
    return {
      totalProducts: 0,
      lowStockCount: 0,
      categoriesCount: 0,
      totalValue: 0,
    };
  }

  const supabase = await createClient();

  // Get all products for this shop
  const { data: products, error } = await supabase
    .from("products")
    .select("price, stock, category")
    .eq("shop_id", profile.shop_id);

  if (error || !products) {
    return {
      totalProducts: 0,
      lowStockCount: 0,
      categoriesCount: 0,
      totalValue: 0,
    };
  }

  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock < 5).length;
  const categories = new Set(products.map((p) => p.category));
  const categoriesCount = categories.size;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return {
    totalProducts,
    lowStockCount,
    categoriesCount,
    totalValue,
  };
}
