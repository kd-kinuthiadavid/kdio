import { render } from "@react-email/render";
import { Resend } from "resend";
import { z } from "zod";

import { documentEvents } from "@/db/schema";
import DocumentIssuedEmail from "@/emails/DocumentIssued";
import { getDb } from "@/lib/db";
import { formatDate } from "@/lib/documents/dates";
import { getIssuer } from "@/lib/documents/issuer";
import { formatMoney } from "@/lib/documents/money";
import { pdfFilename, renderDocumentPdf } from "@/lib/documents/pdf/render";
import { getDocumentType } from "@/lib/documents/registry";
import {
  DocumentValidationError,
  getDocument,
  getInvoiceBalance,
  type Actor,
} from "@/lib/documents/service";
import { getSnapshot } from "@/lib/documents/snapshot";
import { getStoredPdf } from "@/lib/documents/storage";
import { trackedUrl } from "@/lib/promo";
import { getSiteUrl } from "@/lib/site-url";

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

export const sendDocumentInputSchema = z.object({
  to: emailList("To", 1),
  cc: emailList("CC", 0),
  message: z.string().trim().max(2000).optional(),
});

export type SendDocumentInput = z.input<typeof sendDocumentInputSchema>;

function resend() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

function fromAddress() {
  return process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
}

/** Emails an issued document with its PDF attached and logs a `sent` event. */
export async function sendDocumentEmail(
  documentId: string,
  input: SendDocumentInput,
  actor: Actor = "admin"
) {
  const parsed = sendDocumentInputSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    throw new DocumentValidationError("Please fix the highlighted fields", fieldErrors);
  }
  const { to, cc, message } = parsed.data;

  const client = resend();
  if (!client) throw new DocumentValidationError("Email isn't configured: RESEND_API_KEY is missing");

  const found = await getDocument(documentId);
  if (!found) throw new DocumentValidationError("Document not found");
  const { document, customer } = found;
  if (document.status !== "issued" || !document.number) {
    throw new DocumentValidationError("Only issued documents can be sent");
  }

  const def = getDocumentType(document.type);
  const snapshot = getSnapshot(document);
  const issuer = snapshot?.issuer ?? getIssuer();
  const contact = snapshot?.customer ?? customer;
  const data = document.data as { issueDate?: string; dueDate?: string; terms?: string };
  const total = formatMoney(document.totalMinor, document.currency);
  const related = snapshot?.related?.number;

  const rows = [
    { label: def.label, value: document.number },
    { label: "Issue date", value: formatDate(data.issueDate) },
    ...(related ? [{ label: "Original invoice", value: related }] : []),
    ...(data.dueDate ? [{ label: "Due date", value: formatDate(data.dueDate) }] : []),
    { label: document.type === "credit_note" ? "Total credit" : "Amount", value: total },
  ];
  if (document.type === "invoice") {
    const balance = await getInvoiceBalance(document.id);
    if (balance && balance.outstandingMinor !== document.totalMinor) {
      rows.push({
        label: "Outstanding",
        value: formatMoney(Math.max(balance.outstandingMinor, 0), document.currency),
      });
    }
  }

  const label = def.label.toLowerCase();
  const due = data.dueDate ? `, due ${formatDate(data.dueDate)}` : "";
  const intro =
    document.type === "credit_note"
      ? `Please find attached credit note ${document.number} for ${total} against invoice ${related}.`
      : document.type === "debit_note"
        ? `Please find attached debit note ${document.number} for ${total} relating to invoice ${related}${due}.`
        : `Please find attached ${label} ${document.number} for ${total}${due}.`;

  const asksForPayment = document.type !== "credit_note";
  const utm = { source: document.type, campaign: document.number };
  const html = await render(
    DocumentIssuedEmail({
      preview: `${def.label} ${document.number} from ${issuer.name}`,
      headline: `${def.label} ${document.number}`,
      greeting: `Hi ${contact.name.split(" ")[0]},`,
      intro,
      message: message || undefined,
      rows,
      paymentLines: asksForPayment ? issuer.paymentLines : [],
      terms: asksForPayment ? data.terms : undefined,
      signoff: "Thank you,",
      senderName: issuer.name,
      postscript: asksForPayment
        ? {
            text: "Planning your next AI build? The two-minute fit assessment helps scope it.",
            linkLabel: "Take the fit assessment",
            href: trackedUrl(`${getSiteUrl()}/en/assessment`, { ...utm, medium: "email" }),
          }
        : undefined,
      utm,
    })
  );

  const pdf = (await getStoredPdf(document)) ?? (await renderDocumentPdf(document, customer));
  const { data: sent, error } = await client.emails.send({
    from: fromAddress(),
    to,
    cc: cc.length ? cc : undefined,
    replyTo: issuer.email,
    subject: `${def.label} ${document.number} from ${issuer.name}`,
    html,
    attachments: [{ filename: pdfFilename(document), content: pdf }],
  });
  if (error) {
    console.error("Resend send failed", documentId, error);
    throw new DocumentValidationError(`Email failed to send: ${error.message}`);
  }

  await getDb()
    .insert(documentEvents)
    .values({
      documentId,
      type: "sent",
      actor,
      payload: { to, cc, emailId: sent?.id ?? null },
    });
  return { to, cc };
}
