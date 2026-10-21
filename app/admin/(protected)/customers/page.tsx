import Link from "next/link";

import { clickableRow, rowLink } from "@/components/admin/row-link";
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
import { listCustomers } from "@/lib/documents/customers";

export default async function CustomersPage() {
  const rows = await listCustomers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground">{rows.length} customers</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/customers/new">New customer</Link>
        </Button>
      </div>
      <Card>
        <CardContent className="overflow-x-auto pt-6">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No customers yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Terms</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.id} className={clickableRow}>
                    <TableCell>
                      <Link href={`/admin/customers/${c.id}`} className={rowLink}>
                        {c.name}
                      </Link>
                    </TableCell>
                    <TableCell>{c.company ?? "—"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{c.email ?? "—"}</TableCell>
                    <TableCell>{c.defaultCurrency}</TableCell>
                    <TableCell>Net {c.paymentTermsDays}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
