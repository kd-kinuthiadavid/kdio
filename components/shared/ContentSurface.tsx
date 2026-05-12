import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContentSurfaceProps = {
  children: ReactNode;
  className?: string;
};

export default function ContentSurface({
  children,
  className,
}: ContentSurfaceProps) {
  return (
    <div className={cn("relative overflow-visible", className)}>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute z-0 inset-[-12px]",
          "bg-background/20 backdrop-blur-xl [-webkit-backdrop-filter:blur(20px)]",
          "[mask-image:radial-gradient(ellipse_78%_82%_at_50%_50%,#000_38%,#000000b3_58%,transparent_88%)]",
          "[-webkit-mask-image:radial-gradient(ellipse_78%_82%_at_50%_50%,#000_38%,#000000b3_58%,transparent_88%)]"
        )}
      />
      <div className="relative z-10 p-6 md:p-8">{children}</div>
    </div>
  );
}
