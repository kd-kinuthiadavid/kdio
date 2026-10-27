import * as React from "react";

import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-md bg-foreground/[0.07] bg-[linear-gradient(90deg,transparent,hsl(var(--foreground)/0.08),transparent)] bg-[length:200%_100%] bg-no-repeat animate-shimmer motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
