import Link from "next/link";
import { notFound } from "next/navigation";

import { DocumentForm } from "@/components/admin/DocumentForm";
import { Button } from "@/components/ui/button";
import { getCustomer, listCustomers } from "@/lib/documents/customers";
import { todayIso } from "@/lib/documents/dates";
import { newInvoiceValues, noteValuesFromInvoice } from "@/lib/documents/form-model";
import { formatMoney } from "@/lib/documents/money";
import { getDocumentType } from "@/lib/documents/registry";
import { getInvoiceBalance } from "@/lib/documents/service";

export default async function NewDocumentPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string; type?: string; from?: string }>;
}) {
  const sp = await searchParams;
  const issueDate = todayIso();

  if (sp.type === "credit_note" || sp.type === "debit_note") {
    const def = getDocumentType(sp.type);
    const balance = sp.from ? await getInvoiceBalance(sp.from).catch(() => null) : null;
    if (!balance) notFound();
    const { invoice } = balance;
    const invoiceHref = `/admin/documents/${invoice.id}`;
    if (invoice.status !== "issued") {
      return (
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight">New {def.label.toLowerCase()}</h1>
          <p className="text-sm text-muted-foreground">
            Notes can only be raised against an issued invoice.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={invoiceHref}>Back to invoice</Link>
          </Button>
        </div>
      );
    }
    const customer = await getCustomer(invoice.customerId);
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          New {def.label.toLowerCase()} for {invoice.number}
        </h1>
        <DocumentForm
          type={sp.type}
          typeLabel={def.label}
          customers={customer ? [customer] : []}
          parent={{
            number: invoice.number ?? "",
            balance: formatMoney(balance.balanceMinor, invoice.currency),
          }}
          cancelHref={invoiceHref}
          initial={noteValuesFromInvoice(
            sp.type,
            invoice,
            issueDate,
            customer?.paymentTermsDays ?? 14
          )}
        />
      </div>
    );
  }

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

  const customer = customers.find((c) => c.id === sp.customerId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">New {def.label.toLowerCase()}</h1>
      <DocumentForm
        type="invoice"
        typeLabel={def.label}
        customers={customers}
        initial={newInvoiceValues(issueDate, customer)}
      />
    </div>
  );
}
