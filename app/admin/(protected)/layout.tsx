import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <>
      <AdminNav siteUrl={getSiteUrl()} />
      {children}
    </>
  );
}
