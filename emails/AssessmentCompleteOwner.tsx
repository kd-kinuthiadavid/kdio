import { Heading, Link, Section, Text } from "@react-email/components";

import { EmailShell, colors } from "./_layout";

export type AssessmentCompleteOwnerProps = {
  preview: string;
  opener: string;
  email: string;
  locale: string;
  total: number;
  tier: string;
  serviceId: string;
  adminUrl: string;
};

export default function AssessmentCompleteOwnerEmail({
  preview,
  opener,
  email: prospectEmail,
  locale,
  total,
  tier,
  serviceId,
  adminUrl,
}: AssessmentCompleteOwnerProps) {
  return (
    <EmailShell preview={preview}>
      <Heading
        as="h1"
        style={{
          fontSize: "20px",
          fontWeight: 600,
          margin: "0 0 16px",
          color: colors.fg,
        }}
      >
        New completed assessment
      </Heading>
      <Text style={{ fontSize: "15px", lineHeight: "24px", color: colors.fg, margin: "0 0 12px" }}>
        <strong>{prospectEmail}</strong> · locale {locale}
      </Text>
      <Text style={{ fontSize: "15px", color: colors.fg, margin: "0 0 8px" }}>
        Score: <strong>{total}</strong>/100 · Tier: <strong>{tier}</strong> · Service:{" "}
        <strong>{serviceId}</strong>
      </Text>
      <Section
        style={{
          backgroundColor: colors.bg,
          borderRadius: "8px",
          padding: "14px 16px",
          marginTop: "16px",
          marginBottom: "20px",
        }}
      >
        <Text style={{ margin: 0, fontSize: "14px", color: colors.fg, fontStyle: "italic" }}>
          Call opener: {opener}
        </Text>
      </Section>
      <Link href={adminUrl} style={{ color: colors.primary, fontWeight: 600, fontSize: "14px" }}>
        Open in dashboard →
      </Link>
    </EmailShell>
  );
}
