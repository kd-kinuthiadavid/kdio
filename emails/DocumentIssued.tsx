import { Heading, Link, Section, Text } from "@react-email/components";

import { EmailShell, colors, type EmailUtm } from "./_layout";

export type DocumentIssuedProps = {
  preview: string;
  headline: string;
  greeting: string;
  intro: string;
  /** Optional personal note from the sender, shown as written */
  message?: string;
  rows: { label: string; value: string }[];
  /** How to pay; shown only on documents that ask for payment */
  paymentLines?: string[];
  terms?: string;
  signoff: string;
  senderName: string;
  postscript?: { text: string; linkLabel: string; href: string };
  utm?: EmailUtm;
};

const muted = { color: colors.muted, fontSize: "14px", margin: 0 };

const label = {
  color: colors.muted,
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  margin: "0 0 6px",
};

export default function DocumentIssuedEmail({
  preview,
  headline,
  greeting,
  intro,
  message,
  rows,
  paymentLines = [],
  terms,
  signoff,
  senderName,
  postscript,
  utm,
}: DocumentIssuedProps) {
  return (
    <EmailShell preview={preview} utm={utm}>
      <Heading
        as="h1"
        style={{
          fontSize: "22px",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          margin: "0 0 16px",
          color: colors.fg,
        }}
      >
        {headline}
      </Heading>
      <Text style={{ fontSize: "16px", lineHeight: "26px", color: colors.fg, margin: "0 0 12px" }}>
        {greeting}
      </Text>
      <Text style={{ fontSize: "16px", lineHeight: "26px", color: colors.fg, margin: "0 0 20px" }}>
        {intro}
      </Text>
      {message ? (
        <Text
          style={{
            fontSize: "15px",
            lineHeight: "24px",
            color: colors.fg,
            margin: "0 0 20px",
            whiteSpace: "pre-line",
          }}
        >
          {message}
        </Text>
      ) : null}
      <Section
        style={{
          border: `1px solid ${colors.border}`,
          borderRadius: "8px",
          padding: "16px 20px",
          margin: "0 0 24px",
        }}
      >
        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <td style={{ ...muted, padding: "4px 0" }}>{r.label}</td>
                <td
                  style={{
                    color: colors.fg,
                    fontSize: "14px",
                    fontWeight: 600,
                    padding: "4px 0",
                    textAlign: "right",
                  }}
                >
                  {r.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
      {paymentLines.length || terms ? (
        <Section
          style={{
            backgroundColor: colors.bg,
            borderRadius: "8px",
            padding: "16px 20px",
            margin: "0 0 24px",
          }}
        >
          {paymentLines.length ? (
            <>
              <Text style={label}>How to pay</Text>
              <Text style={{ fontSize: "14px", lineHeight: "22px", color: colors.fg, margin: 0 }}>
                {paymentLines.map((l, i) => (
                  <span key={l}>
                    {i > 0 ? <br /> : null}
                    {l}
                  </span>
                ))}
              </Text>
            </>
          ) : null}
          {terms ? (
            <>
              <Text style={{ ...label, margin: paymentLines.length ? "14px 0 6px" : label.margin }}>
                Terms
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  lineHeight: "22px",
                  color: colors.fg,
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {terms}
              </Text>
            </>
          ) : null}
        </Section>
      ) : null}
      <Text style={{ fontSize: "15px", lineHeight: "24px", color: colors.fg, margin: 0 }}>
        {signoff}
        <br />
        {senderName}
      </Text>
      {postscript ? (
        <Text style={{ ...muted, lineHeight: "22px", margin: "24px 0 0" }}>
          P.S. {postscript.text}{" "}
          <Link href={postscript.href} style={{ color: colors.primary, fontWeight: 600 }}>
            {postscript.linkLabel}
          </Link>
        </Text>
      ) : null}
    </EmailShell>
  );
}
