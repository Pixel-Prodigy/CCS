import Link from "next/link";
import { Package, ArrowLeft, Search } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
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

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            Sorry, we could not find the product you are looking for. It may
            have been removed or the link might be incorrect.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/kiosk"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90"
            >
              <Search className="h-4 w-4" />
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
