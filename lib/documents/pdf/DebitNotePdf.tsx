import { Document, Page } from "@react-pdf/renderer";

import type { PdfModel } from "@/lib/documents/pdf/model";
import {
  compactRows,
  dateRow,
  documentProps,
  DraftWatermark,
  Footer,
  Letterhead,
  LineItemsTable,
  NotesBlock,
  PartiesAndMeta,
  PromoBlock,
  relatedRows,
  TotalsBlock,
} from "@/lib/documents/pdf/parts";
import { styles } from "@/lib/documents/pdf/styles";
import { DEBIT_NOTE_REASONS, type DebitNoteData } from "@/lib/documents/types/debit-note";

export function DebitNotePdf({ model }: { model: PdfModel }) {
  const data = model.data as DebitNoteData;

  return (
    <Document {...documentProps(model)}>
      <Page size="A4" style={styles.page}>
        <DraftWatermark model={model} />
        <Letterhead model={model} />
        <PartiesAndMeta
          model={model}
          meta={compactRows([
            dateRow("Issue date", data.issueDate),
            dateRow("Due date", data.dueDate),
            ...relatedRows(model),
            data.reference ? { label: "Reference", value: data.reference } : null,
            { label: "Currency", value: model.currency },
          ])}
        />
        <NotesBlock
          title="Reason"
          lines={[DEBIT_NOTE_REASONS[data.reason]]}
          text={data.reasonDetails}
        />
        <LineItemsTable lines={data.lines} totals={model.totals} currency={model.currency} />
        <TotalsBlock totals={model.totals} currency={model.currency} totalLabel="Amount due" />
        <NotesBlock title="Payment details" lines={model.issuer.paymentLines} />
        <NotesBlock title="Notes" text={data.notes} />
        <NotesBlock title="Terms" text={data.terms} />
        <PromoBlock model={model} />
        <Footer model={model} />
      </Page>
    </Document>
  );
}
