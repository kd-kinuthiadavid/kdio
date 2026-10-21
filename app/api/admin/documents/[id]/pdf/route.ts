import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin-auth";
import { pdfFilename, renderDocumentPdf } from "@/lib/documents/pdf/render";
import { getDocument, getRelatedSnapshot } from "@/lib/documents/service";
import { getStoredPdf } from "@/lib/documents/storage";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const found = await getDocument(id).catch(() => null);
  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { document, customer } = found;
  // Voided documents render live so the PDF carries the VOID mark; the stored copy stays as issued.
  let pdf =
    document.status === "issued"
      ? await getStoredPdf(document).catch((e) => {
          console.error("Could not read stored PDF", id, e);
          return null;
        })
      : null;
  const source = pdf ? "stored" : "rendered";
  if (!pdf) {
    const overrides =
      document.status === "draft" ? { related: await getRelatedSnapshot(document) } : {};
    pdf = await renderDocumentPdf(document, customer, overrides);
  }
  const download = new URL(request.url).searchParams.has("download");
  const filename = pdfFilename(document);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Pdf-Source": source,
    },
  });
}
