import Link from "next/link";
import { notFound } from "next/navigation";

import { DocumentsTable, payableIds, ReceivablesCards } from "@/components/admin/DocumentsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCustomer } from "@/lib/documents/customers";
import { formatDateTime, todayIso } from "@/lib/documents/dates";
import { getPaymentSummaries, getReceivables } from "@/lib/documents/payments";
import { listDocuments } from "@/lib/documents/service";

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="break-words">{children || <span className="text-muted-foreground">—</span>}</dd>
    </div>
  );
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomer(id).catch(() => null);
  if (!customer) notFound();

  const today = todayIso();
  const rows = await listDocuments({ customerId: customer.id });
  const [payments, receivables] = await Promise.all([
    getPaymentSummaries(payableIds(rows)),
    getReceivables(today, { customerId: customer.id }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Customer</p>
          <h1 className="text-2xl font-semibold tracking-tight">{customer.name}</h1>
          {customer.company ? <p className="text-muted-foreground">{customer.company}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/customers/${customer.id}/edit`}>Edit details</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/admin/documents/new?customerId=${customer.id}`}>New invoice</Link>
          </Button>
        </div>
      </div>

      <ReceivablesCards receivables={receivables} />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <Detail label="Email">
                {customer.email ? (
                  <a href={`mailto:${customer.email}`} className="underline-offset-4 hover:underline">
                    {customer.email}
                  </a>
                ) : null}
              </Detail>
              <Detail label="Phone">{customer.phone}</Detail>
              <Detail label="Billing address">
                {customer.addressLines.length ? (
                  <span className="whitespace-pre-line">{customer.addressLines.join("\n")}</span>
                ) : null}
              </Detail>
              <Detail label="Country">{customer.country}</Detail>
              <Detail label="Tax ID">{customer.taxId}</Detail>
              <div className="grid grid-cols-2 gap-3">
                <Detail label="Currency">{customer.defaultCurrency}</Detail>
                <Detail label="Payment terms">Net {customer.paymentTermsDays}</Detail>
              </div>
              {customer.notes ? (
                <Detail label="Internal notes">
                  <span className="whitespace-pre-line">{customer.notes}</span>
                </Detail>
              ) : null}
              <Detail label="Last updated">{formatDateTime(customer.updatedAt)}</Detail>
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              Changes apply to drafts and new documents. Issued documents keep the details they
              were issued with.
            </p>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Documents</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">No documents for this customer yet.</p>
            ) : (
              <DocumentsTable rows={rows} payments={payments} today={today} showCustomer={false} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
