import { Suspense } from "react";

import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md py-12 text-sm text-muted-foreground">Loading…</div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
