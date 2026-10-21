"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { FormState } from "@/components/admin/FormField";
import { assertAdmin } from "@/lib/admin-auth";
import { isDocumentType } from "@/lib/documents/registry";
import {
  createDraft,
  DocumentValidationError,
  updateDraft,
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
  redirect(`/admin/documents/${savedId}/edit?saved=1`);
}
