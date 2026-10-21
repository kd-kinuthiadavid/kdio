import Link from "next/link";
import { notFound } from "next/navigation";

import { storeDocumentPdfAction } from "@/app/admin/(protected)/documents/actions";
import { ConfirmActionButton } from "@/components/admin/ConfirmActionButton";
import { DocumentActivity } from "@/components/admin/DocumentActivity";
import { DocumentHeader } from "@/components/admin/DocumentHeader";
import { DocumentStatusBadge } from "@/components/admin/DocumentStatusBadge";
import { LinkedNotesSection, PaymentsSection } from "@/components/admin/InvoiceSections";
import { Notice } from "@/components/admin/Notice";
import { PaymentStateBadge } from "@/components/admin/PaymentStateBadge";
import { Section, Stat, StatStrip } from "@/components/admin/Section";
import { Button } from "@/components/ui/button";
import { customerDisplayName } from "@/lib/documents/customers";
import { formatDate, formatDateTime, todayIso } from "@/lib/documents/dates";
import { formatMoney } from "@/lib/documents/money";
import { daysOverdue } from "@/lib/documents/payment-state";
import { getDocumentType } from "@/lib/documents/registry";
import { reasonLabel } from "@/lib/documents/reasons";
import { getDocument, getInvoiceBalance, listEvents } from "@/lib/documents/service";

const link = "underline-offset-4 hover:underline";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const found = await getDocument(id).catch(() => null);
  if (!found) notFound();
  const { document: d, customer } = found;
  const def = getDocumentType(d.type);
  const data = d.data as {
    issueDate?: string;
    dueDate?: string;
    reference?: string;
    reason?: string;
  };
  const reason = data.reason ? reasonLabel(d.type, data.reason) : null;
  const [parent, balance, events] = await Promise.all([
    d.relatedDocumentId
      ? getDocument(d.relatedDocumentId).then((r) => r?.document ?? null)
      : null,
    d.type === "invoice" && d.status !== "draft" ? getInvoiceBalance(d.id) : null,
    listEvents(d.id),
  ]);
  const overdue =
    balance && d.status === "issued"
      ? daysOverdue(data.dueDate, balance.outstandingMinor, todayIso())
      : null;
  const money = (minor: number) => formatMoney(minor, d.currency);
  const pdfUrl = `/api/admin/documents/${d.id}/pdf`;
  const isDraft = d.status === "draft";
  const adjusted = balance ? balance.debitMinor > 0 || balance.creditMinor > 0 : false;

  return (
    <div className="space-y-6">
      <DocumentHeader
        id={d.id}
        label={def.label}
        status={d.status}
        isInvoice={d.type === "invoice"}
        defaultTo={customer.email ?? ""}
        defaultCc={process.env.NOTIFY_EMAIL ?? ""}
      >
        <p className="text-sm text-muted-foreground">
          {def.label} for{" "}
          <Link href={`/admin/customers/${customer.id}`} className={`text-foreground ${link}`}>
            {customerDisplayName(customer)}
          </Link>
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{d.number ?? "Draft"}</h1>
          <DocumentStatusBadge status={d.status} />
          {balance && d.status === "issued" ? <PaymentStateBadge state={balance.state} /> : null}
          {overdue !== null ? (
            <span className="text-sm font-medium text-danger">
              Overdue {overdue} day{overdue === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>
        {d.status === "issued" ? (
          <p className="mt-1 text-sm text-muted-foreground">
            Issued documents are locked.{" "}
            {d.type === "invoice"
              ? "Correct amounts with a credit or debit note, or void it."
              : "To change it, void it and raise a new note."}
          </p>
        ) : null}
      </DocumentHeader>

      <StatStrip>
        <Stat label="Issue date">{formatDate(data.issueDate)}</Stat>
        {data.dueDate ? <Stat label="Due date">{formatDate(data.dueDate)}</Stat> : null}
        {parent ? (
          <Stat label="Original invoice">
            <Link href={`/admin/documents/${parent.id}`} className={link}>
              {parent.number ?? "Draft"}
            </Link>
          </Stat>
        ) : null}
        {reason ? <Stat label="Reason">{reason}</Stat> : null}
        {data.reference ? <Stat label="Reference">{data.reference}</Stat> : null}
        <Stat label="Total" emphasis={!balance}>
          {money(d.totalMinor)}
        </Stat>
        {balance && adjusted ? (
          <Stat
            label="Balance"
            hint={`+${money(balance.debitMinor)} debit, −${money(balance.creditMinor)} credit`}
          >
            {money(balance.balanceMinor)}
          </Stat>
        ) : null}
        {balance ? (
          <Stat
            label="Paid"
            hint={balance.refundedMinor ? `${money(balance.refundedMinor)} refunded` : undefined}
          >
            {money(balance.paidMinor)}
          </Stat>
        ) : null}
        {balance ? (
          <Stat
            label={balance.outstandingMinor < 0 ? "In credit" : "Outstanding"}
            emphasis
            hint={
              overdue !== null ? (
                <span className="font-medium text-danger">
                  Overdue {overdue} day{overdue === 1 ? "" : "s"}
                </span>
              ) : undefined
            }
          >
            {money(Math.abs(balance.outstandingMinor))}
          </Stat>
        ) : null}
        {d.voidedAt ? <Stat label="Voided">{formatDateTime(d.voidedAt)}</Stat> : null}
      </StatStrip>

      {balance && (d.status === "issued" || balance.payments.length) ? (
        <PaymentsSection balance={balance} />
      ) : null}
      {balance ? <LinkedNotesSection balance={balance} /> : null}

      <Section
        title="Document"
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <a href={pdfUrl} target="_blank" rel="noreferrer">
                Open PDF
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={`${pdfUrl}?download=1`}>Download</a>
            </Button>
          </>
        }
      >
        {isDraft ? (
          <p className="text-sm text-muted-foreground">
            Live preview. The final PDF is stored when the {def.label.toLowerCase()} is issued.
          </p>
        ) : d.pdfSha256 ? (
          <p className="text-sm text-muted-foreground">
            Stored copy, sha256{" "}
            <span className="break-all font-mono text-xs text-foreground">{d.pdfSha256}</span>
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Notice tone="warning">The issued PDF hasn&apos;t been stored yet.</Notice>
            <ConfirmActionButton
              action={storeDocumentPdfAction}
              id={d.id}
              label="Store PDF"
              pendingLabel="Storing…"
            />
          </div>
        )}
        <iframe
          key={d.updatedAt.toISOString()}
          src={pdfUrl}
          title={`${def.label} PDF preview`}
          className="mx-auto block aspect-[1/1.414] w-full max-w-3xl rounded-lg border border-border bg-white"
        />
      </Section>

      <DocumentActivity events={events} />
    </div>
  );
}
