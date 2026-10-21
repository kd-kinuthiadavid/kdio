import type { DocumentType } from "@/db/schema";
import { CREDIT_NOTE_REASONS } from "@/lib/documents/types/credit-note";
import { DEBIT_NOTE_REASONS } from "@/lib/documents/types/debit-note";

const LABELS: Partial<Record<DocumentType, Record<string, string>>> = {
  credit_note: CREDIT_NOTE_REASONS,
  debit_note: DEBIT_NOTE_REASONS,
};

export function reasonOptions(type: DocumentType): Record<string, string> | undefined {
  return LABELS[type];
}

export function reasonLabel(type: DocumentType, reason: string): string {
  return LABELS[type]?.[reason] ?? reason;
}
