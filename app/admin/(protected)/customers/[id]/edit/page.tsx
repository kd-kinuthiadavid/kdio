import { notFound } from "next/navigation";

import { CustomerForm } from "@/components/admin/CustomerForm";
import { getCustomer } from "@/lib/documents/customers";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomer(id).catch(() => null);
  if (!customer) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Edit customer</p>
        <h1 className="text-2xl font-semibold tracking-tight">{customer.name}</h1>
      </div>
      <CustomerForm customer={customer} />
    </div>
  );
}
