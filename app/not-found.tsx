import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/30">
      <div className="text-center max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Animated icon */}
        <div className="relative mx-auto mb-8 w-32 h-32">
          <div className="absolute inset-0 rounded-full bg-muted/50 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-8xl font-bold bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent mb-2">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved
          to a new location.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/kiosk">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/admin">Staff Portal</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
