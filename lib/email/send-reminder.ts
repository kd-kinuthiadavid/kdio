import { render } from "@react-email/render";

import { documentEvents } from "@/db/schema";
import DocumentIssuedEmail from "@/emails/DocumentIssued";
import { getDb } from "@/lib/db";
import { formatDate, todayIso } from "@/lib/documents/dates";
import { formatMoney } from "@/lib/documents/money";
import { pdfFilename } from "@/lib/documents/pdf/render";
import { daysBetween, stageCopy, type ReminderEventStage } from "@/lib/documents/reminders";
import { DocumentValidationError, getInvoiceBalance, type Actor } from "@/lib/documents/service";
import {
  documentPdf,
  fromAddress,
  greetingFor,
  headerRows,
  loadIssuedDocument,
  parseSendInput,
  resendClient,
  type SendEmailInput,
} from "@/lib/email/document-email";

export type ReminderTrigger = "auto" | "manual";

export type SendReminderInput = SendEmailInput & {
  stage: ReminderEventStage;
  trigger: ReminderTrigger;
};

/**
 * Emails a payment reminder for an issued invoice with money outstanding,
 * attaches its PDF and logs a `reminder_sent` event. Automatic sends carry an
 * idempotency key per invoice and stage, so a repeated cron call can't send twice.
 */
export async function sendReminderEmail(
  documentId: string,
  input: SendReminderInput,
  actor: Actor = "admin"
) {
  const { to, cc, message } = parseSendInput(input);
  const { stage, trigger } = input;
  const client = resendClient();
  const doc = await loadIssuedDocument(documentId);
  const { document, customer, def, issuer, contact, data } = doc;
  if (document.type !== "invoice") {
    throw new DocumentValidationError("Reminders can only be sent for invoices");
  }
  const balance = await getInvoiceBalance(document.id);
  if (!balance || balance.outstandingMinor <= 0) {
    throw new DocumentValidationError("Nothing is outstanding on this invoice");
  }

  const money = (minor: number) => formatMoney(minor, document.currency);
  const daysPastDue = data.dueDate ? daysBetween(data.dueDate, todayIso()) : 0;
  const { subject, intro } = stageCopy(stage, {
    number: document.number,
    outstanding: money(balance.outstandingMinor),
    dueOn: formatDate(data.dueDate),
    daysPastDue,
  });

  const rows = [
    ...headerRows(doc),
    ...(data.dueDate ? [{ label: "Due date", value: formatDate(data.dueDate) }] : []),
    { label: "Amount", value: money(balance.balanceMinor) },
    { label: "Outstanding", value: money(balance.outstandingMinor) },
    ...(daysPastDue > 0
      ? [{ label: "Overdue", value: `${daysPastDue} day${daysPastDue === 1 ? "" : "s"}` }]
      : []),
  ];

  const html = await render(
    DocumentIssuedEmail({
      preview: subject,
      headline: `${stage === "final" ? "Final reminder" : "Payment reminder"}: ${def.label} ${document.number}`,
      greeting: greetingFor(contact),
      intro,
      message: message || undefined,
      rows,
      paymentLines: issuer.paymentLines,
      terms: data.terms,
      signoff: "Thank you,",
      senderName: issuer.name,
      utm: { source: "invoice_reminder", campaign: document.number },
    })
  );

  const pdf = await documentPdf(document, customer);
  const { data: sent, error } = await client.emails.send(
    {
      from: fromAddress(),
      to,
      cc: cc.length ? cc : undefined,
      replyTo: issuer.email,
      subject,
      html,
      attachments: [{ filename: pdfFilename(document), content: pdf }],
    },
    trigger === "auto" ? { idempotencyKey: `reminder/${document.id}/${stage}` } : undefined
  );
  if (error) {
    console.error("Resend reminder failed", documentId, error);
    throw new DocumentValidationError(`Reminder failed to send: ${error.message}`);
  }

  await getDb()
    .insert(documentEvents)
    .values({
      documentId,
      type: "reminder_sent",
      actor,
      payload: { stage, trigger, to, cc, emailId: sent?.id ?? null },
    });
  return { to, cc, stage };
}
