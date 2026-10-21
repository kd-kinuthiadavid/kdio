import Link from "next/link";
import { notFound } from "next/navigation";

import {
  deleteDraftAction,
  issueDocumentAction,
  storeDocumentPdfAction,
} from "@/app/admin/(protected)/documents/actions";
import { ConfirmActionButton } from "@/components/admin/ConfirmActionButton";
import { DocumentEventsCard } from "@/components/admin/DocumentEventsCard";
import { DocumentStatusBadge } from "@/components/admin/DocumentStatusBadge";
import {
  InvoiceBalanceSummary,
  LinkedNotesCard,
  PaymentsCard,
} from "@/components/admin/InvoiceBalanceCard";
import { Notice } from "@/components/admin/Notice";
import { PaymentStateBadge } from "@/components/admin/PaymentStateBadge";
import { SendDocumentButton } from "@/components/admin/SendDocumentButton";
import { VoidDocumentButton } from "@/components/admin/VoidDocumentButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { customerDisplayName } from "@/lib/documents/customers";
import { formatDate, formatDateTime } from "@/lib/documents/dates";
import { formatMoney } from "@/lib/documents/money";
import { getDocumentType } from "@/lib/documents/registry";
import { reasonLabel } from "@/lib/documents/reasons";
import { getDocument, getInvoiceBalance, listEvents } from "@/lib/documents/service";

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
  const pdfUrl = `/api/admin/documents/${d.id}/pdf`;
  const isDraft = d.status === "draft";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{def.label}</p>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{d.number ?? "Draft"}</h1>
            <DocumentStatusBadge status={d.status} />
            {balance && d.status === "issued" ? <PaymentStateBadge state={balance.state} /> : null}
          </div>
        </div>
        <div className="flex flex-wrap items-start gap-2">
          {isDraft ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/documents/${d.id}/edit`}>Edit</Link>
              </Button>
              <ConfirmActionButton
                action={issueDocumentAction}
                id={d.id}
                label="Issue"
                pendingLabel="Issuing…"
                confirm={`Issue this ${def.label.toLowerCase()}? It gets a number and can no longer be edited.`}
              />
              <ConfirmActionButton
                action={deleteDraftAction}
                id={d.id}
                label="Delete draft"
                variant="ghost"
                confirm="Delete this draft?"
              />
            </>
          ) : null}
          {d.type === "invoice" && d.status === "issued" ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/documents/new?type=credit_note&from=${d.id}`}>
                  New credit note
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/documents/new?type=debit_note&from=${d.id}`}>
                  New debit note
                </Link>
              </Button>
            </>
          ) : null}
          <Button variant="outline" size="sm" asChild>
            <a href={pdfUrl} target="_blank" rel="noreferrer">
              Open PDF
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`${pdfUrl}?download=1`}>Download</a>
          </Button>
          {d.status === "issued" ? <VoidDocumentButton id={d.id} label={def.label} /> : null}
          {d.status === "issued" ? (
            <SendDocumentButton
              id={d.id}
              defaultTo={customer.email ?? ""}
              defaultCc={process.env.NOTIFY_EMAIL ?? ""}
            />
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Customer</dt>
                  <dd>
                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {customerDisplayName(customer)}
                    </Link>
                  </dd>
                </div>
                {parent ? (
                  <div>
                    <dt className="text-muted-foreground">Original invoice</dt>
                    <dd>
                      <Link
                        href={`/admin/documents/${parent.id}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {parent.number ?? "Draft"}
                      </Link>
                    </dd>
                  </div>
                ) : null}
                {reason ? (
                  <div>
                    <dt className="text-muted-foreground">Reason</dt>
                    <dd>{reason}</dd>
                  </div>
                ) : null}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <dt className="text-muted-foreground">Issue date</dt>
                    <dd>{formatDate(data.issueDate)}</dd>
                  </div>
                  {data.dueDate ? (
                    <div>
                      <dt className="text-muted-foreground">Due date</dt>
                      <dd>{formatDate(data.dueDate)}</dd>
                    </div>
                  ) : null}
                </div>
                {data.reference ? (
                  <div>
                    <dt className="text-muted-foreground">Reference</dt>
                    <dd>{data.reference}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-muted-foreground">Total</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatMoney(d.totalMinor, d.currency)}
                  </dd>
                </div>
                {d.issuedAt ? (
                  <div>
                    <dt className="text-muted-foreground">Issued</dt>
                    <dd>{formatDateTime(d.issuedAt)}</dd>
                  </div>
                ) : null}
                {d.voidedAt ? (
                  <div>
                    <dt className="text-muted-foreground">Voided</dt>
                    <dd>{formatDateTime(d.voidedAt)}</dd>
                  </div>
                ) : null}
                {d.pdfSha256 ? (
                  <div>
                    <dt className="text-muted-foreground">Stored PDF (sha256)</dt>
                    <dd className="break-all font-mono text-xs">{d.pdfSha256}</dd>
                  </div>
                ) : null}
              </dl>
              {!isDraft && !d.pdfSha256 ? (
                <div className="mt-4 space-y-2">
                  <Notice tone="warning">The issued PDF hasn&apos;t been stored yet.</Notice>
                  <ConfirmActionButton
                    action={storeDocumentPdfAction}
                    id={d.id}
                    label="Store PDF"
                    pendingLabel="Storing…"
                  />
                </div>
              ) : null}
            </CardContent>
          </Card>
          {balance && d.status === "issued" ? <InvoiceBalanceSummary balance={balance} /> : null}
          <DocumentEventsCard events={events} />
        </div>

        <div className="space-y-6">
          {balance && (d.status === "issued" || balance.payments.length) ? (
            <PaymentsCard balance={balance} />
          ) : null}
          {balance ? <LinkedNotesCard balance={balance} /> : null}
          <iframe
            key={d.updatedAt.toISOString()}
            src={pdfUrl}
            title={`${def.label} PDF preview`}
            className="h-[900px] w-full rounded-lg border border-border bg-white"
          />
        </div>
      </div>
    </div>
  );
}
