export const PAYMENT_STATES = {
  unpaid: "Unpaid",
  partially_paid: "Partially paid",
  paid: "Paid",
  overpaid: "Overpaid",
} as const;
export type PaymentState = keyof typeof PAYMENT_STATES;

export type PaymentFigures = {
  /** Invoice total + issued debit notes − issued credit notes */
  balanceMinor: number;
  paidMinor: number;
  /** Issued credit notes settled as a refund: money already returned to the customer */
  refundedMinor: number;
};

export type PaymentSummary = PaymentFigures & {
  /** Payments received less refunds paid out */
  netPaidMinor: number;
  outstandingMinor: number;
  state: PaymentState;
};

/**
 * Payment state is derived, never stored: the lifecycle status stays
 * draft | issued | void. A refund-settled credit note lowers the balance and
 * also returns cash, so it's subtracted from what was paid.
 */
export function summarizePayments(figures: PaymentFigures): PaymentSummary {
  const netPaidMinor = figures.paidMinor - figures.refundedMinor;
  const outstandingMinor = figures.balanceMinor - netPaidMinor;
  const state: PaymentState =
    outstandingMinor < 0
      ? "overpaid"
      : outstandingMinor === 0
        ? "paid"
        : netPaidMinor > 0
          ? "partially_paid"
          : "unpaid";
  return { ...figures, netPaidMinor, outstandingMinor, state };
}

/** Whole days past the due date while money is still outstanding; null when not overdue. */
export function daysOverdue(
  dueDate: string | undefined,
  outstandingMinor: number,
  today: string
): number | null {
  if (!dueDate || outstandingMinor <= 0 || dueDate >= today) return null;
  const ms = Date.parse(`${today}T00:00:00Z`) - Date.parse(`${dueDate}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

export function isRefundCredit(data: unknown): boolean {
  const settlement = (data as { settlement?: { method?: string } } | null)?.settlement;
  return settlement?.method === "refund";
}
