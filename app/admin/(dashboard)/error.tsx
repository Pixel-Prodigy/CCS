"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, LogOut } from "lucide-react";

export default function AdminError({
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
    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-destructive/10 animate-ping opacity-75" />
        <div className="relative rounded-full bg-destructive/10 p-6">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-3">Something went wrong</h2>
      <p className="text-muted-foreground mb-2 max-w-sm leading-relaxed">
        An error occurred while loading this page. Please try again.
      </p>

      {error.digest && (
        <p className="text-xs text-muted-foreground/60 mb-6 font-mono">
          Error ID: {error.digest}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button onClick={reset} size="lg">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/admin/login">
            <LogOut className="mr-2 h-4 w-4" />
            Re-login
          </Link>
        </Button>
      </div>
    </div>
  );
}
