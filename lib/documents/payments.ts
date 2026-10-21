import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { documents } from "@/db/schema";
import { getDb } from "@/lib/db";
import { PAYMENT_METHODS, toMinor } from "@/lib/documents/money";
import {
  daysOverdue,
  summarizePayments,
  type PaymentSummary,
} from "@/lib/documents/payment-state";
import { DocumentValidationError, type Actor } from "@/lib/documents/service";
import { fieldErrorsFrom } from "@/lib/zod-errors";

const optionalText = z
  .string()
  .trim()
  .max(500)
  .transform((v) => v || undefined)
  .optional();

export const paymentInputSchema = z.object({
  /** Major units as typed; parsed to minor units */
  amount: z
    .string()
    .trim()
    .regex(/^\d[\d,]*(\.\d{1,2})?$/, "Enter an amount like 1,250.00")
    .transform(toMinor)
    .refine((v) => v > 0, "Must be more than zero"),
  paidOn: z.iso.date("Pick the date it was paid"),
  method: z.enum(PAYMENT_METHODS, { error: "Choose a method" }),
  reference: optionalText,
  notes: optionalText,
});

export type PaymentInput = z.input<typeof paymentInputSchema>;

/**
 * Records a payment against an issued invoice in its currency. The status
 * check, the insert and the audit event share one statement.
 */
export async function recordPayment(documentId: string, input: PaymentInput, actor: Actor = "admin") {
  const parsed = paymentInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new DocumentValidationError(
      "Please fix the highlighted fields",
      fieldErrorsFrom(parsed.error)
    );
  }
  const p = parsed.data;
  const result = await getDb().execute<{ id: string }>(sql`
    WITH ins AS (
      INSERT INTO document_payments
        (document_id, amount_minor, currency, paid_on, method, reference, notes, created_by)
      SELECT d.id, ${p.amount}, d.currency, ${p.paidOn}::date, ${p.method},
        ${p.reference ?? null}, ${p.notes ?? null}, ${actor}
      FROM documents d
      WHERE d.id = ${documentId} AND d.type = 'invoice' AND d.status = 'issued'
      RETURNING id, document_id, amount_minor, currency, paid_on, method
    ), ev AS (
      INSERT INTO document_events (document_id, type, actor, payload)
      SELECT document_id, 'payment_recorded', ${actor}, jsonb_build_object(
        'paymentId', id, 'amountMinor', amount_minor, 'currency', currency,
        'paidOn', paid_on, 'method', method)
      FROM ins
    )
    SELECT id FROM ins
  `);
  if (!result.rows[0]) {
    throw new DocumentValidationError("Payments can only be recorded against issued invoices");
  }
  return result.rows[0];
}

export async function deletePayment(paymentId: string, actor: Actor = "admin") {
  const result = await getDb().execute<{ id: string }>(sql`
    WITH del AS (
      DELETE FROM document_payments WHERE id = ${paymentId}
      RETURNING id, document_id, amount_minor, currency, paid_on, method
    ), ev AS (
      INSERT INTO document_events (document_id, type, actor, payload)
      SELECT document_id, 'payment_removed', ${actor}, jsonb_build_object(
        'paymentId', id, 'amountMinor', amount_minor, 'currency', currency,
        'paidOn', paid_on, 'method', method)
      FROM del
    )
    SELECT document_id AS id FROM del
  `);
  if (!result.rows[0]) throw new DocumentValidationError("Payment not found");
  return { documentId: result.rows[0].id };
}

export type Receivable = {
  currency: string;
  outstandingMinor: number;
  overdueMinor: number;
  overdueCount: number;
};

/** Outstanding and overdue totals per currency across every issued invoice. */
export async function getReceivables(
  today: string,
  filters: { customerId?: string } = {}
): Promise<Receivable[]> {
  const invoices = await getDb()
    .select({ id: documents.id, currency: documents.currency, data: documents.data })
    .from(documents)
    .where(
      and(
        eq(documents.type, "invoice"),
        eq(documents.status, "issued"),
        filters.customerId ? eq(documents.customerId, filters.customerId) : undefined
      )
    );
  const summaries = await getPaymentSummaries(invoices.map((i) => i.id));
  const byCurrency = new Map<string, Receivable>();
  for (const invoice of invoices) {
    const summary = summaries.get(invoice.id);
    if (!summary || summary.outstandingMinor <= 0) continue;
    const row = byCurrency.get(invoice.currency) ?? {
      currency: invoice.currency,
      outstandingMinor: 0,
      overdueMinor: 0,
      overdueCount: 0,
    };
    row.outstandingMinor += summary.outstandingMinor;
    const dueDate = (invoice.data as { dueDate?: string }).dueDate;
    if (daysOverdue(dueDate, summary.outstandingMinor, today) !== null) {
      row.overdueMinor += summary.outstandingMinor;
      row.overdueCount += 1;
    }
    byCurrency.set(invoice.currency, row);
  }
  return [...byCurrency.values()].sort((a, b) => a.currency.localeCompare(b.currency));
}

/** Payment summaries for many invoices in one query, keyed by invoice id. */
export async function getPaymentSummaries(
  invoiceIds: string[]
): Promise<Map<string, PaymentSummary>> {
  if (invoiceIds.length === 0) return new Map();
  const ids = sql.join(
    invoiceIds.map((id) => sql`${id}::uuid`),
    sql`, `
  );
  const result = await getDb().execute<{
    id: string;
    balance: string;
    refunded: string;
    paid: string;
  }>(sql`
    SELECT d.id,
      d.total_minor + COALESCE(SUM(
        CASE WHEN n.type = 'debit_note' THEN n.total_minor ELSE -n.total_minor END
      ), 0) AS balance,
      COALESCE(SUM(n.total_minor) FILTER (
        WHERE n.type = 'credit_note' AND n.data->'settlement'->>'method' = 'refund'
      ), 0) AS refunded,
      (SELECT COALESCE(SUM(p.amount_minor), 0) FROM document_payments p WHERE p.document_id = d.id) AS paid
    FROM documents d
    LEFT JOIN documents n ON n.related_document_id = d.id AND n.status = 'issued'
    WHERE d.id IN (${ids}) AND d.type = 'invoice'
    GROUP BY d.id, d.total_minor
  `);
  return new Map(
    result.rows.map((r) => [
      r.id,
      summarizePayments({
        balanceMinor: Number(r.balance),
        paidMinor: Number(r.paid),
        refundedMinor: Number(r.refunded),
      }),
    ])
  );
}
