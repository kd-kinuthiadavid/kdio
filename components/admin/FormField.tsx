import { FieldMessage, Notice } from "@/components/admin/Notice";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: string;
};

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <FieldMessage>{error}</FieldMessage>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function FormError({ state }: { state: FormState }) {
  if (!state.error) return null;
  return <Notice tone="error">{state.error}</Notice>;
}
