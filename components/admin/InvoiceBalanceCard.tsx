import Link from "next/link";

import { DocumentStatusBadge } from "@/components/admin/DocumentStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/documents/dates";
import { formatMoney } from "@/lib/documents/money";
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
          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
            <dt>Balance</dt>
            <dd>{money(balance.balanceMinor)}</dd>
          </div>
        </dl>
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
