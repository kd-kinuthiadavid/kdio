import { z } from "zod";

import { allocate, percentOf } from "@/lib/documents/money";

export const UNITS = ["hour", "day", "week", "month", "item", "fixed"] as const;
export type Unit = (typeof UNITS)[number];

export const isoDate = z.iso.date();

/** `value` is a percentage (0-100) for `percent`, or minor units for `amount`. */
export const discountSchema = z
  .object({
    kind: z.enum(["percent", "amount"]),
    value: z.number({ error: "Enter a discount value" }).min(0, "Discount cannot be negative"),
  })
  .refine((d) => d.kind !== "percent" || d.value <= 100, {
    message: "Percentage discount cannot exceed 100",
  });

export type Discount = z.infer<typeof discountSchema>;

export const lineItemSchema = z.object({
  id: z.string().min(1),
  description: z.string().trim().min(1, "Description is required"),
  quantity: z.number({ error: "Enter a quantity" }).positive("Quantity must be above 0"),
  unit: z.enum(UNITS),
  unitPriceMinor: z
    .number({ error: "Enter a unit price" })
    .int()
    .min(0, "Unit price cannot be negative"),
  discount: discountSchema.nullable().default(null),
  taxRate: z
    .number({ error: "Enter a tax rate" })
    .min(0, "Tax rate cannot be negative")
    .max(100, "Tax rate cannot exceed 100")
    .default(0),
});

export type LineItem = z.infer<typeof lineItemSchema>;

export type LineTotals = {
  grossMinor: number;
  lineDiscountMinor: number;
  documentDiscountMinor: number;
  netMinor: number;
  taxMinor: number;
};

export type Totals = {
  lines: LineTotals[];
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalMinor: number;
  taxBreakdown: { rate: number; taxableMinor: number; taxMinor: number }[];
};

function discountAmount(baseMinor: number, discount: Discount | null): number {
  if (!discount || baseMinor <= 0) return 0;
  const raw =
    discount.kind === "percent"
      ? percentOf(baseMinor, discount.value)
      : Math.round(discount.value);
  return Math.min(raw, baseMinor);
}

/**
 * Line discounts apply first, then the document discount is allocated across
 * lines in proportion to their net amount so tax is computed on what is charged.
 */
export function computeLineTotals(
  lines: LineItem[],
  documentDiscount: Discount | null
): Totals {
  const gross = lines.map((l) => Math.round(l.quantity * l.unitPriceMinor));
  const lineDiscounts = lines.map((l, i) => discountAmount(gross[i], l.discount));
  const afterLine = gross.map((g, i) => g - lineDiscounts[i]);
  const netBeforeDocument = afterLine.reduce((a, b) => a + b, 0);
  const docDiscount = discountAmount(netBeforeDocument, documentDiscount);
  const docShares = allocate(docDiscount, afterLine);

  const lineTotals: LineTotals[] = lines.map((l, i) => {
    const net = afterLine[i] - docShares[i];
    return {
      grossMinor: gross[i],
      lineDiscountMinor: lineDiscounts[i],
      documentDiscountMinor: docShares[i],
      netMinor: net,
      taxMinor: percentOf(net, l.taxRate),
    };
  });

  const byRate = new Map<number, { taxableMinor: number; taxMinor: number }>();
  lines.forEach((l, i) => {
    if (l.taxRate <= 0) return;
    const entry = byRate.get(l.taxRate) ?? { taxableMinor: 0, taxMinor: 0 };
    entry.taxableMinor += lineTotals[i].netMinor;
    entry.taxMinor += lineTotals[i].taxMinor;
    byRate.set(l.taxRate, entry);
  });

  const subtotalMinor = gross.reduce((a, b) => a + b, 0);
  const discountMinor =
    lineDiscounts.reduce((a, b) => a + b, 0) + docDiscount;
  const taxMinor = lineTotals.reduce((a, t) => a + t.taxMinor, 0);

  return {
    lines: lineTotals,
    subtotalMinor,
    discountMinor,
    taxMinor,
    totalMinor: subtotalMinor - discountMinor + taxMinor,
    taxBreakdown: [...byRate.entries()]
      .sort(([a], [b]) => a - b)
      .map(([rate, v]) => ({ rate, ...v })),
  };
}

export function newLineItemId(): string {
  return Math.random().toString(36).slice(2, 10);
}
