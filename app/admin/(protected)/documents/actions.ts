"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { FormState } from "@/components/admin/FormField";
import { assertAdmin } from "@/lib/admin-auth";
import { todayIso } from "@/lib/documents/dates";
import { deletePayment, recordPayment, type PaymentInput } from "@/lib/documents/payments";
import {
  getReminderStates,
  setRemindersPaused,
} from "@/lib/documents/reminders-data";
import { isDocumentType } from "@/lib/documents/registry";
import {
  createDraft,
  deleteDraft,
  DocumentValidationError,
  issueDocument,
  updateDraft,
  voidDocument,
} from "@/lib/documents/service";
import { storeIssuedPdf } from "@/lib/documents/storage";
import { sendDocumentEmail } from "@/lib/email/send-document";
import { sendReminderEmail } from "@/lib/email/send-reminder";

const payloadSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.string().refine(isDocumentType, "Unknown document type"),
  customerId: z.string(),
  currency: z.string(),
  relatedDocumentId: z.string().uuid().nullish(),
  data: z.unknown(),
});

function toFormState(e: unknown, fallback: string): FormState {
  if (e instanceof DocumentValidationError) {
    return { error: e.message, fieldErrors: e.fieldErrors };
  }
  console.error(fallback, e);
  return { error: fallback };
}

export async function saveDraftAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await assertAdmin();

  let json: unknown;
  try {
    json = JSON.parse(String(formData.get("payload") ?? ""));
  } catch {
    return { error: "Invalid form payload" };
  }
  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success) return { error: "Invalid form payload" };
  const { id, type, ...rest } = parsed.data;
  if (!isDocumentType(type)) return { error: "Unknown document type" };

  let savedId: string;
  try {
    const input = { type, ...rest };
    savedId = id ? (await updateDraft(id, input)).id : (await createDraft(input)).id;
  } catch (e) {
    return toFormState(e, "Could not save the draft");
  }

  revalidatePath("/admin/documents");
  redirect(`/admin/documents/${savedId}`);
}

function idFrom(formData: FormData): string {
  const id = formData.get("id");
  return typeof id === "string" ? id : "";
}

export async function issueDocumentAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await assertAdmin();
  const id = idFrom(formData);
  try {
    await issueDocument(id);
  } catch (e) {
    return toFormState(e, "Could not issue the document");
  }
  // The issue stands even if storage fails; the detail page offers a retry.
  await storeIssuedPdf(id).catch((e) => console.error("Could not store issued PDF", id, e));
  revalidatePath("/admin/documents");
  revalidatePath(`/admin/documents/${id}`);
  return {};
}

export async function storeDocumentPdfAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await assertAdmin();
  const id = idFrom(formData);
  try {
    await storeIssuedPdf(id);
  } catch (e) {
    return toFormState(e, "Could not store the PDF");
  }
  revalidatePath(`/admin/documents/${id}`);
  return {};
}

export async function voidDocumentAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await assertAdmin();
  const id = idFrom(formData);
  try {
    await voidDocument(id, String(formData.get("reason") ?? ""));
  } catch (e) {
    return toFormState(e, "Could not void the document");
  }
  revalidatePath("/admin/documents");
  revalidatePath(`/admin/documents/${id}`);
  return {};
}

export async function recordPaymentAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await assertAdmin();
  const id = idFrom(formData);
  const field = (name: string) => String(formData.get(name) ?? "");
  try {
    await recordPayment(id, {
      amount: field("amount"),
      paidOn: field("paidOn"),
      method: field("method") as PaymentInput["method"],
      reference: field("reference"),
      notes: field("notes"),
    });
  } catch (e) {
    return toFormState(e, "Could not record the payment");
  }
  revalidatePath("/admin/documents");
  revalidatePath(`/admin/documents/${id}`);
  return {};
}

export async function deletePaymentAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await assertAdmin();
  try {
    const { documentId } = await deletePayment(idFrom(formData));
    revalidatePath(`/admin/documents/${documentId}`);
  } catch (e) {
    return toFormState(e, "Could not remove the payment");
  }
  revalidatePath("/admin/documents");
  return {};
}

export async function sendDocumentAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await assertAdmin();
  const id = idFrom(formData);
  let sentTo: string[];
  try {
    ({ to: sentTo } = await sendDocumentEmail(id, {
      to: String(formData.get("to") ?? ""),
      cc: String(formData.get("cc") ?? ""),
      message: String(formData.get("message") ?? ""),
    }));
  } catch (e) {
    return toFormState(e, "Could not send the email");
  }
  revalidatePath(`/admin/documents/${id}`);
  return { success: `Sent to ${sentTo.join(", ")}` };
}

export async function sendReminderAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await assertAdmin();
  const id = idFrom(formData);
  let sentTo: string[];
  try {
    const state = (await getReminderStates([id], todayIso())).get(id);
    ({ to: sentTo } = await sendReminderEmail(id, {
      to: String(formData.get("to") ?? ""),
      cc: String(formData.get("cc") ?? ""),
      message: String(formData.get("message") ?? ""),
      stage: state?.pendingStage ?? "manual",
      trigger: "manual",
    }));
  } catch (e) {
    return toFormState(e, "Could not send the reminder");
  }
  revalidatePath("/admin/documents");
  revalidatePath(`/admin/documents/${id}`);
  return { success: `Reminder sent to ${sentTo.join(", ")}` };
}

async function setPaused(
  formData: FormData,
  paused: boolean,
): Promise<FormState> {
  await assertAdmin();
  const id = idFrom(formData);
  try {
    await setRemindersPaused(id, paused);
  } catch (e) {
    return toFormState(
      e,
      paused ? "Could not pause reminders" : "Could not resume reminders",
    );
  }
  revalidatePath("/admin/documents");
  revalidatePath(`/admin/documents/${id}`);
  return {};
}

export async function pauseRemindersAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return setPaused(formData, true);
}

export async function resumeRemindersAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return setPaused(formData, false);
}

export async function deleteDraftAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await assertAdmin();
  try {
    await deleteDraft(idFrom(formData));
  } catch (e) {
    return toFormState(e, "Could not delete the draft");
  }
  revalidatePath("/admin/documents");
  redirect("/admin/documents");
}
