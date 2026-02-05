"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function KioskError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/30">
      <div className="text-center max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative mx-auto mb-8 w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-orange-500/10 animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-orange-500/10 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-orange-500" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-3">Unable to Load Products</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          We&apos;re having trouble loading the product catalog. Please try
          again in a moment.
        </p>

        <Button onClick={reset} size="lg" className="min-w-[200px]">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reload Products
        </Button>
      </div>
    </div>
  );
}
