import type { Metadata } from "next";

import HtmlShell from "@/components/shared/HtmlShell";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // z-10 lifts content above the fixed grid and edge-frost layers on body::before/::after.
  return (
    <HtmlShell lang="en">
      <div className="admin-theme relative z-10 min-h-screen text-foreground">
        <div className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 sm:py-10">
          <div
            className={cn(
              "rounded-2xl border border-border/70 bg-background/85 px-4 py-6 shadow-sm sm:px-8 sm:py-8",
              "backdrop-blur-xl [-webkit-backdrop-filter:blur(20px)]"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </HtmlShell>
  );
}
