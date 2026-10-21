import type { DocumentRow, DocumentType } from "@/db/schema";
import { addDaysIso } from "@/lib/documents/dates";
import {
  newLineItemId,
  type Discount,
  type LineItem,
  type Unit,
} from "@/lib/documents/line-items";
import { fromMinor, toMinor, type PaymentMethod } from "@/lib/documents/money";
import type { CreditNoteData, SettlementMethod } from "@/lib/documents/types/credit-note";
import type { DebitNoteData } from "@/lib/documents/types/debit-note";
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

/** One flat shape for every document type; each type reads the fields it needs. */
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
  reason: string;
  reasonDetails: string;
  settlementMethod: SettlementMethod | "";
  refundMethod: PaymentMethod | "";
  refundDate: string;
};

const blank = {
  servicePeriodFrom: "",
  servicePeriodTo: "",
  reference: "",
  notes: "",
  terms: "",
  reason: "",
  reasonDetails: "",
  settlementMethod: "",
  refundMethod: "",
  refundDate: "",
} satisfies Partial<DocumentFormValues>;

function optional(v: string): string | undefined {
  const t = v.trim();
  return t ? t : undefined;
}

/** Builds the type-specific `data` payload the registry schema validates. */
export function toDocumentData(type: DocumentType, v: DocumentFormValues) {
  const common = {
    issueDate: v.issueDate,
    reference: optional(v.reference),
    lines: v.lines.map(toLineItem),
    documentDiscount: toDiscount(v.documentDiscount),
    notes: optional(v.notes),
  };
  switch (type) {
    case "invoice":
      return {
        ...common,
        dueDate: v.dueDate,
        servicePeriodFrom: optional(v.servicePeriodFrom),
        servicePeriodTo: optional(v.servicePeriodTo),
        terms: optional(v.terms),
      };
    case "credit_note":
      return {
        ...common,
        reason: optional(v.reason),
        reasonDetails: optional(v.reasonDetails),
        settlement: {
          method: optional(v.settlementMethod),
          refundMethod: v.settlementMethod === "refund" ? optional(v.refundMethod) : undefined,
          refundDate: v.settlementMethod === "refund" ? optional(v.refundDate) : undefined,
        },
      };
    case "debit_note":
      return {
        ...common,
        reason: optional(v.reason),
        reasonDetails: optional(v.reasonDetails),
        dueDate: v.dueDate,
        terms: optional(v.terms),
      };
  }
}

export function newInvoiceValues(
  issueDate: string,
  customer?: { id: string; defaultCurrency: string; paymentTermsDays: number }
): DocumentFormValues {
  return {
    ...blank,
    customerId: customer?.id ?? "",
    currency: customer?.defaultCurrency ?? "USD",
    issueDate,
    dueDate: addDaysIso(issueDate, customer?.paymentTermsDays ?? 14),
    lines: [emptyFormLine()],
    documentDiscount: { kind: "none", value: "" },
  };
}

/** Starts a credit or debit note from an issued invoice, copying its lines. */
export function noteValuesFromInvoice(
  type: "credit_note" | "debit_note",
  invoice: DocumentRow,
  issueDate: string,
  paymentTermsDays: number
): DocumentFormValues {
  const data = invoice.data as InvoiceData;
  return {
    ...blank,
    customerId: invoice.customerId,
    currency: invoice.currency,
    relatedDocumentId: invoice.id,
    issueDate,
    dueDate: addDaysIso(issueDate, paymentTermsDays),
    reference: data.reference ?? "",
    lines: data.lines.map((l) => ({ ...fromLineItem(l), id: newLineItemId() })),
    documentDiscount: fromDiscount(data.documentDiscount),
    settlementMethod: type === "credit_note" ? "apply_to_balance" : "",
  };
}

export function formValuesFromDocument(doc: DocumentRow): DocumentFormValues {
  const base = doc.data as InvoiceData & Partial<CreditNoteData> & Partial<DebitNoteData>;
  const settlement = (doc.data as Partial<CreditNoteData>).settlement;
  return {
    ...blank,
    id: doc.id,
    customerId: doc.customerId,
    currency: doc.currency,
    relatedDocumentId: doc.relatedDocumentId,
    issueDate: base.issueDate,
    dueDate: base.dueDate ?? "",
    servicePeriodFrom: base.servicePeriodFrom ?? "",
    servicePeriodTo: base.servicePeriodTo ?? "",
    reference: base.reference ?? "",
    lines: base.lines.map(fromLineItem),
    documentDiscount: fromDiscount(base.documentDiscount),
    notes: base.notes ?? "",
    terms: base.terms ?? "",
    reason: base.reason ?? "",
    reasonDetails: base.reasonDetails ?? "",
    settlementMethod: settlement?.method ?? "",
    refundMethod: settlement?.refundMethod ?? "",
    refundDate: settlement?.refundDate ?? "",
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
