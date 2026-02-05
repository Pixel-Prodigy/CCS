import { ProductForm } from "@/components/admin/product-form";

// Force dynamic rendering to prevent prerender errors
export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Product</h1>
        <p className="text-muted-foreground">
          Add a new item to your inventory
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
