import { Document, Page } from "@react-pdf/renderer";

import { formatDate } from "@/lib/documents/dates";
import { PAYMENT_METHOD_LABELS } from "@/lib/documents/money";
import type { PdfModel } from "@/lib/documents/pdf/model";
import {
  compactRows,
  dateRow,
  DraftWatermark,
  Footer,
  Letterhead,
  LineItemsTable,
  NotesBlock,
  PartiesAndMeta,
  relatedRows,
  TotalsBlock,
} from "@/lib/documents/pdf/parts";
import { styles } from "@/lib/documents/pdf/styles";
import {
  CREDIT_NOTE_REASONS,
  type CreditNoteData,
} from "@/lib/documents/types/credit-note";

function settlementText(data: CreditNoteData, model: PdfModel): string {
  const s = data.settlement;
  if (s.method === "refund") {
    const how = s.refundMethod ? ` via ${PAYMENT_METHOD_LABELS[s.refundMethod]}` : "";
    const when = s.refundDate ? ` on ${formatDate(s.refundDate)}` : "";
    return `Refunded to the customer${how}${when}.`;
  }
  if (s.method === "apply_to_balance") {
    return model.related
      ? `Applied against the balance of invoice ${model.related.number}.`
      : "Applied against the balance of the original invoice.";
  }
  return "Held as credit towards future invoices.";
}

export function CreditNotePdf({ model }: { model: PdfModel }) {
  const data = model.data as CreditNoteData;
  const reason = CREDIT_NOTE_REASONS[data.reason];

  return (
    <Document title={`${model.title} ${model.number ?? "draft"}`} author={model.issuer.name}>
      <Page size="A4" style={styles.page}>
        <DraftWatermark model={model} />
        <Letterhead model={model} />
        <PartiesAndMeta
          model={model}
          billToLabel="Credit to"
          meta={compactRows([
            dateRow("Issue date", data.issueDate),
            ...relatedRows(model),
            data.reference ? { label: "Reference", value: data.reference } : null,
            { label: "Currency", value: model.currency },
          ])}
        />
        <NotesBlock
          title="Reason"
          lines={[reason]}
          text={data.reasonDetails}
        />
        <LineItemsTable lines={data.lines} totals={model.totals} currency={model.currency} />
        <TotalsBlock totals={model.totals} currency={model.currency} totalLabel="Total credit" />
        <NotesBlock title="Settlement" text={settlementText(data, model)} />
        <NotesBlock title="Notes" text={data.notes} />
        <Footer model={model} />
      </Page>
    </Document>
  );
}
