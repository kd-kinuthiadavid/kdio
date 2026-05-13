import { Button, Heading, Hr, Link, Section, Text } from "@react-email/components";

import { EmailShell, colors } from "./_layout";

export type AssessmentCompleteProspectProps = {
  preview: string;
  headline: string;
  intro: string;
  serviceLine: string;
  tierLine: string;
  nextSteps: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  siteUrl: string;
};

export default function AssessmentCompleteProspectEmail({
  preview,
  headline,
  intro,
  serviceLine,
  tierLine,
  nextSteps,
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
  siteUrl,
}: AssessmentCompleteProspectProps) {
  return (
    <EmailShell preview={preview}>
      <Heading
        as="h1"
        style={{
          fontSize: "22px",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          margin: "0 0 20px",
          color: colors.fg,
        }}
      >
        {headline}
      </Heading>
      <Text style={{ fontSize: "16px", lineHeight: "26px", color: colors.fg, margin: "0 0 16px" }}>
        {intro}
      </Text>
      <Section
        style={{
          backgroundColor: colors.bg,
          borderRadius: "8px",
          padding: "16px 18px",
          marginBottom: "20px",
        }}
      >
        <Text style={{ margin: "0 0 8px", fontSize: "14px", color: colors.muted }}>
          Recommended focus
        </Text>
        <Text style={{ margin: 0, fontSize: "17px", fontWeight: 600, color: colors.primary }}>
          {serviceLine}
        </Text>
        <Text style={{ margin: "12px 0 0", fontSize: "15px", color: colors.fg }}>{tierLine}</Text>
      </Section>
      <Text style={{ fontSize: "15px", lineHeight: "24px", color: colors.fg, margin: "0 0 24px" }}>
        {nextSteps}
      </Text>
      <Section style={{ textAlign: "center" as const, marginBottom: "12px" }}>
        <Button
          href={primaryCtaUrl}
          style={{
            backgroundColor: colors.primary,
            color: "#f4f4e8",
            padding: "14px 28px",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "15px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {primaryCtaLabel}
        </Button>
      </Section>
      {secondaryCtaLabel && secondaryCtaUrl ? (
        <Section style={{ textAlign: "center" as const, marginBottom: "24px" }}>
          <Link
            href={secondaryCtaUrl}
            style={{ color: colors.primary, fontSize: "14px", fontWeight: 500 }}
          >
            {secondaryCtaLabel}
          </Link>
        </Section>
      ) : null}
      <Hr style={{ borderColor: colors.border, margin: "24px 0" }} />
      <Text style={{ fontSize: "13px", color: colors.muted, margin: 0 }}>
        <Link href={siteUrl} style={{ color: colors.muted }}>
          Back to site
        </Link>
      </Text>
    </EmailShell>
  );
}
