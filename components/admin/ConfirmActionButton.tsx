"use client";

import { useActionState } from "react";

import type { FormState } from "@/components/admin/FormField";
import { Button, type ButtonProps } from "@/components/ui/button";

export function ConfirmActionButton({
  action,
  id,
  label,
  pendingLabel,
  confirm,
  variant,
  fields,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  id: string;
  label: string;
  pendingLabel?: string;
  confirm?: string;
  variant?: ButtonProps["variant"];
  fields?: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className="inline-flex flex-col gap-1"
    >
      <input type="hidden" name="id" value={id} />
      {fields
        ? Object.entries(fields).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))
        : null}
      <Button type="submit" size="sm" variant={variant} disabled={pending}>
        {pending ? (pendingLabel ?? `${label}…`) : label}
      </Button>
      {state.error ? <span className="max-w-xs text-xs text-destructive">{state.error}</span> : null}
    </form>
  );
}
