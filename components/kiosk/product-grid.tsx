"use client";

import { ProductCard } from "./product-card";
import type { Product } from "@/lib/types";
import { Package } from "lucide-react";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <div className="rounded-full bg-muted p-8 mb-6">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No products found</h2>
        <p className="text-muted-foreground max-w-md">
          We couldn&apos;t find any products matching your filters. Try
          adjusting your selection or clear all filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
