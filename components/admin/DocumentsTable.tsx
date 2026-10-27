import Link from "next/link";

import { DocumentStatusBadge } from "@/components/admin/DocumentStatusBadge";
import { PaymentStateBadge } from "@/components/admin/PaymentStateBadge";
import { ReminderStatus } from "@/components/admin/ReminderStatus";
import { clickableRow, rowInnerLink, rowLink } from "@/components/admin/row-link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CustomerRow, DocumentRow } from "@/db/schema";
import { customerDisplayName } from "@/lib/documents/customers";
import { formatDate } from "@/lib/documents/dates";
import { formatMoney } from "@/lib/documents/money";
import { daysOverdue, type PaymentSummary } from "@/lib/documents/payment-state";
import type { Receivable } from "@/lib/documents/payments";
import { getDocumentType } from "@/lib/documents/registry";
import type { ReminderState } from "@/lib/documents/reminders-data";
import { cn } from "@/lib/utils";

/** Ids of the rows whose payment state is worth showing. */
export function payableIds(rows: { document: DocumentRow }[]): string[] {
  return rows
    .filter(({ document: d }) => d.type === "invoice" && d.status === "issued")
    .map(({ document: d }) => d.id);
}

export function DocumentsTable({
  rows,
  payments,
  today,
  reminders,
  remindersRanToday = false,
  showCustomer = true,
}: {
  rows: { document: DocumentRow; customer: CustomerRow }[];
  payments: Map<string, PaymentSummary>;
  today: string;
  reminders?: Map<string, Pick<ReminderState, "paused" | "pendingStage">>;
  remindersRanToday?: boolean;
  showCustomer?: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Number</TableHead>
          <TableHead>Type</TableHead>
          {showCustomer ? <TableHead>Customer</TableHead> : null}
          <TableHead>Issue date</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ document: d, customer: c }) => {
          const data = d.data as { issueDate?: string; dueDate?: string };
          const payment = payments.get(d.id);
          const overdue = payment
            ? daysOverdue(data.dueDate, payment.outstandingMinor, today)
            : null;
          const reminder = reminders?.get(d.id);
          return (
            <TableRow key={d.id} className={clickableRow}>
              <TableCell>
                <Link href={`/admin/documents/${d.id}`} className={rowLink}>
                  {d.number ?? "Draft"}
                </Link>
              </TableCell>
              <TableCell>{getDocumentType(d.type).label}</TableCell>
              {showCustomer ? (
                <TableCell className="max-w-[220px] truncate">
                  <Link
                    href={`/admin/customers/${c.id}`}
                    className={rowInnerLink}
                  >
                    {customerDisplayName(c)}
                  </Link>
                </TableCell>
              ) : null}
              <TableCell className="whitespace-nowrap">
                {formatDate(data.issueDate)}
              </TableCell>
              <TableCell className="whitespace-nowrap text-right tabular-nums">
                {formatMoney(d.totalMinor, d.currency)}
              </TableCell>
              <TableCell>
                <DocumentStatusBadge status={d.status} />
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {payment ? (
                  <div className="flex flex-col items-start gap-1">
                    <PaymentStateBadge state={payment.state} />
                    {payment.outstandingMinor > 0 &&
                    payment.state !== "unpaid" ? (
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {formatMoney(payment.outstandingMinor, d.currency)} due
                      </span>
                    ) : null}
                    {overdue !== null ? (
                      <span className="text-xs font-medium text-danger">
                        Overdue {overdue} day{overdue === 1 ? "" : "s"}
                      </span>
                    ) : null}
                    {reminder ? (
                      <ReminderStatus
                        paused={reminder.paused}
                        pendingStage={reminder.pendingStage}
                        ranToday={remindersRanToday}
                      />
                    ) : null}
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export function ReceivablesCards({ receivables }: { receivables: Receivable[] }) {
  if (!receivables.length) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {receivables.map((r) => (
        <Card key={r.currency}>
          <CardContent className="space-y-1 pt-5">
            <p className="text-sm text-muted-foreground">Outstanding ({r.currency})</p>
            <p className="text-xl font-semibold tabular-nums">
              {formatMoney(r.outstandingMinor, r.currency)}
            </p>
            <p
              className={cn(
                "text-xs tabular-nums",
                r.overdueCount ? "font-medium text-danger" : "text-muted-foreground"
              )}
            >
              {r.overdueCount
                ? `${formatMoney(r.overdueMinor, r.currency)} overdue on ${r.overdueCount} invoice${r.overdueCount === 1 ? "" : "s"}`
                : "Nothing overdue"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
