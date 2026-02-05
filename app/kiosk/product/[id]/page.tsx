import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProduct } from "@/lib/actions/products";
import { formatPrice, cn } from "@/lib/utils";
import {
  Package,
  MapPin,
  ArrowLeft,
  Check,
  AlertTriangle,
  XCircle,
  Tag,
  Palette,
  Ruler,
  Layers,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { CopyCodeButton } from "./copy-code-button";
import { ProductRecommendations } from "./product-recommendations";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const isInStock = product.stock > 5;
  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link
            href="/kiosk"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Products</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Product Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-32 w-32 text-muted-foreground/20" />
                </div>
              )}

              {/* Stock Badge */}
              {isLowStock && (
                <div className="absolute top-6 left-6">
                  <span className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-orange-500 text-white rounded-full shadow-lg">
                    <Sparkles className="h-4 w-4" />
                    Only {product.stock} left!
                  </span>
                </div>
              )}

              {isOutOfStock && (
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-full shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Image info strip */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShoppingBag className="h-4 w-4" />
              <span>Tap the product code below to copy</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full capitalize">
                <Layers className="h-3 w-3" />
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl sm:text-5xl font-bold">
                {formatPrice(product.price)}
              </span>
              {/* Stock Status */}
              <div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
                  isInStock &&
                    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                  isLowStock &&
                    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                  isOutOfStock &&
                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}
              >
                {isInStock && <Check className="h-4 w-4" />}
                {isLowStock && <AlertTriangle className="h-4 w-4" />}
                {isOutOfStock && <XCircle className="h-4 w-4" />}
                <span>
                  {isInStock && "In Stock"}
                  {isLowStock && `${product.stock} left`}
                  {isOutOfStock && "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Product Attributes Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl">
                <div className="p-3 bg-background rounded-xl shadow-sm">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Type
                  </p>
                  <p className="font-semibold capitalize">{product.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl">
                <div className="p-3 bg-background rounded-xl shadow-sm">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Color
                  </p>
                  <p className="font-semibold capitalize">{product.color}</p>
                </div>
              </div>

              {product.size && (
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl">
                  <div className="p-3 bg-background rounded-xl shadow-sm">
                    <Ruler className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Size
                    </p>
                    <p className="font-semibold">{product.size}</p>
                  </div>
                </div>
              )}

              {product.location && (
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl">
                  <div className="p-3 bg-background rounded-xl shadow-sm">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Location
                    </p>
                    <p className="font-semibold">{product.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stock Information */}
            {!isOutOfStock && (
              <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Available Stock
                    </p>
                    <p className="text-2xl font-bold">{product.stock} items</p>
                  </div>
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>
            )}

            {/* Product Code Section */}
            <div className="mt-auto">
              <p className="text-sm text-muted-foreground mb-3">Product Code</p>
              <CopyCodeButton code={product.product_code} />
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Show this code to our staff for assistance
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <Suspense fallback={<RecommendationsSkeleton />}>
          <ProductRecommendations product={product} />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-8">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Need help? Ask our staff
          </p>
          <Link
            href="/kiosk"
            className="text-sm font-medium text-primary hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </footer>
    </div>
  );
}

function RecommendationsSkeleton() {
  return (
    <section className="py-8">
      <div className="h-8 w-48 bg-muted rounded-lg mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden bg-card border border-border/50"
          >
            <div className="aspect-3/4 bg-muted animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
