import type { ComponentType } from "react";
import type { z } from "zod";

import type { DocumentType } from "@/db/schema";
import type { Totals } from "@/lib/documents/line-items";
import { InvoicePdf } from "@/lib/documents/pdf/InvoicePdf";
import type { PdfModel } from "@/lib/documents/pdf/model";
import { computeInvoiceTotals, invoiceDataSchema } from "@/lib/documents/types/invoice";

export type DocumentTypeDefinition<TData = unknown> = {
  type: DocumentType;
  label: string;
  prefix: string;
  /** Credit and debit notes must reference an issued invoice */
  requiresParent: boolean;
  schema: z.ZodType<TData>;
  computeTotals: (data: TData) => Totals;
  Pdf: ComponentType<{ model: PdfModel }>;
};

function define<TData>(def: DocumentTypeDefinition<TData>) {
  return def as unknown as DocumentTypeDefinition;
}

const registry: Partial<Record<DocumentType, DocumentTypeDefinition>> = {
  invoice: define({
    type: "invoice",
    label: "Invoice",
    prefix: "INV",
    requiresParent: false,
    schema: invoiceDataSchema,
    computeTotals: computeInvoiceTotals,
    Pdf: InvoicePdf,
  }),
};

export function isDocumentType(value: string): value is DocumentType {
  return value in registry;
}

export function getDocumentType(type: DocumentType): DocumentTypeDefinition {
  const def = registry[type];
  if (!def) throw new Error(`Unknown document type: ${type}`);
  return def;
}

export function listDocumentTypes(): DocumentTypeDefinition[] {
  return Object.values(registry);
}
