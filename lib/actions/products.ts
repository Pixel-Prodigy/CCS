"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateProductCode } from "@/lib/utils";
import type { Product, ProductFormData, ProductFilters } from "@/lib/types";
import { z } from "zod";
import { getProfile } from "./auth";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  color: z.string().min(1, "Color is required"),
  category: z.string().min(1, "Category is required"),
  size: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  location: z.string().optional(),
  image_url: z.string().optional(),
});

// Helper to get current user's shop_id
async function getShopId(): Promise<string | null> {
  const profile = await getProfile();
  return profile?.shop_id || null;
}

export async function getProducts(
  filters?: ProductFilters,
  shopId?: string // Optional: for kiosk to fetch specific shop's products
): Promise<Product[]> {
  const supabase = await createClient();

  // If no shopId provided, get current user's shop
  const targetShopId = shopId || (await getShopId());

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  // Filter by shop if we have a shop_id
  if (targetShopId) {
    query = query.eq("shop_id", targetShopId);
  }

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

  if (filters?.color) {
    query = query.eq("color", filters.color);
  }

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  if (filters?.size) {
    query = query.eq("size", filters.size);
  }

  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,product_code.ilike.%${filters.search}%`
    );
  }

  if (filters?.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters?.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data as Product[];
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data as Product;
}

export async function createProduct(formData: ProductFormData) {
  const result = productSchema.safeParse(formData);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const shopId = await getShopId();

  if (!shopId) {
    return { error: "No shop found. Please complete onboarding first." };
  }

  const supabase = await createClient();
  const productCode = generateProductCode(formData.type);

  const { error } = await supabase.from("products").insert({
    ...formData,
    product_code: productCode,
    shop_id: shopId,
  });

  if (error) {
    console.error("Error creating product:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/kiosk");

  return { success: true };
}

export async function updateProduct(id: string, formData: ProductFormData) {
  const result = productSchema.safeParse(formData);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const shopId = await getShopId();

  if (!shopId) {
    return { error: "No shop found. Please complete onboarding first." };
  }

  const supabase = await createClient();

  // Only update products that belong to user's shop (RLS also enforces this)
  const { error } = await supabase
    .from("products")
    .update(formData)
    .eq("id", id)
    .eq("shop_id", shopId);

  if (error) {
    console.error("Error updating product:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/kiosk");

  return { success: true };
}

export async function deleteProduct(id: string) {
  const shopId = await getShopId();

  if (!shopId) {
    return { error: "No shop found. Please complete onboarding first." };
  }

  const supabase = await createClient();

  // First, get the product to check if it has an image
  const { data: product } = await supabase
    .from("products")
    .select("image_url, shop_id")
    .eq("id", id)
    .eq("shop_id", shopId)
    .single();

  if (!product) {
    return {
      error: "Product not found or you don't have permission to delete it.",
    };
  }

  // Delete the image from storage if it exists
  if (product.image_url) {
    const imagePath = product.image_url.split("/").pop();
    if (imagePath) {
      await supabase.storage.from("product-images").remove([imagePath]);
    }
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("shop_id", shopId);

  if (error) {
    console.error("Error deleting product:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/kiosk");

  return { success: true };
}

export async function getRelatedProducts(
  product: Product,
  limit: number = 8
): Promise<Product[]> {
  const supabase = await createClient();

  // Get products that share category, type, or color (excluding current product)
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("shop_id", product.shop_id)
    .neq("id", product.id)
    .or(
      `category.eq.${product.category},type.eq.${product.type},color.eq.${product.color}`
    )
    .limit(limit);

  if (error) {
    console.error("Error fetching related products:", error);
    return [];
  }

  return data as Product[];
}

export async function uploadProductImage(
  file: File
): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(7)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, file);

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(fileName);

  return { url: publicUrl };
}
