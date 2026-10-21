"use client";

import { useActionState, useState } from "react";

import { recordPaymentAction } from "@/app/admin/(protected)/documents/actions";
import { FormError, FormField, type FormState } from "@/components/admin/FormField";
import { useFormSubmit } from "@/components/admin/use-form-submit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS } from "@/lib/documents/money";

type RecordPaymentProps = {
  documentId: string;
  currency: string;
  /** Major units, e.g. the outstanding amount */
  defaultAmount: string;
  defaultDate: string;
};

/** A "Record payment" button that opens the form in place. */
export function RecordPaymentPanel(props: RecordPaymentProps) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Record payment
      </Button>
    );
  }
  return (
    <div className="max-w-2xl rounded-lg border border-border bg-card/60 p-4">
      <RecordPaymentForm {...props} onCancel={() => setOpen(false)} />
    </div>
  );
}

export function RecordPaymentForm({
  documentId,
  currency,
  defaultAmount,
  defaultDate,
  onCancel,
}: RecordPaymentProps & { onCancel?: () => void }) {
  const [state, action, pending] = useActionState<FormState, FormData>(recordPaymentAction, {});
  const onSubmit = useFormSubmit(action);
  const e = state.fieldErrors ?? {};

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormError state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={`Amount (${currency})`} htmlFor="amount" error={e.amount}>
          <Input
            id="amount"
            name="amount"
            inputMode="decimal"
            defaultValue={defaultAmount}
            required
            autoFocus
          />
        </FormField>
        <FormField label="Paid on" htmlFor="paidOn" error={e.paidOn}>
          <Input id="paidOn" name="paidOn" type="date" defaultValue={defaultDate} required />
        </FormField>
        <FormField label="Method" htmlFor="method" error={e.method}>
          <NativeSelect id="method" name="method" defaultValue="bank">
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {PAYMENT_METHOD_LABELS[m]}
              </option>
            ))}
          </NativeSelect>
        </FormField>
        <FormField
          label="Reference"
          htmlFor="reference"
          error={e.reference}
          hint="Bank or M-Pesa transaction code"
        >
          <Input id="reference" name="reference" />
        </FormField>
        <FormField label="Notes" htmlFor="notes" error={e.notes} className="sm:col-span-2">
          <Input id="notes" name="notes" />
        </FormField>
      </div>
      <div className="flex gap-2">
        <input type="hidden" name="id" value={documentId} />
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Recording…" : "Record payment"}
        </Button>
        {onCancel ? (
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
