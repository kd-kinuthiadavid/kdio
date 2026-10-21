import { Link, Path, Svg, Text, View } from "@react-pdf/renderer";

import { brand } from "@/lib/brand";
import { formatDate } from "@/lib/documents/dates";
import {
  discountLabel,
  quantityLabel,
  type LineItem,
  type Totals,
} from "@/lib/documents/line-items";
import { formatAmount, formatMoney } from "@/lib/documents/money";
import type { PdfModel } from "@/lib/documents/pdf/model";
import { qrPath } from "@/lib/documents/pdf/qr";
import { pdfColors, styles } from "@/lib/documents/pdf/styles";
import { displayUrl, trackedUrl } from "@/lib/promo";

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

const plainLink = { color: pdfColors.muted, textDecoration: "none" as const };

function websiteLink(model: PdfModel, medium: "pdf" | "qr" = "pdf"): string | null {
  if (!model.promo) return null;
  return trackedUrl(model.promo.websiteUrl, {
    source: model.type,
    medium,
    campaign: medium === "pdf" ? model.number : null,
  });
}

type ContactItem = { text: string; href?: string };

function contactItems(model: PdfModel): ContactItem[] {
  const { issuer, promo } = model;
  const items: ContactItem[] = [];
  if (issuer.email) items.push({ text: issuer.email, href: promo ? `mailto:${issuer.email}` : undefined });
  if (issuer.phone) {
    items.push({ text: issuer.phone, href: promo ? `tel:${issuer.phone.replace(/\s+/g, "")}` : undefined });
  }
  const website = issuer.website ?? (promo ? displayUrl(promo.websiteUrl) : null);
  if (website) items.push({ text: website, href: websiteLink(model) ?? undefined });
  return items;
}

export function Letterhead({ model }: { model: PdfModel }) {
  const { issuer } = model;
  const contact = contactItems(model);
  const home = websiteLink(model);
  const brandMark = (
    <View style={[styles.row, { alignItems: "center", marginBottom: 8 }]}>
      <Logo />
      <Text style={[styles.brandName, { marginLeft: 8 }]}>{issuer.name}</Text>
    </View>
  );
  return (
    <View>
      <View style={styles.accentBar} fixed />
      <View style={styles.spaceBetween}>
        <View style={{ maxWidth: 280 }}>
          {home ? (
            <Link src={home} style={{ textDecoration: "none" }}>
              {brandMark}
            </Link>
          ) : (
            brandMark
          )}
          {issuer.addressLines.map((l) => (
            <Text key={l} style={styles.muted}>
              {l}
            </Text>
          ))}
          {contact.length ? (
            <Text style={styles.muted}>
              {contact.map((c, i) => (
                <Text key={c.text}>
                  {i > 0 ? "  ·  " : ""}
                  {c.href ? (
                    <Link src={c.href} style={plainLink}>
                      {c.text}
                    </Link>
                  ) : (
                    c.text
                  )}
                </Text>
              ))}
            </Text>
          ) : null}
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
  const home = websiteLink(model);
  return (
    <View style={styles.footer} fixed>
      <Text>
        {model.issuer.name}
        {model.number ? `  ·  ${model.number}` : ""}
      </Text>
      {home && model.promo ? (
        <Link src={home} style={plainLink}>
          {displayUrl(model.promo.websiteUrl)}
        </Link>
      ) : null}
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );
}

const QR_SIZE = 62;

/**
 * A short thank-you with a booking link, a referral ask and a QR code to book a
 * call. Only on documents that ask for payment, never on credit notes or voids.
 */
export function PromoBlock({ model }: { model: PdfModel }) {
  const { promo } = model;
  if (!promo || model.type === "credit_note" || model.status === "void") return null;
  const booking = trackedUrl(promo.bookingUrl, {
    source: model.type,
    medium: "pdf",
    campaign: model.number,
  });
  const qr = qrPath(trackedUrl(promo.bookingUrl, { source: model.type, medium: "qr" }));
  return (
    <View
      style={[
        styles.section,
        styles.row,
        {
          marginTop: 24,
          padding: 12,
          gap: 16,
          alignItems: "center",
          backgroundColor: pdfColors.bg,
          borderLeftWidth: 3,
          borderLeftColor: pdfColors.primary,
          borderRadius: 4,
        },
      ]}
      wrap={false}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.bold, { color: pdfColors.primary, fontSize: 10.5, marginBottom: 4 }]}>
          Thank you for your business.
        </Text>
        <Text>
          Planning what&apos;s next? Book a call at{" "}
          <Link src={booking} style={{ color: pdfColors.primary }}>
            {displayUrl(promo.bookingUrl)}
          </Link>
          .
        </Text>
        <Text style={[styles.muted, { marginTop: 4 }]}>
          Know a team shipping AI where mistakes are expensive? Introductions are always
          appreciated.
        </Text>
      </View>
      <Link src={booking} style={{ textDecoration: "none", alignItems: "center" }}>
        <Svg width={QR_SIZE} height={QR_SIZE} viewBox={`-2 -2 ${qr.size + 4} ${qr.size + 4}`}>
          <Path d={qr.path} fill={pdfColors.fg} />
        </Svg>
        <Text style={[styles.muted, { fontSize: 7, marginTop: 2 }]}>Scan to book</Text>
      </Link>
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
