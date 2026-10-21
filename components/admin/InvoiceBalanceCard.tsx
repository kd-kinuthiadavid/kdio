import Link from "next/link";

import { deletePaymentAction } from "@/app/admin/(protected)/documents/actions";
import { ConfirmActionButton } from "@/components/admin/ConfirmActionButton";
import { DocumentStatusBadge } from "@/components/admin/DocumentStatusBadge";
import { PaymentStateBadge } from "@/components/admin/PaymentStateBadge";
import { RecordPaymentForm } from "@/components/admin/RecordPaymentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function InvoiceBalanceSummary({ balance }: { balance: InvoiceBalance }) {
  const { currency } = balance.invoice;
  const money = (minor: number) => formatMoney(minor, currency);
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-base">Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-1.5 text-sm tabular-nums">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Invoice total</dt>
            <dd>{money(balance.totalMinor)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Debit notes</dt>
            <dd>+{money(balance.debitMinor)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Credit notes</dt>
            <dd>−{money(balance.creditMinor)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-medium">
            <dt>Balance</dt>
            <dd>{money(balance.balanceMinor)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Payments</dt>
            <dd>−{money(balance.paidMinor)}</dd>
          </div>
          {balance.refundedMinor ? (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Refunds paid out</dt>
              <dd>+{money(balance.refundedMinor)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
            <dt>{balance.outstandingMinor < 0 ? "In credit" : "Outstanding"}</dt>
            <dd>{money(Math.abs(balance.outstandingMinor))}</dd>
          </div>
        </dl>
        <PaymentStateBadge state={balance.state} className="mt-3" />
      </CardContent>
    </Card>
  );
}

export function PaymentsCard({ balance }: { balance: InvoiceBalance }) {
  const { invoice, payments } = balance;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Payments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
          <RecordPaymentForm
            key={payments.length}
            documentId={invoice.id}
            currency={invoice.currency}
            defaultAmount={
              balance.outstandingMinor > 0 ? fromMinor(balance.outstandingMinor).toFixed(2) : ""
            }
            defaultDate={todayIso()}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}

export function LinkedNotesCard({ balance }: { balance: InvoiceBalance }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Credit and debit notes</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {balance.notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">None yet.</p>
        ) : (
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
                  <TableRow key={n.id}>
                    <TableCell>
                      <Link
                        href={`/admin/documents/${n.id}`}
                        className="font-medium underline-offset-4 hover:underline"
                      >
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
        )}
      </CardContent>
    </Card>
  );
}
