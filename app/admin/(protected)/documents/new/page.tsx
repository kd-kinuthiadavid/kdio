import Link from "next/link";

import { DocumentForm } from "@/components/admin/DocumentForm";
import { Button } from "@/components/ui/button";
import { listCustomers } from "@/lib/documents/customers";
import { addDaysIso, todayIso } from "@/lib/documents/dates";
import { emptyFormLine } from "@/lib/documents/form-model";
import { getDocumentType } from "@/lib/documents/registry";

export default async function NewDocumentPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const { customerId } = await searchParams;
  const def = getDocumentType("invoice");
  const customers = await listCustomers();

  if (customers.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">New {def.label.toLowerCase()}</h1>
        <p className="text-sm text-muted-foreground">Create a customer first.</p>
        <Button asChild size="sm">
          <Link href="/admin/customers/new">New customer</Link>
        </Button>
      </div>
    );
  }

  const customer = customers.find((c) => c.id === customerId);
  const issueDate = todayIso();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">New {def.label.toLowerCase()}</h1>
      <DocumentForm
        type="invoice"
        typeLabel={def.label}
        customers={customers}
        initial={{
          customerId: customer?.id ?? "",
          currency: customer?.defaultCurrency ?? "USD",
          issueDate,
          dueDate: addDaysIso(issueDate, customer?.paymentTermsDays ?? 14),
          servicePeriodFrom: "",
          servicePeriodTo: "",
          reference: "",
          lines: [emptyFormLine()],
          documentDiscount: { kind: "none", value: "" },
          notes: "",
          terms: "",
        }}
      />
    </div>
  );
}
