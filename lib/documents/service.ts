import { and, asc, desc, eq, sql, type SQL } from "drizzle-orm";
import { z } from "zod";

import {
  customers,
  documentEvents,
  documents,
  type DocumentEventRow,
  type DocumentRow,
  type DocumentStatus,
  type DocumentType,
} from "@/db/schema";
import { getDb } from "@/lib/db";
import { getIssuer } from "@/lib/documents/issuer";
import { CURRENCIES, formatMoney } from "@/lib/documents/money";
import { getDocumentType } from "@/lib/documents/registry";
import {
  customerSnapshot,
  type DocumentSnapshot,
  type RelatedSnapshot,
} from "@/lib/documents/snapshot";
import { fieldErrorsFrom } from "@/lib/zod-errors";

export type Actor = string;

export class DocumentValidationError extends Error {
  constructor(
    message: string,
    readonly fieldErrors: Record<string, string> = {}
  ) {
    super(message);
  }
}

const draftInputSchema = z.object({
  customerId: z.string().uuid("Choose a customer"),
  currency: z.enum(CURRENCIES),
  relatedDocumentId: z.string().uuid().nullish(),
});

export type DraftInput = {
  type: DocumentType;
  customerId: string;
  currency: string;
  data: unknown;
  relatedDocumentId?: string | null;
};

function prepare(input: DraftInput) {
  const def = getDocumentType(input.type);
  const meta = draftInputSchema.safeParse(input);
  const parsed = def.schema.safeParse(input.data);
  const errors = {
    ...(meta.success ? {} : fieldErrorsFrom(meta.error)),
    ...(parsed.success ? {} : fieldErrorsFrom(parsed.error)),
  };
  if (!meta.success || !parsed.success) {
    throw new DocumentValidationError("Please fix the highlighted fields", errors);
  }
  if (def.requiresParent && !meta.data.relatedDocumentId) {
    throw new DocumentValidationError(`${def.label} must reference an invoice`);
  }
  return {
    def,
    meta: meta.data,
    data: parsed.data as Record<string, unknown>,
    totals: def.computeTotals(parsed.data),
  };
}

export type InvoiceBalance = {
  invoice: DocumentRow;
  /** Every note that references the invoice, in any status */
  notes: DocumentRow[];
  totalMinor: number;
  debitMinor: number;
  creditMinor: number;
  /** Invoice total + issued debit notes − issued credit notes */
  balanceMinor: number;
};

export async function getInvoiceBalance(invoiceId: string): Promise<InvoiceBalance | null> {
  const db = getDb();
  const [invoice] = await db.select().from(documents).where(eq(documents.id, invoiceId)).limit(1);
  if (!invoice || invoice.type !== "invoice") return null;
  const notes = await db
    .select()
    .from(documents)
    .where(eq(documents.relatedDocumentId, invoiceId))
    .orderBy(asc(documents.createdAt));
  const issuedSum = (type: DocumentType) =>
    notes
      .filter((n) => n.type === type && n.status === "issued")
      .reduce((sum, n) => sum + n.totalMinor, 0);
  const debitMinor = issuedSum("debit_note");
  const creditMinor = issuedSum("credit_note");
  return {
    invoice,
    notes,
    totalMinor: invoice.totalMinor,
    debitMinor,
    creditMinor,
    balanceMinor: invoice.totalMinor + debitMinor - creditMinor,
  };
}

/**
 * Notes must point at an issued invoice for the same customer and currency,
 * and issued credit can never exceed the invoice total plus its debit notes.
 */
