"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [{ href: "/admin/assessments", label: "Assessments" }];

export function AdminNav({ siteUrl }: { siteUrl: string }) {
  const pathname = usePathname();
  return (
    <nav className="mb-8 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-1">
        <span className="mr-3 text-sm font-semibold tracking-tight">Admin</span>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent/40",
              pathname.startsWith(l.href)
                ? "bg-accent/30 font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={siteUrl}>View site</Link>
        </Button>
        <AdminSignOutButton />
      </div>
    </nav>
  );
}
