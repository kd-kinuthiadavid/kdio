import { Path, Svg, Text, View } from "@react-pdf/renderer";

import { brand } from "@/lib/brand";
import { formatDate } from "@/lib/documents/dates";
import type { LineItem, Totals } from "@/lib/documents/line-items";
import { formatAmount, formatMoney } from "@/lib/documents/money";
import type { PdfModel } from "@/lib/documents/pdf/model";
import { pdfColors, styles } from "@/lib/documents/pdf/styles";

function Logo({ size = 26 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {brand.logoPaths.map((d) => (
        <Path
          key={d}
          d={d}
          fill="none"
          stroke={pdfColors.primary}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
}

/**
 * PDF metadata. Pinning both dates to the issue time keeps re-renders of an
 * issued document byte-identical, so its stored sha256 can be re-verified.
 */
export function documentProps(model: PdfModel) {
  const date = model.issuedAt ?? undefined;
  return {
    title: `${model.title} ${model.number ?? "draft"}`,
    author: model.issuer.name,
    creationDate: date,
    modificationDate: date,
  };
}

export function Letterhead({ model }: { model: PdfModel }) {
  const { issuer } = model;
  const contact = [issuer.email, issuer.phone, issuer.website].filter(Boolean);
  return (
    <View>
      <View style={styles.accentBar} fixed />
      <View style={styles.spaceBetween}>
        <View style={{ maxWidth: 280 }}>
          <View style={[styles.row, { alignItems: "center", marginBottom: 8 }]}>
            <Logo />
            <Text style={[styles.brandName, { marginLeft: 8 }]}>{issuer.name}</Text>
          </View>
          {issuer.addressLines.map((l) => (
            <Text key={l} style={styles.muted}>
              {l}
            </Text>
          ))}
          {contact.length ? <Text style={styles.muted}>{contact.join("  ·  ")}</Text> : null}
          {issuer.kraPin ? <Text style={styles.muted}>KRA PIN: {issuer.kraPin}</Text> : null}
          {issuer.vatNumber ? <Text style={styles.muted}>VAT No: {issuer.vatNumber}</Text> : null}
        </View>
        <View>
          <Text style={styles.title}>{model.title.toUpperCase()}</Text>
          <Text style={[styles.bold, { textAlign: "right", fontSize: 11 }]}>
            {model.number ?? "Draft"}
          </Text>
          {model.status === "void" ? (
            <Text style={[styles.bold, { textAlign: "right", color: "#b42318", marginTop: 2 }]}>
              VOID
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export type MetaRow = { label: string; value: string };

export function PartiesAndMeta({
  model,
  billToLabel = "Bill to",
  meta,
}: {
  model: PdfModel;
  billToLabel?: string;
  meta: MetaRow[];
}) {
  const c = model.customer;
  return (
    <View style={[styles.section, styles.row, { gap: 16 }]}>
      <View style={[styles.box, { flex: 1 }]}>
        <Text style={styles.label}>{billToLabel}</Text>
        <Text style={styles.bold}>{c.company ?? c.name}</Text>
        {c.company ? <Text>Attn: {c.name}</Text> : null}
        {c.addressLines.map((l) => (
          <Text key={l}>{l}</Text>
        ))}
        {c.country ? <Text>{c.country}</Text> : null}
        {c.email ? <Text style={styles.muted}>{c.email}</Text> : null}
        {c.taxId ? <Text style={styles.muted}>Tax ID: {c.taxId}</Text> : null}
      </View>
      <View style={[styles.box, { width: 210 }]}>
        {meta.map((m) => (
          <View key={m.label} style={[styles.spaceBetween, { paddingVertical: 1.5 }]}>
            <Text style={styles.muted}>{m.label}</Text>
            <Text style={styles.bold}>{m.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const col = {
  description: { flex: 4.2 },
  qty: { flex: 1, textAlign: "right" as const },
  price: { flex: 1.4, textAlign: "right" as const },
  discount: { flex: 1.2, textAlign: "right" as const },
  tax: { flex: 0.8, textAlign: "right" as const },
  amount: { flex: 1.5, textAlign: "right" as const },
};

function quantityLabel(line: LineItem): string {
  if (line.unit === "fixed") return String(line.quantity);
  return `${line.quantity} ${line.unit}${line.quantity === 1 ? "" : "s"}`;
}

function discountLabel(line: LineItem, discountMinor: number): string {
  if (!line.discount || discountMinor === 0) return "—";
  return line.discount.kind === "percent"
    ? `${line.discount.value}%`
    : formatAmount(discountMinor);
}

export function LineItemsTable({
  lines,
  totals,
  currency,
}: {
  lines: LineItem[];
  totals: Totals;
  currency: string;
}) {
  const showDiscount = lines.some((l) => l.discount);
  const showTax = lines.some((l) => l.taxRate > 0);
  return (
    <View style={styles.section}>
      <View style={styles.tableHeader} fixed>
        <Text style={[styles.th, col.description]}>Description</Text>
        <Text style={[styles.th, col.qty]}>Qty</Text>
        <Text style={[styles.th, col.price]}>Unit price</Text>
        {showDiscount ? <Text style={[styles.th, col.discount]}>Discount</Text> : null}
        {showTax ? <Text style={[styles.th, col.tax]}>Tax</Text> : null}
        <Text style={[styles.th, col.amount]}>Amount ({currency})</Text>
      </View>
      {lines.map((l, i) => {
        const t = totals.lines[i];
        return (
          <View key={l.id} style={styles.tableRow} wrap={false}>
            <Text style={col.description}>{l.description}</Text>
            <Text style={col.qty}>{quantityLabel(l)}</Text>
            <Text style={col.price}>{formatAmount(l.unitPriceMinor)}</Text>
            {showDiscount ? (
              <Text style={col.discount}>{discountLabel(l, t.lineDiscountMinor)}</Text>
            ) : null}
            {showTax ? <Text style={col.tax}>{l.taxRate ? `${l.taxRate}%` : "—"}</Text> : null}
            <Text style={col.amount}>{formatAmount(t.grossMinor - t.lineDiscountMinor)}</Text>
          </View>
        );
      })}
    </View>
  );
}

export function TotalsBlock({
  totals,
  currency,
  documentDiscountLineLabel,
  totalLabel = "Total",
}: {
  totals: Totals;
  currency: string;
  documentDiscountLineLabel?: string | null;
  totalLabel?: string;
}) {
  const lineDiscount = totals.lines.reduce((a, l) => a + l.lineDiscountMinor, 0);
  const docDiscount = totals.discountMinor - lineDiscount;
  return (
    <View style={[styles.row, { justifyContent: "flex-end", marginTop: 12 }]} wrap={false}>
      <View style={{ width: 230 }}>
        <View style={styles.totalsRow}>
          <Text style={styles.muted}>Subtotal</Text>
          <Text>{formatAmount(totals.subtotalMinor - lineDiscount)}</Text>
        </View>
        {docDiscount > 0 ? (
          <View style={styles.totalsRow}>
            <Text style={styles.muted}>{documentDiscountLineLabel ?? "Discount"}</Text>
            <Text>−{formatAmount(docDiscount)}</Text>
          </View>
        ) : null}
        {totals.taxBreakdown.map((t) => (
          <View key={t.rate} style={styles.totalsRow}>
            <Text style={styles.muted}>
              Tax {t.rate}% on {formatAmount(t.taxableMinor)}
            </Text>
            <Text>{formatAmount(t.taxMinor)}</Text>
          </View>
        ))}
        <View style={styles.grandTotal}>
          <Text style={styles.bold}>{totalLabel}</Text>
          <Text style={styles.bold}>{formatMoney(totals.totalMinor, currency)}</Text>
        </View>
      </View>
    </View>
  );
}

export function NotesBlock({
  title,
  lines,
  text,
}: {
  title: string;
  lines?: string[];
  text?: string | null;
}) {
  if (!lines?.length && !text) return null;
  return (
    <View style={[styles.section, { marginTop: 16 }]} wrap={false}>
      <Text style={styles.label}>{title}</Text>
      {lines?.map((l) => <Text key={l}>{l}</Text>)}
      {text ? <Text>{text}</Text> : null}
    </View>
  );
}

export function Footer({ model }: { model: PdfModel }) {
  return (
    <View style={styles.footer} fixed>
      <Text>
        {model.issuer.name}
        {model.number ? `  ·  ${model.number}` : ""}
      </Text>
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );
}

export function DraftWatermark({ model }: { model: PdfModel }) {
  if (model.status !== "draft") return null;
  return (
    <Text style={styles.watermark} fixed>
      DRAFT
    </Text>
  );
}

export function dateRow(label: string, iso: string | undefined | null): MetaRow | null {
  return iso ? { label, value: formatDate(iso) } : null;
}

/** Original invoice reference shown on credit and debit notes. */
export function relatedRows(model: PdfModel): (MetaRow | null)[] {
  if (!model.related) return [];
  return [
    { label: "Original invoice", value: model.related.number },
    dateRow("Invoice date", model.related.issueDate),
  ];
}

export function compactRows(rows: (MetaRow | null)[]): MetaRow[] {
  return rows.filter((r): r is MetaRow => r !== null);
}
