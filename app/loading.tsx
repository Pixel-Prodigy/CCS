export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo */}
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center animate-pulse">
            <span className="text-2xl font-bold text-primary-foreground">
              T
            </span>
          </div>
          <div className="absolute -inset-2 rounded-3xl bg-primary/20 animate-ping" />
        </div>

        {/* Loading text */}
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Loading</span>
          <span className="flex gap-1">
            <span
              className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
