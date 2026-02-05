import { ProductGridSkeleton } from "@/components/kiosk/product-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function KioskLoading() {
  return (
    <div className="min-h-screen flex flex-col animate-in fade-in duration-300">
      {/* Filter bar skeleton */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="flex flex-wrap gap-6">
              {/* Type filters */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-10" />
                <div className="flex gap-1.5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-16 rounded-md" />
                  ))}
                </div>
              </div>
              {/* Category filters */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-10" />
                <div className="flex gap-1.5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20 rounded-md" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product grid skeleton */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <ProductGridSkeleton />
      </main>

      {/* Footer skeleton */}
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
      </footer>
    </div>
  );
}
