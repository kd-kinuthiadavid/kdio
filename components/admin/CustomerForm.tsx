"use client";

import Link from "next/link";
import { useActionState } from "react";

import { saveCustomerAction } from "@/app/admin/(protected)/customers/actions";
import { FormError, FormField, type FormState } from "@/components/admin/FormField";
import { useFormSubmit } from "@/components/admin/use-form-submit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type { CustomerRow } from "@/db/schema";
import { CURRENCIES } from "@/lib/documents/money";

export function CustomerForm({ customer }: { customer?: CustomerRow }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    saveCustomerAction,
    {}
  );
  const onSubmit = useFormSubmit(action);
  const e = state.fieldErrors ?? {};

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5">
      {customer ? <input type="hidden" name="id" value={customer.id} /> : null}
      <FormError state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Contact name" htmlFor="name" error={e.name}>
          <Input id="name" name="name" defaultValue={customer?.name} required />
        </FormField>
        <FormField label="Company" htmlFor="company" error={e.company}>
          <Input id="company" name="company" defaultValue={customer?.company ?? ""} />
        </FormField>
        <FormField label="Email" htmlFor="email" error={e.email}>
          <Input id="email" name="email" type="email" defaultValue={customer?.email ?? ""} />
        </FormField>
        <FormField label="Phone" htmlFor="phone" error={e.phone}>
          <Input id="phone" name="phone" defaultValue={customer?.phone ?? ""} />
        </FormField>
      </div>
      <FormField label="Billing address" htmlFor="address" hint="One line per row" error={e.addressLines}>
        <Textarea
          id="address"
          name="address"
          rows={3}
          defaultValue={customer?.addressLines.join("\n") ?? ""}
        />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Country" htmlFor="country" error={e.country}>
          <Input id="country" name="country" defaultValue={customer?.country ?? ""} />
        </FormField>
        <FormField
          label="Tax ID"
          htmlFor="taxId"
          hint="KRA PIN for Kenyan clients, VAT/EIN abroad"
          error={e.taxId}
        >
          <Input id="taxId" name="taxId" defaultValue={customer?.taxId ?? ""} />
        </FormField>
        <FormField label="Default currency" htmlFor="defaultCurrency" error={e.defaultCurrency}>
          <NativeSelect
            id="defaultCurrency"
            name="defaultCurrency"
            defaultValue={customer?.defaultCurrency ?? "USD"}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </NativeSelect>
        </FormField>
        <FormField label="Payment terms (days)" htmlFor="paymentTermsDays" error={e.paymentTermsDays}>
          <Input
            id="paymentTermsDays"
            name="paymentTermsDays"
            type="number"
            min={0}
            max={365}
            defaultValue={customer?.paymentTermsDays ?? 14}
          />
        </FormField>
      </div>
      <FormField label="Internal notes" htmlFor="notes" error={e.notes}>
        <Textarea id="notes" name="notes" rows={2} defaultValue={customer?.notes ?? ""} />
      </FormField>
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : customer ? "Save changes" : "Create customer"}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/customers">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
