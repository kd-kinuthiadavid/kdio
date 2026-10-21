import Link from "next/link";

import { deletePaymentAction } from "@/app/admin/(protected)/documents/actions";
import { ConfirmActionButton } from "@/components/admin/ConfirmActionButton";
import { DocumentStatusBadge } from "@/components/admin/DocumentStatusBadge";
import { RecordPaymentPanel } from "@/components/admin/RecordPaymentForm";
import { clickableRow, rowLink } from "@/components/admin/row-link";
import { Section } from "@/components/admin/Section";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, todayIso } from "@/lib/documents/dates";
import { formatMoney, fromMinor, PAYMENT_METHOD_LABELS } from "@/lib/documents/money";
import { reasonLabel } from "@/lib/documents/reasons";
import { getDocumentType } from "@/lib/documents/registry";
import type { InvoiceBalance } from "@/lib/documents/service";

export function PaymentsSection({ balance }: { balance: InvoiceBalance }) {
  const { invoice, payments } = balance;
  return (
    <Section title="Payments">
      {payments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No payments recorded.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paid on</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="whitespace-nowrap">{formatDate(p.paidOn)}</TableCell>
                  <TableCell>{PAYMENT_METHOD_LABELS[p.method] ?? p.method}</TableCell>
                  <TableCell>
                    {p.reference ?? "—"}
                    {p.notes ? (
                      <span className="block text-xs text-muted-foreground">{p.notes}</span>
                    ) : null}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">
                    {formatMoney(p.amountMinor, p.currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    <ConfirmActionButton
                      action={deletePaymentAction}
                      id={p.id}
                      label="Remove"
                      variant="ghost"
                      confirm={`Remove the ${formatMoney(p.amountMinor, p.currency)} payment?`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {invoice.status === "issued" ? (
        <RecordPaymentPanel
          key={payments.length}
          documentId={invoice.id}
          currency={invoice.currency}
          defaultAmount={
            balance.outstandingMinor > 0 ? fromMinor(balance.outstandingMinor).toFixed(2) : ""
          }
          defaultDate={todayIso()}
        />
      ) : null}
    </Section>
  );
}

export function LinkedNotesSection({ balance }: { balance: InvoiceBalance }) {
  if (balance.notes.length === 0) return null;
  return (
    <Section title="Credit and debit notes">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Issue date</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {balance.notes.map((n) => {
              const data = n.data as { issueDate?: string; reason?: string };
              return (
                <TableRow key={n.id} className={clickableRow}>
                  <TableCell>
                    <Link href={`/admin/documents/${n.id}`} className={rowLink}>
                      {n.number ?? "Draft"}
                    </Link>
                  </TableCell>
                  <TableCell>{getDocumentType(n.type).label}</TableCell>
                  <TableCell>{data.reason ? reasonLabel(n.type, data.reason) : "—"}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(data.issueDate)}</TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">
                    {n.type === "credit_note" ? "−" : "+"}
                    {formatMoney(n.totalMinor, n.currency)}
                  </TableCell>
                  <TableCell>
                    <DocumentStatusBadge status={n.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Section>
  );
}
