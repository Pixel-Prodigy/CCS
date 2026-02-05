import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProductLoading() {
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
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl bg-muted animate-pulse" />
            <div className="h-5 w-48 bg-muted rounded mx-auto animate-pulse" />
          </div>

          {/* Details Skeleton */}
          <div className="space-y-6">
            <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
            <div className="h-12 w-3/4 bg-muted rounded-lg animate-pulse" />
            <div className="flex items-center gap-4">
              <div className="h-14 w-32 bg-muted rounded-lg animate-pulse" />
              <div className="h-8 w-24 bg-muted rounded-full animate-pulse" />
            </div>

            {/* Attributes Grid Skeleton */}
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-muted/50 rounded-2xl animate-pulse"
                />
              ))}
            </div>

            <div className="h-24 bg-muted/30 rounded-2xl animate-pulse" />

            <div className="mt-8 space-y-3">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-16 bg-muted rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>

        {/* Recommendations Skeleton */}
        <div className="py-8 border-t">
          <div className="h-8 w-48 bg-muted rounded-lg mb-6 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-card border border-border/50"
              >
                <div className="aspect-3/4 bg-muted animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
