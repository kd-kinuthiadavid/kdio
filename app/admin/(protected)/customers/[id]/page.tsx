import Link from "next/link";
import { notFound } from "next/navigation";

import { DocumentsTable, payableIds } from "@/components/admin/DocumentsTable";
import { Section, Stat, StatStrip } from "@/components/admin/Section";
import { Button } from "@/components/ui/button";
import { getCustomer } from "@/lib/documents/customers";
import { formatDate, formatDateTime, todayIso } from "@/lib/documents/dates";
import { formatMoney } from "@/lib/documents/money";
import { getPaymentSummaries, getReceivables } from "@/lib/documents/payments";
import { listDocuments } from "@/lib/documents/service";

const link = "underline-offset-4 hover:underline";

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
  const lastIssued = rows.find(({ document: d }) => d.issuedAt)?.document;
  const contact = [
    customer.company,
    customer.email ? (
      <a key="email" href={`mailto:${customer.email}`} className={link}>
        {customer.email}
      </a>
    ) : null,
    customer.phone,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Customer</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{customer.name}</h1>
          {contact.length ? (
            <p className="mt-1 flex flex-wrap gap-x-2 text-sm text-muted-foreground">
              {contact.map((item, i) => (
                <span key={i} className="flex gap-x-2">
                  {i > 0 ? <span aria-hidden>·</span> : null}
                  {item}
                </span>
              ))}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/customers/${customer.id}/edit`}>Edit details</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/admin/documents/new?customerId=${customer.id}`}>New invoice</Link>
          </Button>
        </div>
      </header>

      <StatStrip>
        {receivables.length ? (
          receivables.map((r) => (
            <Stat
              key={r.currency}
              label={`Outstanding (${r.currency})`}
              emphasis
              hint={
                r.overdueCount ? (
                  <span className="font-medium text-danger">
                    {formatMoney(r.overdueMinor, r.currency)} overdue
                  </span>
                ) : (
                  "Nothing overdue"
                )
              }
            >
              {formatMoney(r.outstandingMinor, r.currency)}
            </Stat>
          ))
        ) : (
          <Stat label="Outstanding" emphasis hint="All paid up">
            {formatMoney(0, customer.defaultCurrency)}
          </Stat>
        )}
        <Stat label="Documents">{rows.length}</Stat>
        <Stat label="Last issued">
          {lastIssued ? (
            <Link href={`/admin/documents/${lastIssued.id}`} className={link}>
              {formatDate((lastIssued.data as { issueDate?: string }).issueDate)}
            </Link>
          ) : null}
        </Stat>
        <Stat label="Currency">{customer.defaultCurrency}</Stat>
        <Stat label="Payment terms">Net {customer.paymentTermsDays}</Stat>
      </StatStrip>

      <Section title="Documents">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents for this customer yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <DocumentsTable rows={rows} payments={payments} today={today} showCustomer={false} />
          </div>
        )}
      </Section>

      <Section title="Details">
        <dl className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Billing address">
            {customer.addressLines.length ? (
              <span className="whitespace-pre-line">{customer.addressLines.join("\n")}</span>
            ) : null}
          </Stat>
          <Stat label="Country">{customer.country}</Stat>
          <Stat label="Tax ID">{customer.taxId}</Stat>
          <Stat label="Last updated">{formatDateTime(customer.updatedAt)}</Stat>
          {customer.notes ? (
            <Stat label="Internal notes" className="sm:col-span-2 lg:col-span-4">
              <span className="whitespace-pre-line font-normal">{customer.notes}</span>
            </Stat>
          ) : null}
        </dl>
        <p className="text-xs text-muted-foreground">
          Changes apply to drafts and new documents. Issued documents keep the details they were
          issued with.
        </p>
      </Section>
    </div>
  );
}
