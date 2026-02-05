// Shop types
export interface Shop {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  category: string;
  settings: ShopSettings;
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopSettings {
  theme?: "light" | "dark" | "system";
  currency?: string;
  kiosk_enabled?: boolean;
}

export interface ShopFormData {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  category: string;
}

// Profile types
export interface Profile {
  id: string;
  shop_id: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: "owner" | "staff";
  created_at: string;
  updated_at: string;
}

export interface ProfileWithShop extends Profile {
  shop: Shop | null;
}

// Product types
export interface Product {
  id: string;
  shop_id: string;
  product_code: string;
  name: string;
  type: string;
  color: string;
  category: string;
  size: string | null;
  price: number;
  stock: number;
  location: string | null;
  image_url: string | null;
  created_at: string;
}

export interface ProductFormData {
  name: string;
  type: string;
  color: string;
  category: string;
  size?: string;
  price: number;
  stock: number;
  location?: string;
  image_url?: string;
}

export interface ProductFilters {
  type?: string;
  color?: string;
  category?: string;
  size?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Auth types
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

// Onboarding status
export interface OnboardingStatus {
  hasProfile: boolean;
  hasShop: boolean;
  isOnboarded: boolean;
  shopId: string | null;
}
