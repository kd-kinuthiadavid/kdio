"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function AdminSignOutButton() {
  const router = useRouter();
  return (
    <Button
      variant="secondary"
      size="sm"
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
    >
      Sign out
    </Button>
  );
}
