import { Resend } from "resend";
import { z } from "zod";

import type { CustomerRow, DocumentRow } from "@/db/schema";
import { formatDate } from "@/lib/documents/dates";
import { getIssuer } from "@/lib/documents/issuer";
import { renderDocumentPdf } from "@/lib/documents/pdf/render";
import { getDocumentType } from "@/lib/documents/registry";
import { DocumentValidationError, getDocument } from "@/lib/documents/service";
import { getSnapshot } from "@/lib/documents/snapshot";
import { getStoredPdf } from "@/lib/documents/storage";

const emailList = (label: string, min: number) =>
  z
    .string()
    .transform((v) => v.split(/[\s,;]+/).filter(Boolean))
    .pipe(
      z
        .array(z.email(`${label}: enter valid email addresses`))
        .min(min, `${label}: add at least one address`)
        .max(10, `${label}: at most 10 addresses`)
    );

export const sendEmailInputSchema = z.object({
  to: emailList("To", 1),
  cc: emailList("CC", 0),
  message: z.string().trim().max(2000).optional(),
});

export type SendEmailInput = z.input<typeof sendEmailInputSchema>;

export function parseSendInput(input: SendEmailInput) {
  const parsed = sendEmailInputSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    throw new DocumentValidationError("Please fix the highlighted fields", fieldErrors);
  }
  return parsed.data;
}

export function resendClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new DocumentValidationError("Email isn't configured: RESEND_API_KEY is missing");
  return new Resend(key);
}

export function fromAddress() {
  return process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
}

export type DocumentData = { issueDate?: string; dueDate?: string; terms?: string };

/** An issued document with everything its emails need. */
export async function loadIssuedDocument(documentId: string) {
  const found = await getDocument(documentId);
  if (!found) throw new DocumentValidationError("Document not found");
  const { document, customer } = found;
  if (document.status !== "issued" || !document.number) {
    throw new DocumentValidationError("Only issued documents can be sent");
  }
  const snapshot = getSnapshot(document);
  return {
    document: document as DocumentRow & { number: string },
    customer,
    def: getDocumentType(document.type),
    snapshot,
    issuer: snapshot?.issuer ?? getIssuer(),
    contact: snapshot?.customer ?? customer,
    data: document.data as DocumentData,
  };
}

export type IssuedDocument = Awaited<ReturnType<typeof loadIssuedDocument>>;

/** The rows every document email opens with: number, issue date, and the original invoice for notes. */
export function headerRows({ def, document, data, snapshot }: IssuedDocument) {
  const related = snapshot?.related?.number;
  return [
    { label: def.label, value: document.number },
    { label: "Issue date", value: formatDate(data.issueDate) },
    ...(related ? [{ label: "Original invoice", value: related }] : []),
  ];
}

export function greetingFor(contact: { name: string }) {
  return `Hi ${contact.name.split(" ")[0]},`;
}

export async function documentPdf(document: DocumentRow, customer: CustomerRow) {
  return (await getStoredPdf(document)) ?? (await renderDocumentPdf(document, customer));
}
