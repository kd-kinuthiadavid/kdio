import type { DocumentRow } from "@/db/schema";
import {
  newLineItemId,
  type Discount,
  type LineItem,
  type Unit,
} from "@/lib/documents/line-items";
import { fromMinor, toMinor } from "@/lib/documents/money";
import type { InvoiceData } from "@/lib/documents/types/invoice";

/** Editable line state: numbers stay as strings while typing, money in major units. */
export type FormLine = {
  id: string;
  description: string;
  quantity: string;
  unit: Unit;
  unitPrice: string;
  discountKind: "none" | Discount["kind"];
  discountValue: string;
  taxRate: string;
};

export type FormDiscount = {
  kind: "none" | Discount["kind"];
  value: string;
};

function num(value: string): number {
  const n = Number(value.replace(/,/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

export function emptyFormLine(): FormLine {
  return {
    id: newLineItemId(),
    description: "",
    quantity: "1",
    unit: "item",
    unitPrice: "",
    discountKind: "none",
    discountValue: "",
    taxRate: "0",
  };
}

export function toDiscount(d: FormDiscount): Discount | null {
  if (d.kind === "none" || d.value.trim() === "") return null;
  const value = num(d.value);
  return { kind: d.kind, value: d.kind === "amount" ? toMinor(value) : value };
}

export function fromDiscount(d: Discount | null | undefined): FormDiscount {
  if (!d) return { kind: "none", value: "" };
  return {
    kind: d.kind,
    value: String(d.kind === "amount" ? fromMinor(d.value) : d.value),
  };
}

export function toLineItem(l: FormLine): LineItem {
  return {
    id: l.id,
    description: l.description,
    quantity: num(l.quantity),
    unit: l.unit,
    unitPriceMinor: l.unitPrice.trim() === "" ? NaN : toMinor(num(l.unitPrice)),
    discount: toDiscount({ kind: l.discountKind, value: l.discountValue }),
    taxRate: l.taxRate.trim() === "" ? 0 : num(l.taxRate),
  };
}

export function fromLineItem(l: LineItem): FormLine {
  const d = fromDiscount(l.discount);
  return {
    id: l.id,
    description: l.description,
    quantity: String(l.quantity),
    unit: l.unit,
    unitPrice: String(fromMinor(l.unitPriceMinor)),
    discountKind: d.kind,
    discountValue: d.value,
    taxRate: String(l.taxRate),
  };
}

export type DocumentFormValues = {
  id?: string;
  customerId: string;
  currency: string;
  relatedDocumentId?: string | null;
  issueDate: string;
  dueDate: string;
  servicePeriodFrom: string;
  servicePeriodTo: string;
  reference: string;
  lines: FormLine[];
  documentDiscount: FormDiscount;
  notes: string;
  terms: string;
};

export function formValuesFromDocument(doc: DocumentRow): DocumentFormValues {
  const data = doc.data as InvoiceData;
  return {
    id: doc.id,
    customerId: doc.customerId,
    currency: doc.currency,
    relatedDocumentId: doc.relatedDocumentId,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    servicePeriodFrom: data.servicePeriodFrom ?? "",
    servicePeriodTo: data.servicePeriodTo ?? "",
    reference: data.reference ?? "",
    lines: data.lines.map(fromLineItem),
    documentDiscount: fromDiscount(data.documentDiscount),
    notes: data.notes ?? "",
    terms: data.terms ?? "",
  };
}

/** A line is usable for live totals once its numbers parse. */
export function isComputable(l: LineItem): boolean {
  return (
    Number.isFinite(l.quantity) &&
    Number.isFinite(l.unitPriceMinor) &&
    Number.isFinite(l.taxRate) &&
    (!l.discount || Number.isFinite(l.discount.value))
  );
}
