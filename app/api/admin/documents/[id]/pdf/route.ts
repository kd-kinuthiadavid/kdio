import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin-auth";
import { pdfFilename, renderDocumentPdf } from "@/lib/documents/pdf/render";
import { getDocument } from "@/lib/documents/service";

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

  const pdf = await renderDocumentPdf(found.document, found.customer);
  const download = new URL(request.url).searchParams.has("download");
  const filename = pdfFilename(found.document);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
