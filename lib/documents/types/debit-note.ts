import { z } from "zod";

import { computeLineTotals, isoDate, type Totals } from "@/lib/documents/line-items";
import { noteFields } from "@/lib/documents/types/note-fields";

export const DEBIT_NOTE_REASONS = {
  scope_increase: "Additional scope",
  underbilling: "Underbilling correction",
  additional_expense: "Additional expense",
  late_fee: "Late payment fee",
  fx_adjustment: "Exchange rate adjustment",
} as const;
export type DebitNoteReason = keyof typeof DEBIT_NOTE_REASONS;

const reasonKeys = Object.keys(DEBIT_NOTE_REASONS) as [DebitNoteReason, ...DebitNoteReason[]];

export const debitNoteDataSchema = z
  .object({
    ...noteFields,
    reason: z.enum(reasonKeys, { error: "Choose a reason" }),
    dueDate: isoDate,
    terms: z.string().trim().max(2000).optional(),
  })
  .refine((d) => d.dueDate >= d.issueDate, {
    message: "Due date cannot be before the issue date",
    path: ["dueDate"],
  });

export type DebitNoteData = z.infer<typeof debitNoteDataSchema>;

export function computeDebitNoteTotals(data: DebitNoteData): Totals {
  return computeLineTotals(data.lines, data.documentDiscount);
}