async function checkParent(
  type: DocumentType,
  meta: { customerId: string; currency: string; relatedDocumentId?: string | null },
  totalMinor: number
): Promise<DocumentRow | null> {
  const def = getDocumentType(type);
  if (!def.requiresParent) {
    if (meta.relatedDocumentId) {
      throw new DocumentValidationError(`${def.label} cannot reference another document`);
    }
    return null;
  }
  const balance = meta.relatedDocumentId ? await getInvoiceBalance(meta.relatedDocumentId) : null;
  if (!balance) throw new DocumentValidationError(`${def.label} must reference an invoice`);
  const parent = balance.invoice;
  if (parent.status !== "issued") {
    throw new DocumentValidationError(
      `Invoice ${parent.number ?? "draft"} is ${parent.status}; notes need an issued invoice`
    );
  }
  if (parent.customerId !== meta.customerId) {
    throw new DocumentValidationError("Please fix the highlighted fields", {
      customerId: `Must match the customer on ${parent.number}`,
    });
  }
  if (parent.currency !== meta.currency) {
    throw new DocumentValidationError("Please fix the highlighted fields", {
      currency: `Must be ${parent.currency}, the currency of ${parent.number}`,
    });
  }
  if (type === "credit_note") {
    const available = balance.balanceMinor;
    if (totalMinor > available) {
      throw new DocumentValidationError(
        `This credit (${formatMoney(totalMinor, parent.currency)}) exceeds what remains creditable on ${parent.number} (${formatMoney(available, parent.currency)})`
      );
    }
  }
  return parent;
}

export async function createDraft(input: DraftInput, actor: Actor = "admin") {
  const { meta, data, totals } = prepare(input);
  await checkParent(input.type, meta, totals.totalMinor);
  const id = crypto.randomUUID();
  const db = getDb();
  await db.batch([
    db.insert(documents).values({
      id,
      type: input.type,
      status: "draft",
      customerId: meta.customerId,
      relatedDocumentId: meta.relatedDocumentId ?? null,
      currency: meta.currency,
      totalMinor: totals.totalMinor,
      data,
      createdBy: actor,
    }),
    db.insert(documentEvents).values({ documentId: id, type: "created", actor }),
  ]);
  return { id };
}

export async function updateDraft(
  id: string,
  input: DraftInput,
  actor: Actor = "admin"
) {
  const db = getDb();
  const [existing] = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  if (!existing || existing.status !== "draft") {
    throw new DocumentValidationError("Only drafts can be edited");
  }
  const { meta, data, totals } = prepare({
    ...input,
    type: existing.type,
    relatedDocumentId: existing.relatedDocumentId,
  });
  await checkParent(existing.type, meta, totals.totalMinor);
  const updated = await db
    .update(documents)
    .set({
      customerId: meta.customerId,
      currency: meta.currency,
      totalMinor: totals.totalMinor,
      data,
      updatedAt: new Date(),
    })
    .where(and(eq(documents.id, id), eq(documents.status, "draft")))
    .returning({ id: documents.id });
  if (updated.length === 0) {
    throw new DocumentValidationError("Only drafts can be edited");
  }
  await db.insert(documentEvents).values({ documentId: id, type: "updated", actor });
  return { id };
}

export async function deleteDraft(id: string) {
  const deleted = await getDb()
    .delete(documents)
    .where(and(eq(documents.id, id), eq(documents.status, "draft")))
    .returning({ id: documents.id });
  if (deleted.length === 0) {
    throw new DocumentValidationError("Only drafts can be deleted");
  }
}

export async function getDocument(id: string) {
  const [row] = await getDb()
    .select({ document: documents, customer: customers })
    .from(documents)
    .innerJoin(customers, eq(documents.customerId, customers.id))
    .where(eq(documents.id, id))
    .limit(1);
  return row ?? null;
}

export async function listDocuments(filters: {
  type?: DocumentType;
  status?: DocumentStatus;
  limit?: number;
} = {}) {
  const where: SQL[] = [];
  if (filters.type) where.push(eq(documents.type, filters.type));
  if (filters.status) where.push(eq(documents.status, filters.status));
  return getDb()
    .select({ document: documents, customer: customers })
    .from(documents)
    .innerJoin(customers, eq(documents.customerId, customers.id))
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(documents.createdAt))
    .limit(filters.limit ?? 200);
}

export async function listEvents(documentId: string): Promise<DocumentEventRow[]> {
  return getDb()
    .select()
    .from(documentEvents)
    .where(eq(documentEvents.documentId, documentId))
    .orderBy(desc(documentEvents.createdAt));
}

/**
 * Locks a draft: validates it again, freezes issuer/customer/totals into the
 * snapshot, and assigns the next number for (type, year). The neon-http driver
 * has no interactive transactions, so numbering, the status change and the
 * audit event happen in one statement; the sequence only advances when the
 * document is still a draft.
 */
