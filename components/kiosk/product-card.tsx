"use client";

import Image from "next/image";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Package, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <Link
      href={`/kiosk/product/${product.id}`}
      className={cn(
        "group relative block rounded-2xl overflow-hidden",
        "bg-card border border-border/50",
        "hover:shadow-lg hover:border-border",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "active:scale-[0.98]",
        isOutOfStock && "opacity-70"
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-3/4 overflow-hidden bg-muted">
        {product.image_url ? (
          <>
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className={cn("object-cover", isOutOfStock && "grayscale")}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Stock Badges */}
        {isLowStock && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-orange-500 text-white rounded-full">
              <Sparkles className="h-3 w-3" />
              Low Stock
            </span>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="px-3 py-1.5 text-sm font-medium bg-background text-foreground rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Price on image */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 text-sm font-bold bg-white text-black rounded-lg shadow-sm">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-1.5">
        <h3 className="font-medium text-foreground line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.size && (
            <span className="text-xs font-medium px-1.5 py-0.5 bg-primary/10 text-primary rounded">
              {product.size}
            </span>
          )}
          <span className="text-xs text-muted-foreground capitalize">
            {product.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
