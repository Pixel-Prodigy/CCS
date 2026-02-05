import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Product type abbreviations for code generation
const TYPE_ABBREVIATIONS: Record<string, string> = {
  shirt: "SHT",
  "t-shirt": "TSH",
  jeans: "JNS",
  pants: "PNT",
  jacket: "JKT",
  dress: "DRS",
  skirt: "SKT",
  sweater: "SWT",
  hoodie: "HOD",
  shorts: "SHR",
  coat: "COT",
  blazer: "BLZ",
  other: "OTH",
};

/**
 * Generate a unique product code
 * Format: TRY-{TYPE}-{RANDOM}
 * Example: TRY-SHT-A3K9
 */
export function generateProductCode(type: string): string {
  const abbr = TYPE_ABBREVIATIONS[type.toLowerCase()] || "OTH";
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TRY-${abbr}-${random}`;
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

/**
 * Product types for forms
 */
export const PRODUCT_TYPES = [
  "shirt",
  "t-shirt",
  "jeans",
  "pants",
  "jacket",
  "dress",
  "skirt",
  "sweater",
  "hoodie",
  "shorts",
  "coat",
  "blazer",
  "other",
] as const;

/**
 * Product categories
 */
export const PRODUCT_CATEGORIES = [
  "casual",
  "formal",
  "sportswear",
  "evening",
  "workwear",
  "streetwear",
] as const;

/**
 * Product colors with their hex values for display
 */
export const PRODUCT_COLORS = [
  "black",
  "white",
  "gray",
  "navy",
  "blue",
  "red",
  "green",
  "brown",
  "beige",
  "pink",
  "purple",
  "orange",
  "yellow",
  "multicolor",
] as const;

/**
 * Color hex values for visual display
 */
export const COLOR_HEX_MAP: Record<string, string> = {
  black: "#1a1a1a",
  white: "#ffffff",
  gray: "#6b7280",
  navy: "#1e3a5f",
  blue: "#3b82f6",
  red: "#ef4444",
  green: "#22c55e",
  brown: "#92400e",
  beige: "#d4b896",
  pink: "#ec4899",
  purple: "#8b5cf6",
  orange: "#f97316",
  yellow: "#eab308",
  multicolor:
    "linear-gradient(135deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6)",
};

/**
 * Product sizes
 */
export const PRODUCT_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type ProductColor = (typeof PRODUCT_COLORS)[number];
export type ProductSize = (typeof PRODUCT_SIZES)[number];
