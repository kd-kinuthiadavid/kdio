import Link from "next/link";

import { DocumentStatusBadge } from "@/components/admin/DocumentStatusBadge";
import { PaymentStateBadge } from "@/components/admin/PaymentStateBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DocumentStatus } from "@/db/schema";
import { customerDisplayName } from "@/lib/documents/customers";
import { formatDate, todayIso } from "@/lib/documents/dates";
import { formatMoney } from "@/lib/documents/money";
import { daysOverdue } from "@/lib/documents/payment-state";
import { getPaymentSummaries, getReceivables } from "@/lib/documents/payments";
import { getDocumentType, isDocumentType, listDocumentTypes } from "@/lib/documents/registry";
import { listDocuments } from "@/lib/documents/service";
import { cn } from "@/lib/utils";

const STATUSES: DocumentStatus[] = ["draft", "issued", "void"];

function filterHref(params: { type?: string; status?: string }) {
  const q = new URLSearchParams();
  if (params.type) q.set("type", params.type);
  if (params.status) q.set("status", params.status);
  const s = q.toString();
  return s ? `/admin/documents?${s}` : "/admin/documents";
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-2.5 py-1 text-xs transition-colors hover:bg-accent/60 hover:text-accent-foreground",
        active ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  );
}

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const type = sp.type && isDocumentType(sp.type) ? sp.type : undefined;
  const status = STATUSES.find((s) => s === sp.status);
  const today = todayIso();
  const rows = await listDocuments({ type, status });
  const [payments, receivables] = await Promise.all([
    getPaymentSummaries(
      rows
        .filter(({ document: d }) => d.type === "invoice" && d.status === "issued")
        .map(({ document: d }) => d.id)
    ),
    getReceivables(today),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
          <p className="text-sm text-muted-foreground">{rows.length} shown</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/documents/new">New invoice</Link>
        </Button>
      </div>

      {receivables.length ? (
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
      ) : null}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex flex-wrap gap-1">
          <FilterLink href={filterHref({ status })} active={!type}>
            All types
          </FilterLink>
          {listDocumentTypes().map((d) => (
            <FilterLink key={d.type} href={filterHref({ type: d.type, status })} active={type === d.type}>
              {d.label}
            </FilterLink>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          <FilterLink href={filterHref({ type })} active={!status}>
            Any status
          </FilterLink>
          {STATUSES.map((s) => (
            <FilterLink key={s} href={filterHref({ type, status: s })} active={status === s}>
              <span className="capitalize">{s}</span>
            </FilterLink>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto pt-6">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Customer</TableHead>
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
                  return (
                    <TableRow key={d.id}>
                      <TableCell>
                        <Link
                          href={`/admin/documents/${d.id}`}
                          className="font-medium underline-offset-4 hover:underline"
                        >
                          {d.number ?? "Draft"}
                        </Link>
                      </TableCell>
                      <TableCell>{getDocumentType(d.type).label}</TableCell>
                      <TableCell className="max-w-[220px] truncate">{customerDisplayName(c)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(data.issueDate)}</TableCell>
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
                            {payment.outstandingMinor > 0 && payment.state !== "unpaid" ? (
                              <span className="text-xs tabular-nums text-muted-foreground">
                                {formatMoney(payment.outstandingMinor, d.currency)} due
                              </span>
                            ) : null}
                            {overdue !== null ? (
                              <span className="text-xs font-medium text-danger">
                                Overdue {overdue} day{overdue === 1 ? "" : "s"}
                              </span>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
