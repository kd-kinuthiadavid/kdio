import { render } from "@react-email/render";

import { documentEvents } from "@/db/schema";
import DocumentIssuedEmail from "@/emails/DocumentIssued";
import { getDb } from "@/lib/db";
import { formatDate } from "@/lib/documents/dates";
import { formatMoney } from "@/lib/documents/money";
import { pdfFilename } from "@/lib/documents/pdf/render";
import {
  DocumentValidationError,
  getInvoiceBalance,
  type Actor,
} from "@/lib/documents/service";
import {
  documentPdf,
  fromAddress,
  greetingFor,
  headerRows,
  loadIssuedDocument,
  parseSendInput,
  resendClient,
  sendEmailInputSchema,
  type SendEmailInput,
} from "@/lib/email/document-email";
import { trackedUrl } from "@/lib/promo";
import { getSiteUrl } from "@/lib/site-url";

export const sendDocumentInputSchema = sendEmailInputSchema;
export type SendDocumentInput = SendEmailInput;

/** Emails an issued document with its PDF attached and logs a `sent` event. */
export async function sendDocumentEmail(
  documentId: string,
  input: SendDocumentInput,
  actor: Actor = "admin",
) {
  const { to, cc, message } = parseSendInput(input);
  const client = resendClient();
  const doc = await loadIssuedDocument(documentId);
  const { document, customer, def, snapshot, issuer, contact, data } = doc;

  const total = formatMoney(document.totalMinor, document.currency);
  const related = snapshot?.related?.number;

  const rows = [
    ...headerRows(doc),
    ...(data.dueDate
      ? [{ label: "Due date", value: formatDate(data.dueDate) }]
      : []),
    {
      label: document.type === "credit_note" ? "Total credit" : "Amount",
      value: total,
    },
  ];
  if (document.type === "invoice") {
    const balance = await getInvoiceBalance(document.id);
    if (balance && balance.outstandingMinor !== document.totalMinor) {
      rows.push({
        label: "Outstanding",
        value: formatMoney(
          Math.max(balance.outstandingMinor, 0),
          document.currency,
        ),
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
      greeting: greetingFor(contact),
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
            href: trackedUrl(`${getSiteUrl()}/en/assessment`, {
              ...utm,
              medium: "email",
            }),
          }
        : undefined,
      utm,
    }),
  );

  const pdf = await documentPdf(document, customer);
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
