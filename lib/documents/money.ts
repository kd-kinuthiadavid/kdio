export const CURRENCIES = ["USD", "EUR", "GBP", "KES"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const PAYMENT_METHODS = ["bank", "mpesa", "card", "other"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  bank: "Bank transfer",
  mpesa: "M-Pesa",
  card: "Card",
  other: "Other",
};

/** All supported currencies use 2 minor digits. */
const MINOR_FACTOR = 100;

export function toMinor(major: number | string): number {
  const n = typeof major === "string" ? Number(major.replace(/,/g, "")) : major;
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * MINOR_FACTOR);
}

export function fromMinor(minor: number): number {
  return minor / MINOR_FACTOR;
}

export function formatMoney(minor: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "code",
  }).format(fromMinor(minor));
}

export function formatAmount(minor: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(fromMinor(minor));
}

export function percentOf(minor: number, percent: number): number {
  return Math.round((minor * percent) / 100);
}

/**
 * Splits `amount` across `weights` proportionally using largest remainder,
 * so the parts always sum exactly to `amount`.
 */
export function allocate(amount: number, weights: number[]): number[] {
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0 || amount === 0) return weights.map(() => 0);
  const raw = weights.map((w) => (amount * w) / total);
  const parts = raw.map((r) => Math.floor(r));
  let remainder = amount - parts.reduce((a, b) => a + b, 0);
  const order = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac);
  for (const { i } of order) {
    if (remainder <= 0) break;
    parts[i] += 1;
    remainder -= 1;
  }
  return parts;
}
