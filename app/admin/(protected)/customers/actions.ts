"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { FormState } from "@/components/admin/FormField";
import { assertAdmin } from "@/lib/admin-auth";
import {
  createCustomer,
  customerInputSchema,
  updateCustomer,
} from "@/lib/documents/customers";
import { fieldErrorsFrom } from "@/lib/zod-errors";

function text(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function saveCustomerAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await assertAdmin();

  const parsed = customerInputSchema.safeParse({
    name: text(formData, "name"),
    company: text(formData, "company"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    addressLines: text(formData, "address").split("\n"),
    country: text(formData, "country"),
    taxId: text(formData, "taxId"),
    defaultCurrency: text(formData, "defaultCurrency"),
    paymentTermsDays: text(formData, "paymentTermsDays"),
    notes: text(formData, "notes"),
  });
  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  let id = text(formData, "id");
  try {
    if (id) await updateCustomer(id, parsed.data);
    else id = (await createCustomer(parsed.data)).id;
  } catch (e) {
    console.error("save customer", e);
    return { error: "Could not save the customer" };
  }

  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${id}`);
  redirect(`/admin/customers/${id}`);
}
