import { Section } from "@/components/admin/Section";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DocumentRow } from "@/db/schema";
import { discountLabel, quantityLabel, type LineItem } from "@/lib/documents/line-items";
import { formatAmount, formatMoney } from "@/lib/documents/money";
import { getDocumentType } from "@/lib/documents/registry";
import { getSnapshot } from "@/lib/documents/snapshot";

type LineData = { lines: LineItem[]; notes?: string; terms?: string };

function TotalRow({
  label,
  children,
  strong,
}: {
  label: string;
  children: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div
      className={
        strong
          ? "flex justify-between gap-6 border-t border-border pt-2 text-base font-semibold"
          : "flex justify-between gap-6"
      }
    >
      <dt className={strong ? undefined : "text-muted-foreground"}>{label}</dt>
      <dd className="tabular-nums">{children}</dd>
    </div>
  );
}

/** What the document charges, from the frozen totals once issued. */
export function LineItemsSection({ document: d }: { document: DocumentRow }) {
  const def = getDocumentType(d.type);
  const data = def.schema.parse(d.data) as LineData;
  const totals = getSnapshot(d)?.totals ?? def.computeTotals(data);
  const showDiscount = data.lines.some((l) => l.discount);
  const showTax = data.lines.some((l) => l.taxRate > 0);
  const lineDiscount = totals.lines.reduce((a, l) => a + l.lineDiscountMinor, 0);
  const docDiscount = totals.discountMinor - lineDiscount;

  return (
    <Section title="Line items">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Unit price</TableHead>
              {showDiscount ? <TableHead className="text-right">Discount</TableHead> : null}
              {showTax ? <TableHead className="text-right">Tax</TableHead> : null}
              <TableHead className="text-right">Amount ({d.currency})</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.lines.map((l, i) => {
              const t = totals.lines[i];
              return (
                <TableRow key={l.id}>
                  <TableCell className="min-w-[16rem] whitespace-pre-line">{l.description}</TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">
                    {quantityLabel(l)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">
                    {formatAmount(l.unitPriceMinor)}
                  </TableCell>
                  {showDiscount ? (
                    <TableCell className="whitespace-nowrap text-right tabular-nums">
                      {t ? discountLabel(l, t.lineDiscountMinor) : "—"}
                    </TableCell>
                  ) : null}
                  {showTax ? (
                    <TableCell className="whitespace-nowrap text-right tabular-nums">
                      {l.taxRate ? `${l.taxRate}%` : "—"}
                    </TableCell>
                  ) : null}
                  <TableCell className="whitespace-nowrap text-right tabular-nums">
                    {t ? formatAmount(t.grossMinor - t.lineDiscountMinor) : "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl space-y-3 text-sm">
          {data.notes ? (
            <div>
              <p className="text-muted-foreground">Notes</p>
              <p className="whitespace-pre-line">{data.notes}</p>
            </div>
          ) : null}
          {data.terms ? (
            <div>
              <p className="text-muted-foreground">Terms</p>
              <p className="whitespace-pre-line">{data.terms}</p>
            </div>
          ) : null}
        </div>
        <dl className="w-full space-y-1.5 text-sm sm:w-72 sm:shrink-0">
          <TotalRow label="Subtotal">{formatAmount(totals.subtotalMinor - lineDiscount)}</TotalRow>
          {docDiscount > 0 ? (
            <TotalRow label="Discount">−{formatAmount(docDiscount)}</TotalRow>
          ) : null}
          {totals.taxBreakdown.map((t) => (
            <TotalRow key={t.rate} label={`Tax ${t.rate}% on ${formatAmount(t.taxableMinor)}`}>
              {formatAmount(t.taxMinor)}
            </TotalRow>
          ))}
          <TotalRow label="Total" strong>
            {formatMoney(totals.totalMinor, d.currency)}
          </TotalRow>
        </dl>
      </div>
    </Section>
  );
}