export async function issueDocument(
  id: string,
  actor: Actor = "admin"
): Promise<{ id: string; number: string }> {
  const found = await getDocument(id);
  if (!found) throw new DocumentValidationError("Document not found");
  const { document, customer } = found;
  if (document.status !== "draft") {
    throw new DocumentValidationError("Only drafts can be issued");
  }

  const { def, data, totals } = prepare({
    type: document.type,
    customerId: document.customerId,
    currency: document.currency,
    data: document.data,
    relatedDocumentId: document.relatedDocumentId,
  });

  const parent = await checkParent(document.type, document, totals.totalMinor);

  const snapshot: DocumentSnapshot = {
    issuer: getIssuer(),
    customer: customerSnapshot(customer),
    totals,
    related: parent ? relatedSnapshot(parent) : null,
  };

  const issueDate = typeof data.issueDate === "string" ? data.issueDate : null;
  const year = issueDate ? Number(issueDate.slice(0, 4)) : new Date().getFullYear();

  // Re-checked inside the statement so a concurrent issue or void can't slip past checkParent.
  const parentGuard = parent
    ? sql`AND EXISTS (SELECT 1 FROM documents p WHERE p.id = ${parent.id} AND p.status = 'issued')`
    : sql``;
  const creditGuard =
    parent && document.type === "credit_note"
      ? sql`AND (
          SELECT p.total_minor + COALESCE(SUM(
            CASE WHEN n.type = 'debit_note' THEN n.total_minor ELSE -n.total_minor END
          ), 0)
          FROM documents p
          LEFT JOIN documents n ON n.related_document_id = p.id AND n.status = 'issued'
          WHERE p.id = ${parent.id}
          GROUP BY p.total_minor
        ) >= ${totals.totalMinor}`
      : sql``;

  const result = await getDb().execute<{ id: string; number: string }>(sql`
    WITH seq AS (
      INSERT INTO document_sequences (type, year, next_value)
      SELECT ${document.type}, ${year}, 2
      WHERE EXISTS (SELECT 1 FROM documents WHERE id = ${id} AND status = 'draft')
        ${parentGuard} ${creditGuard}
      ON CONFLICT (type, year)
        DO UPDATE SET next_value = document_sequences.next_value + 1
      RETURNING next_value - 1 AS n
    ), upd AS (
      UPDATE documents SET
        number = ${def.prefix} || '-' || ${String(year)} || '-' || lpad(seq.n::text, 4, '0'),
        status = 'issued',
        issued_at = now(),
        updated_at = now(),
        data = ${JSON.stringify(data)}::jsonb,
        total_minor = ${totals.totalMinor},
        snapshot = ${JSON.stringify(snapshot)}::jsonb
      FROM seq
      WHERE documents.id = ${id} AND documents.status = 'draft'
      RETURNING documents.id, documents.number
    ), ev AS (
      INSERT INTO document_events (document_id, type, actor, payload)
      SELECT upd.id, 'issued', ${actor}, jsonb_build_object('number', upd.number)
      FROM upd
    )
    SELECT id, number FROM upd
  `);

  const row = result.rows[0];
  if (!row) {
    const [current] = await getDb()
      .select({ status: documents.status })
      .from(documents)
      .where(eq(documents.id, id));
    throw new DocumentValidationError(
      current?.status === "draft"
        ? "The original invoice changed while issuing; reload and try again"
        : "Document was already issued"
    );
  }
  return row;
}

function relatedSnapshot(parent: DocumentRow): RelatedSnapshot {
  const data = parent.data as { issueDate?: string };
  return { number: parent.number ?? "", issueDate: data.issueDate ?? "" };
}

/** Parent reference for rendering drafts; issued notes use their snapshot. */
export async function getRelatedSnapshot(document: DocumentRow): Promise<RelatedSnapshot | null> {
  if (!document.relatedDocumentId) return null;
  const [parent] = await getDb()
    .select()
    .from(documents)
    .where(eq(documents.id, document.relatedDocumentId))
    .limit(1);
  return parent?.number ? relatedSnapshot(parent) : null;
}
