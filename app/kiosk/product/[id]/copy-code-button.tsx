"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyCodeButtonProps {
  code: string;
}

export function CopyCodeButton({ code }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "w-full flex items-center justify-between",
        "px-6 py-5 rounded-2xl",
        "bg-primary text-primary-foreground",
        "hover:bg-primary/90",
        "active:scale-[0.98]",
        "group"
      )}
    >
      <code className="text-2xl font-mono font-bold tracking-widest">
        {code}
      </code>
      <div className="flex items-center gap-2">
        {copied ? (
          <>
            <Check className="h-5 w-5" />
            <span className="text-sm font-medium">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-5 w-5 opacity-70 group-hover:opacity-100" />
            <span className="text-sm font-medium opacity-70 group-hover:opacity-100">
              Copy
            </span>
          </>
        )}
      </div>
    </button>
  );
}
