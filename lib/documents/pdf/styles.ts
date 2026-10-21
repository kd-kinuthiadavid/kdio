import { StyleSheet } from "@react-pdf/renderer";

import { brandColors as c } from "@/lib/brand";

export const pdfColors = c;

export const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 64,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: c.fg,
    lineHeight: 1.4,
  },
  row: { flexDirection: "row" },
  spaceBetween: { flexDirection: "row", justifyContent: "space-between" },
  muted: { color: c.muted },
  small: { fontSize: 8.5 },
  bold: { fontFamily: "Helvetica-Bold" },
  label: {
    fontSize: 7.5,
    color: c.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  accentBar: {
    height: 4,
    backgroundColor: c.primary,
    marginHorizontal: -44,
    marginTop: -40,
    marginBottom: 28,
  },
  brandName: { fontSize: 15, fontFamily: "Helvetica-Bold", color: c.primary },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: c.primary,
    textAlign: "right",
    letterSpacing: 1,
    lineHeight: 1.1,
    marginBottom: 6,
  },
  section: { marginTop: 22 },
  box: {
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 4,
    padding: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: c.bg,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    paddingVertical: 7,
    paddingHorizontal: 6,
  },
  th: {
    fontSize: 7.5,
    color: c.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  num: { textAlign: "right" },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 8,
    paddingHorizontal: 8,
    paddingBottom: 8,
    backgroundColor: c.primary,
    color: "#ffffff",
    borderRadius: 4,
  },
  // The page-number render prop is re-laid out on a detached page, which
  // re-scales a unitless lineHeight and ignores `bottom`; without the point
  // lineHeight and `top` offset (A4 height minus 28pt margin and footer
  // height) the footer silently disappears.
  footer: {
    position: "absolute",
    top: 794,
    lineHeight: "1.4pt",
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: c.muted,
    borderTopWidth: 1,
    borderTopColor: c.border,
    paddingTop: 8,
  },
  watermark: {
    position: "absolute",
    top: 330,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 110,
    fontFamily: "Helvetica-Bold",
    color: c.border,
    opacity: 0.6,
    transform: "rotate(-30deg)",
  },
});
