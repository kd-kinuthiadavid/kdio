"use client";

import { useActionState, useState } from "react";

import { sendDocumentAction } from "@/app/admin/(protected)/documents/actions";
import { FormError, FormField, type FormState } from "@/components/admin/FormField";
import { Notice } from "@/components/admin/Notice";
import { useFormSubmit } from "@/components/admin/use-form-submit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SendDocumentButton({
  id,
  defaultTo,
  defaultCc,
}: {
  id: string;
  defaultTo: string;
  defaultCc: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<FormState, FormData>(sendDocumentAction, {});
  const onSubmit = useFormSubmit(action);
  const e = state.fieldErrors ?? {};

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        Send by email
      </Button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="basis-full space-y-4 rounded-lg border border-border bg-card/60 p-4"
    >
      <input type="hidden" name="id" value={id} />
      {state.success && !pending ? <Notice tone="success">{state.success}</Notice> : null}
      <FormError state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="To" htmlFor="send-to" error={e.to} hint="Separate addresses with commas">
          <Input id="send-to" name="to" defaultValue={defaultTo} required />
        </FormField>
        <FormField label="CC" htmlFor="send-cc" error={e.cc}>
          <Input id="send-cc" name="cc" defaultValue={defaultCc} />
        </FormField>
        <FormField
          label="Message (optional)"
          htmlFor="send-message"
          error={e.message}
          className="sm:col-span-2"
        >
          <Textarea id="send-message" name="message" rows={3} />
        </FormField>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Sending…" : state.success ? "Send again" : "Send"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>
    </form>
  );
}
