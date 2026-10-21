import type { DocumentStatus, DocumentType } from "@/db/schema";
import type { Issuer } from "@/lib/documents/issuer";
import type { Totals } from "@/lib/documents/line-items";
import type { CustomerSnapshot, RelatedSnapshot } from "@/lib/documents/snapshot";
import type { PromoLinks } from "@/lib/promo";

export type PdfModel = {
  type: DocumentType;
  title: string;
  number: string | null;
  status: DocumentStatus;
  issuedAt: Date | null;
  currency: string;
  issuer: Issuer;
  customer: CustomerSnapshot;
  /** Type-specific payload, already validated by the registry schema */
  data: Record<string, unknown>;
  totals: Totals;
  related: RelatedSnapshot | null;
  promo: PromoLinks | null;
};
