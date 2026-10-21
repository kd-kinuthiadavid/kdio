"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { FormState } from "@/components/admin/FormField";
import { assertAdmin } from "@/lib/admin-auth";
import { isDocumentType } from "@/lib/documents/registry";
import {
  createDraft,
  deleteDraft,
  DocumentValidationError,
  issueDocument,
  updateDraft,
  voidDocument,
} from "@/lib/documents/service";

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
  revalidatePath("/admin/documents");
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
