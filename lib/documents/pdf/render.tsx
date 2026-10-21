import { renderToBuffer } from "@react-pdf/renderer";

import type { CustomerRow, DocumentRow } from "@/db/schema";
import { getIssuer } from "@/lib/documents/issuer";
import type { PdfModel } from "@/lib/documents/pdf/model";
import { getDocumentType } from "@/lib/documents/registry";
import { customerSnapshot, getSnapshot } from "@/lib/documents/snapshot";

/**
 * Issued documents render from their frozen snapshot so later changes to the
 * issuer config or customer record never alter them; drafts render live.
 */
export function buildPdfModel(document: DocumentRow, customer: CustomerRow): PdfModel {
  const def = getDocumentType(document.type);
  const snapshot = getSnapshot(document);
  const data = def.schema.parse(document.data) as Record<string, unknown>;
  return {
    type: document.type,
    title: def.label,
    number: document.number,
    status: document.status,
    currency: document.currency,
    issuer: snapshot?.issuer ?? getIssuer(),
    customer: snapshot?.customer ?? customerSnapshot(customer),
    data,
    totals: snapshot?.totals ?? def.computeTotals(data),
    related: snapshot?.related ?? null,
  };
}

export async function renderDocumentPdf(
  document: DocumentRow,
  customer: CustomerRow,
  overrides: Partial<PdfModel> = {}
): Promise<Buffer> {
  const def = getDocumentType(document.type);
  const model = { ...buildPdfModel(document, customer), ...overrides };
  return renderToBuffer(<def.Pdf model={model} />);
}

export function pdfFilename(document: DocumentRow): string {
  return `${document.number ?? `draft-${document.id.slice(0, 8)}`}.pdf`;
}
