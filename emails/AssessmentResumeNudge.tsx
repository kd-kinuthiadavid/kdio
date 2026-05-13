import { Button, Heading, Text } from "@react-email/components";

import { EmailShell, colors } from "./_layout";

export type AssessmentResumeNudgeProps = {
  preview: string;
  headline: string;
  body: string;
  resumeUrl: string;
  ctaLabel: string;
};

export default function AssessmentResumeNudgeEmail({
  preview,
  headline,
  body,
  resumeUrl,
  ctaLabel,
}: AssessmentResumeNudgeProps) {
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
      <Text style={{ fontSize: "16px", lineHeight: "26px", color: colors.fg, margin: "0 0 28px" }}>
        {body}
      </Text>
      <div style={{ textAlign: "center" as const }}>
        <Button
          href={resumeUrl}
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
          {ctaLabel}
        </Button>
      </div>
    </EmailShell>
  );
}
