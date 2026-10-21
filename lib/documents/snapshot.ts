import type { CustomerRow, DocumentRow } from "@/db/schema";
import type { Issuer } from "@/lib/documents/issuer";
import type { Totals } from "@/lib/documents/line-items";
import type { PromoLinks } from "@/lib/promo";

export type CustomerSnapshot = Pick<
  CustomerRow,
  "name" | "company" | "email" | "phone" | "addressLines" | "country" | "taxId"
>;

export type RelatedSnapshot = { number: string; issueDate: string };

export type DocumentSnapshot = {
  issuer: Issuer;
  customer: CustomerSnapshot;
  totals: Totals;
  related?: RelatedSnapshot | null;
  /** Absent on documents issued before links were added; they render without them. */
  promo?: PromoLinks | null;
};

export function customerSnapshot(c: CustomerRow): CustomerSnapshot {
  return {
    name: c.name,
    company: c.company,
    email: c.email,
    phone: c.phone,
    addressLines: c.addressLines,
    country: c.country,
    taxId: c.taxId,
  };
}

export function getSnapshot(document: DocumentRow): DocumentSnapshot | null {
  return (document.snapshot as DocumentSnapshot | null) ?? null;
}
