"use client";

import { useActionState } from "react";

import { sendReminderAction } from "@/app/admin/(protected)/documents/actions";
import { FormError, FormField, type FormState } from "@/components/admin/FormField";
import { Notice } from "@/components/admin/Notice";
import { useFormSubmit } from "@/components/admin/use-form-submit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SendReminderForm({
  id,
  defaultTo,
  defaultCc,
  stageLabel,
  onClose,
}: {
  id: string;
  defaultTo: string;
  defaultCc: string;
  /** Label of the scheduled reminder this send stands in for, if one is due */
  stageLabel: string | null;
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(sendReminderAction, {});
  const onSubmit = useFormSubmit(action);
  const e = state.fieldErrors ?? {};

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {state.success && !pending ? <Notice tone="success">{state.success}</Notice> : null}
      <FormError state={state} />
      <p className="text-sm text-muted-foreground">
        {stageLabel
          ? `The "${stageLabel}" reminder is due. Sending it now means the automatic one won't repeat it.`
          : "No scheduled reminder is due, so this one is recorded as a manual reminder."}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="To" htmlFor="remind-to" error={e.to} hint="Separate addresses with commas">
          <Input id="remind-to" name="to" defaultValue={defaultTo} required autoFocus />
        </FormField>
        <FormField label="CC" htmlFor="remind-cc" error={e.cc}>
          <Input id="remind-cc" name="cc" defaultValue={defaultCc} />
        </FormField>
        <FormField
          label="Message (optional)"
          htmlFor="remind-message"
          error={e.message}
          className="sm:col-span-2"
        >
          <Textarea id="remind-message" name="message" rows={3} />
        </FormField>
      </div>
      <div className="flex gap-2">
        <input type="hidden" name="id" value={id} />
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Sending…" : state.success ? "Send again" : "Send reminder"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </form>
  );
}
