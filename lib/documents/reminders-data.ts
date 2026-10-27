import { and, eq, inArray, sql } from "drizzle-orm";

import { customers, documents, type CustomerRow, type DocumentRow } from "@/db/schema";
import { getDb } from "@/lib/db";
import { TIME_ZONE } from "@/lib/documents/dates";
import type { PaymentSummary } from "@/lib/documents/payment-state";
import { getPaymentSummaries } from "@/lib/documents/payments";
import { pendingReminderStage, type ReminderStage } from "@/lib/documents/reminders";
import { DocumentValidationError, type Actor } from "@/lib/documents/service";
import { getSnapshot } from "@/lib/documents/snapshot";

export type ReminderState = {
  pendingStage: ReminderStage | null;
  paused: boolean;
  sentStages: string[];
  lastContactOn: string | null;
  /** Recipients of the latest `sent` event */
  lastSentTo: string[] | null;
  payment: PaymentSummary;
};

type InvoiceRef = Pick<DocumentRow, "id" | "data" | "remindersPausedAt">;

async function computeStates(
  invoices: InvoiceRef[],
  today: string
): Promise<Map<string, ReminderState>> {
  if (invoices.length === 0) return new Map();
  const ids = invoices.map((i) => i.id);
  const idList = sql.join(
    ids.map((id) => sql`${id}::uuid`),
    sql`, `
  );
  const [summaries, events] = await Promise.all([
    getPaymentSummaries(ids),
    getDb().execute<{
      id: string;
      stages: string[];
      last_contact_on: string | null;
      last_sent_to: string[] | null;
    }>(sql`
      SELECT document_id AS id,
        COALESCE(
          jsonb_agg(DISTINCT payload->>'stage') FILTER (WHERE type = 'reminder_sent'),
          '[]'::jsonb
        ) AS stages,
        to_char(max(created_at) AT TIME ZONE ${TIME_ZONE}, 'YYYY-MM-DD') AS last_contact_on,
        (jsonb_agg(payload->'to' ORDER BY created_at DESC) FILTER (WHERE type = 'sent'))->0 AS last_sent_to
      FROM document_events
      WHERE document_id IN (${idList}) AND type IN ('sent', 'reminder_sent')
      GROUP BY document_id
    `),
  ]);
  const byId = new Map(events.rows.map((r) => [r.id, r]));

  const states = new Map<string, ReminderState>();
  for (const invoice of invoices) {
    const payment = summaries.get(invoice.id);
    if (!payment) continue;
    const ev = byId.get(invoice.id);
    const data = invoice.data as { issueDate?: string; dueDate?: string };
    const sentStages = (ev?.stages ?? []).filter((s): s is string => typeof s === "string");
    const paused = invoice.remindersPausedAt !== null;
    const lastContactOn = ev?.last_contact_on ?? null;
    states.set(invoice.id, {
      pendingStage: pendingReminderStage({
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        outstandingMinor: payment.outstandingMinor,
        paused,
        sentStages: new Set(sentStages),
        lastContactOn,
        today,
      }),
      paused,
      sentStages,
      lastContactOn,
      lastSentTo: Array.isArray(ev?.last_sent_to) ? ev.last_sent_to : null,
      payment,
    });
  }
  return states;
}

/** Reminder state for issued invoices, keyed by id; other documents are left out. */
export async function getReminderStates(
  invoiceIds: string[],
  today: string
): Promise<Map<string, ReminderState>> {
  if (invoiceIds.length === 0) return new Map();
  const invoices = await getDb()
    .select({ id: documents.id, data: documents.data, remindersPausedAt: documents.remindersPausedAt })
    .from(documents)
    .where(
      and(
        inArray(documents.id, invoiceIds),
        eq(documents.type, "invoice"),
        eq(documents.status, "issued")
      )
    );
  return computeStates(invoices, today);
}

/**
 * Pauses or resumes automatic reminders on an issued invoice. The state
 * change and its audit event share one statement; repeating it is a no-op.
 */
export async function setRemindersPaused(id: string, paused: boolean, actor: Actor = "admin") {
  const result = await getDb().execute<{ id: string }>(sql`
    WITH upd AS (
      UPDATE documents SET reminders_paused_at = ${paused ? sql`now()` : sql`NULL`}
      WHERE id = ${id} AND type = 'invoice' AND status = 'issued'
        AND (reminders_paused_at IS NULL) = ${paused}
      RETURNING id
    ), ev AS (
      INSERT INTO document_events (document_id, type, actor)
      SELECT id, ${paused ? "reminders_paused" : "reminders_resumed"}, ${actor} FROM upd
    )
    SELECT id FROM upd
  `);
  if (result.rows[0]) return;
  const [current] = await getDb()
    .select({ type: documents.type, status: documents.status })
    .from(documents)
    .where(eq(documents.id, id));
  if (current?.type !== "invoice" || current.status !== "issued") {
    throw new DocumentValidationError("Reminders only apply to issued invoices");
  }
}

/** Who a reminder goes to: whoever last received the invoice, else the customer. */
export function reminderRecipients(
  document: DocumentRow,
  customer: Pick<CustomerRow, "email">,
  lastSentTo: string[] | null
): string[] {
  if (lastSentTo?.length) return lastSentTo;
  const email = getSnapshot(document)?.customer.email ?? customer.email;
  return email ? [email] : [];
}

export type DueReminder = {
  id: string;
  number: string;
  stage: ReminderStage;
  dueDate: string;
  to: string[];
};

/** Issued invoices with a reminder due today, oldest due date first. */
export async function findDueReminders(today: string, limit = 50): Promise<DueReminder[]> {
  const rows = await getDb()
    .select({ document: documents, customerEmail: customers.email })
    .from(documents)
    .innerJoin(customers, eq(documents.customerId, customers.id))
    .where(and(eq(documents.type, "invoice"), eq(documents.status, "issued")));
  const states = await computeStates(
    rows.map((r) => r.document),
    today
  );

  const due: DueReminder[] = [];
  for (const { document, customerEmail } of rows) {
    const state = states.get(document.id);
    if (!state?.pendingStage) continue;
    due.push({
      id: document.id,
      number: document.number ?? "",
      stage: state.pendingStage,
      dueDate: (document.data as { dueDate?: string }).dueDate ?? "",
      to: reminderRecipients(document, { email: customerEmail }, state.lastSentTo),
    });
  }
  return due.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, limit);
}
