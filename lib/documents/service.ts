import { and, desc, eq, sql, type SQL } from "drizzle-orm";
import { z } from "zod";

import {
  customers,
  documentEvents,
  documents,
  type CustomerRow,
  type DocumentEventRow,
  type DocumentRow,
  type DocumentStatus,
  type DocumentType,
} from "@/db/schema";
import { getDb } from "@/lib/db";
import { getIssuer, type Issuer } from "@/lib/documents/issuer";
import type { Totals } from "@/lib/documents/line-items";
import { CURRENCIES } from "@/lib/documents/money";
import { getDocumentType } from "@/lib/documents/registry";
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

export type CustomerSnapshot = Pick<
  CustomerRow,
  "name" | "company" | "email" | "phone" | "addressLines" | "country" | "taxId"
>;

export type DocumentSnapshot = {
  issuer: Issuer;
  customer: CustomerSnapshot;
  totals: Totals;
  related?: { number: string; issueDate: string } | null;
};

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

export async function createDraft(input: DraftInput, actor: Actor = "admin") {
  const { meta, data, totals } = prepare(input);
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
  const { meta, data, totals } = prepare(input);
  const db = getDb();
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

function customerSnapshot(c: CustomerRow): CustomerSnapshot {
  return {
    name: c.name,
    company: c.company,
    email: c.email,
    phone: c.phone,
    addressLines: c.addressLines,
    country: c.country,
    taxId: c.taxId,
  };
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

  const snapshot: DocumentSnapshot = {
    issuer: getIssuer(),
    customer: customerSnapshot(customer),
    totals,
  };

  const issueDate = typeof data.issueDate === "string" ? data.issueDate : null;
  const year = issueDate ? Number(issueDate.slice(0, 4)) : new Date().getFullYear();

  const result = await getDb().execute<{ id: string; number: string }>(sql`
    WITH seq AS (
      INSERT INTO document_sequences (type, year, next_value)
      SELECT ${document.type}, ${year}, 2
      WHERE EXISTS (SELECT 1 FROM documents WHERE id = ${id} AND status = 'draft')
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
  if (!row) throw new DocumentValidationError("Document was already issued");
  return row;
}

export function getSnapshot(document: DocumentRow): DocumentSnapshot | null {
  return (document.snapshot as DocumentSnapshot | null) ?? null;
}
