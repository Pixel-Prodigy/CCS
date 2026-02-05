import { Suspense } from "react";
import { FilterBar } from "@/components/kiosk/filter-bar";
import { ProductGrid } from "@/components/kiosk/product-grid";
import { getProducts } from "@/lib/actions/products";
import { Loader2 } from "lucide-react";

interface KioskPageProps {
  searchParams: Promise<{
    type?: string;
    color?: string;
    category?: string;
    size?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

async function ProductsSection({
  searchParams,
}: {
  searchParams: KioskPageProps["searchParams"];
}) {
  const params = await searchParams;
  const products = await getProducts({
    type: params.type,
    color: params.color,
    category: params.category,
    size: params.size,
    search: params.search,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
  });

  return <ProductGrid products={products} />;
}

function ProductsLoading() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function KioskPage({ searchParams }: KioskPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>

      <main className="flex-1 container mx-auto px-4 py-6 hide-scrollbar">
        <Suspense fallback={<ProductsLoading />}>
          <ProductsSection searchParams={searchParams} />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Tap any product to see details
          </p>
          <a
            href="/admin"
            className="text-xs text-muted-foreground/50 hover:text-muted-foreground"
          >
            Staff Login
          </a>
        </div>
      </footer>
    </div>
  );
}
