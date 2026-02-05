import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/admin/product-table";
import { getProducts } from "@/lib/actions/products";
import { Plus } from "lucide-react";

// Force dynamic rendering to prevent prerender errors with auth
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <ProductTable products={products} />
    </div>
  );
}
