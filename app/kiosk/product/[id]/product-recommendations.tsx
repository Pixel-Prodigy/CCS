import Link from "next/link";
import Image from "next/image";
import { getRelatedProducts } from "@/lib/actions/products";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Package, Sparkles, ArrowRight } from "lucide-react";

interface ProductRecommendationsProps {
  product: Product;
}

export async function ProductRecommendations({
  product,
}: ProductRecommendationsProps) {
  const relatedProducts = await getRelatedProducts(product, 8);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-8 border-t">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">You might also like</h2>
          <p className="text-muted-foreground mt-1">
            Similar items you may be interested in
          </p>
        </div>
        <Link
          href="/kiosk"
          className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {relatedProducts.map((item) => (
          <RecommendationCard key={item.id} product={item} />
        ))}
      </div>

      <div className="mt-6 sm:hidden">
        <Link
          href="/kiosk"
          className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-primary border border-primary/20 rounded-xl hover:bg-primary/5"
        >
          View all products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function RecommendationCard({ product }: { product: Product }) {
  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <Link
      href={`/kiosk/product/${product.id}`}
      className={cn(
        "group relative rounded-2xl overflow-hidden",
        "bg-card border border-border/50",
        "hover:shadow-lg hover:border-border",
        "active:scale-[0.98]",
        isOutOfStock && "opacity-70"
      )}
    >
      {/* Image */}
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
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}

        {/* Stock Badges */}
        {isLowStock && (
          <div className="absolute top-2 right-2">
            <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-orange-500 text-white rounded-full">
              <Sparkles className="h-3 w-3" />
              Low
            </span>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="px-2.5 py-1 text-xs font-medium bg-background text-foreground rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Price */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 text-sm font-bold bg-white text-black rounded-lg shadow-sm">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-medium text-foreground line-clamp-1 text-sm">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground capitalize mt-0.5">
          {product.type} • {product.color}
        </p>
      </div>
    </Link>
  );
}
