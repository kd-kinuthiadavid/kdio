import { z } from "zod";

import { computeLineTotals, isoDate, type Totals } from "@/lib/documents/line-items";
import { PAYMENT_METHODS } from "@/lib/documents/money";
import { noteFields } from "@/lib/documents/types/note-fields";

export const CREDIT_NOTE_REASONS = {
  refund: "Refund",
  scope_reduction: "Scope reduction",
  post_issue_discount: "Discount after issue",
  billing_error: "Billing error",
  cancellation: "Cancellation",
  goodwill: "Goodwill credit",
  bad_debt: "Bad debt write-off",
} as const;
export type CreditNoteReason = keyof typeof CREDIT_NOTE_REASONS;

export const SETTLEMENT_METHODS = {
  refund: "Refund to customer",
  apply_to_balance: "Apply to invoice balance",
  future_credit: "Hold as credit for future invoices",
} as const;
export type SettlementMethod = keyof typeof SETTLEMENT_METHODS;

const reasonKeys = Object.keys(CREDIT_NOTE_REASONS) as [CreditNoteReason, ...CreditNoteReason[]];
const settlementKeys = Object.keys(SETTLEMENT_METHODS) as [SettlementMethod, ...SettlementMethod[]];

export const creditNoteDataSchema = z
  .object({
    ...noteFields,
    reason: z.enum(reasonKeys, { error: "Choose a reason" }),
    settlement: z.object({
      method: z.enum(settlementKeys, { error: "Choose how the credit is settled" }),
      refundMethod: z.enum(PAYMENT_METHODS).optional(),
      refundDate: isoDate.optional(),
    }),
  })
  .refine((d) => d.settlement.method !== "refund" || d.settlement.refundMethod, {
    message: "Choose how the refund is paid",
    path: ["settlement", "refundMethod"],
  });

export type CreditNoteData = z.infer<typeof creditNoteDataSchema>;

export function computeCreditNoteTotals(data: CreditNoteData): Totals {
  return computeLineTotals(data.lines, data.documentDiscount);
}
