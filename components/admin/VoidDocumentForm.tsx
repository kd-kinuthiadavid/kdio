"use client";

import { useActionState } from "react";

import { voidDocumentAction } from "@/app/admin/(protected)/documents/actions";
import type { FormState } from "@/components/admin/FormField";
import { FieldMessage } from "@/components/admin/Notice";
import { useFormSubmit } from "@/components/admin/use-form-submit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function VoidDocumentForm({
  id,
  label,
  onCancel,
}: {
  id: string;
  label: string;
  onCancel: () => void;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(voidDocumentAction, {});
  const onSubmit = useFormSubmit(action, () =>
    window.confirm(`Void this ${label.toLowerCase()}? This cannot be undone.`)
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />
      <p className="text-sm text-muted-foreground">
        Voiding keeps the number but cancels the {label.toLowerCase()}. It can&apos;t be undone.
      </p>
      <div className="flex flex-wrap gap-2">
        <Input
          name="reason"
          aria-label="Reason for voiding"
          placeholder="Reason for voiding"
          className="h-9 sm:w-80"
          required
          autoFocus
        />
        <Button type="submit" size="sm" variant="destructive" disabled={pending}>
          {pending ? "Voiding…" : "Confirm void"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      {state.error ? <FieldMessage className="max-w-md">{state.error}</FieldMessage> : null}
    </form>
  );
}
