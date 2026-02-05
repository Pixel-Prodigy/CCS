import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function KioskNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/30">
      <div className="text-center max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative mx-auto mb-8 w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-muted animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          This page doesn&apos;t exist. Let&apos;s get you back to browsing our
          collection.
        </p>

        <Button asChild size="lg" className="min-w-[200px]">
          <Link href="/kiosk">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse Collection
          </Link>
        </Button>
      </div>
    </div>
  );
}
