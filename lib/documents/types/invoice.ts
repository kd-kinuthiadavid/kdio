import { z } from "zod";

import {
  computeLineTotals,
  discountSchema,
  isoDate,
  lineItemSchema,
  type Totals,
} from "@/lib/documents/line-items";

export const invoiceDataSchema = z
  .object({
    issueDate: isoDate,
    dueDate: isoDate,
    servicePeriodFrom: isoDate.optional(),
    servicePeriodTo: isoDate.optional(),
    /** Customer PO number or other reference */
    reference: z.string().trim().max(120).optional(),
    lines: z.array(lineItemSchema).min(1, "Add at least one line item"),
    documentDiscount: discountSchema.nullable().default(null),
    notes: z.string().trim().max(2000).optional(),
    terms: z.string().trim().max(2000).optional(),
  })
  .refine((d) => d.dueDate >= d.issueDate, {
    message: "Due date cannot be before the issue date",
    path: ["dueDate"],
  })
  .refine(
    (d) =>
      !d.servicePeriodFrom ||
      !d.servicePeriodTo ||
      d.servicePeriodTo >= d.servicePeriodFrom,
    { message: "Service period end is before its start", path: ["servicePeriodTo"] }
  );

export type InvoiceData = z.infer<typeof invoiceDataSchema>;

export function computeInvoiceTotals(data: InvoiceData): Totals {
  return computeLineTotals(data.lines, data.documentDiscount);
}
