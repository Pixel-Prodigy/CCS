import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Plus } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Animated icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-muted animate-pulse" />
        <div className="relative rounded-full bg-muted p-8">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-3">Product Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-sm leading-relaxed">
        The product you&apos;re looking for doesn&apos;t exist or has been
        deleted from the inventory.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild variant="outline" size="lg">
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>
    </div>
  );
}
