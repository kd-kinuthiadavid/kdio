import { PAYMENT_STATES, type PaymentState } from "@/lib/documents/payment-state";
import { cn } from "@/lib/utils";

const tones: Record<PaymentState, string> = {
  unpaid: "border-border bg-transparent text-muted-foreground",
  partially_paid: "border-warning-border bg-warning-muted text-warning",
  paid: "border-success-border bg-success-muted text-success",
  overpaid: "border-info-border bg-info-muted text-info",
};

export function PaymentStateBadge({
  state,
  className,
}: {
  state: PaymentState;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        tones[state],
        className
      )}
    >
      {PAYMENT_STATES[state]}
    </span>
  );
}
