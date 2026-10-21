import { z } from "zod";

import { discountSchema, isoDate, lineItemSchema } from "@/lib/documents/line-items";

/** Fields shared by credit and debit notes; the parent invoice is `related_document_id`. */
export const noteFields = {
  issueDate: isoDate,
  reasonDetails: z.string().trim().max(500).optional(),
  reference: z.string().trim().max(120).optional(),
  lines: z.array(lineItemSchema).min(1, "Add at least one line item"),
  documentDiscount: discountSchema.nullable().default(null),
  notes: z.string().trim().max(2000).optional(),
};
