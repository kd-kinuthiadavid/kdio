import { Heading, Section, Text } from "@react-email/components";

import { EmailShell, colors } from "./_layout";

export type DocumentIssuedProps = {
  preview: string;
  headline: string;
  greeting: string;
  intro: string;
  /** Optional personal note from the sender, shown as written */
  message?: string;
  rows: { label: string; value: string }[];
  signoff: string;
  senderName: string;
};

const muted = { color: colors.muted, fontSize: "14px", margin: 0 };

export default function DocumentIssuedEmail({
  preview,
  headline,
  greeting,
  intro,
  message,
  rows,
  signoff,
  senderName,
}: DocumentIssuedProps) {
  return (
    <EmailShell preview={preview}>
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
      <Text style={{ fontSize: "15px", lineHeight: "24px", color: colors.fg, margin: 0 }}>
        {signoff}
        <br />
        {senderName}
      </Text>
    </EmailShell>
  );
}
