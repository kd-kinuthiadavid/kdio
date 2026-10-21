import { createHash } from "node:crypto";

import { and, eq, isNull, or } from "drizzle-orm";

import { documentEvents, documents, type CustomerRow, type DocumentRow } from "@/db/schema";
import { getDb } from "@/lib/db";
import { renderDocumentPdf } from "@/lib/documents/pdf/render";
import { DocumentValidationError, getDocument } from "@/lib/documents/service";
import { getPrivatePdf, putPrivatePdf } from "@/lib/storage/blob";

export function sha256(body: Buffer): string {
  return createHash("sha256").update(body).digest("hex");
}

export function pdfPathname(document: DocumentRow): string {
  if (!document.number) throw new Error("Only numbered documents have a stored PDF");
  const year = document.number.split("-")[1];
  return `documents/${document.type}/${year}/${document.number}.pdf`;
}

/** Renders the document as it was issued, even if it has since been voided. */
function renderIssued(document: DocumentRow, customer: CustomerRow) {
  return renderDocumentPdf(document, customer, { status: "issued" });
}

/**
 * Stores the issued PDF in private Blob and records its pathname and sha256.
 * Also the "regenerate" path when the stored copy is missing: it refuses if
 * the re-rendered bytes differ from the recorded hash or from a blob already
 * at the pathname, so an issued PDF can never change silently.
 */
export async function storeIssuedPdf(id: string, actor = "admin") {
  const found = await getDocument(id);
  if (!found) throw new DocumentValidationError("Document not found");
  const { document, customer } = found;
  if (document.status === "draft" || !document.number) {
    throw new DocumentValidationError("Only issued documents have a stored PDF");
  }

  const pdf = await renderIssued(document, customer);
  const hash = sha256(pdf);
  if (document.pdfSha256 && document.pdfSha256 !== hash) {
    throw new DocumentValidationError(
      "Re-rendering would produce a different PDF from the one issued; refusing to replace it"
    );
  }

  const pathname = pdfPathname(document);
  const existing = await getPrivatePdf(pathname);
  if (existing) {
    if (sha256(existing) !== hash) {
      throw new DocumentValidationError(
        "A different PDF is already stored for this number; refusing to replace it"
      );
    }
  } else {
    await putPrivatePdf(pathname, pdf);
  }

  const db = getDb();
  const updated = await db
    .update(documents)
    .set({ pdfPathname: pathname, pdfSha256: hash })
    .where(and(eq(documents.id, id), or(isNull(documents.pdfSha256), eq(documents.pdfSha256, hash))))
    .returning({ id: documents.id });
  if (updated.length && document.pdfPathname !== pathname) {
    await db.insert(documentEvents).values({
      documentId: id,
      type: "pdf_stored",
      actor,
      payload: { pathname, sha256: hash },
    });
  }
  return { pathname, sha256: hash };
}

/** The stored PDF, verified against its recorded hash; null if missing or altered. */
export async function getStoredPdf(document: DocumentRow): Promise<Buffer | null> {
  if (!document.pdfPathname || !document.pdfSha256) return null;
  const pdf = await getPrivatePdf(document.pdfPathname);
  if (!pdf) return null;
  if (sha256(pdf) !== document.pdfSha256) {
    console.error("Stored PDF hash mismatch", document.id, document.pdfPathname);
    return null;
  }
  return pdf;
}
