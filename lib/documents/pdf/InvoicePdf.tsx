import { Document, Page } from "@react-pdf/renderer";

import { formatDate } from "@/lib/documents/dates";
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
  TotalsBlock,
} from "@/lib/documents/pdf/parts";
import { styles } from "@/lib/documents/pdf/styles";
import type { InvoiceData } from "@/lib/documents/types/invoice";

export function InvoicePdf({ model }: { model: PdfModel }) {
  const data = model.data as InvoiceData;
  const period =
    data.servicePeriodFrom && data.servicePeriodTo
      ? `${formatDate(data.servicePeriodFrom)} – ${formatDate(data.servicePeriodTo)}`
      : null;

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
            period ? { label: "Service period", value: period } : null,
            data.reference ? { label: "Reference", value: data.reference } : null,
            { label: "Currency", value: model.currency },
          ])}
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
