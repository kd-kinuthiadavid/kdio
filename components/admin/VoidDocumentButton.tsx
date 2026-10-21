"use client";

import { useActionState, useState } from "react";

import { voidDocumentAction } from "@/app/admin/(protected)/documents/actions";
import type { FormState } from "@/components/admin/FormField";
import { FieldMessage } from "@/components/admin/Notice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function VoidDocumentButton({ id, label }: { id: string; label: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<FormState, FormData>(voidDocumentAction, {});

  if (!open) {
    return (
      <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>
        Void
      </Button>
    );
  }

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`Void this ${label.toLowerCase()}? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
      className="flex w-full flex-col gap-1 sm:w-auto"
    >
      <input type="hidden" name="id" value={id} />
      <div className="flex gap-2">
        <Input
          name="reason"
          aria-label="Reason for voiding"
          placeholder="Reason for voiding"
          className="h-9 sm:w-64"
          required
          autoFocus
        />
        <Button type="submit" size="sm" variant="destructive" disabled={pending}>
          {pending ? "Voiding…" : "Confirm void"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
      {state.error ? <FieldMessage className="max-w-sm">{state.error}</FieldMessage> : null}
    </form>
  );
}
