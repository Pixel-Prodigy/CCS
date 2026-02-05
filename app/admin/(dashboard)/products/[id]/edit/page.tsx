import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getProduct } from "@/lib/actions/products";

// Force dynamic rendering to prevent prerender errors with auth
export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground">
          Update product details for {product.name}
        </p>
      </div>

      <ProductForm product={product} />
    </div>
  );
}
