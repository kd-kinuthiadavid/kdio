import type { ReactNode } from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import { brand, brandColors as colors } from "@/lib/brand";
import { getDiscoveryCallUrl } from "@/lib/cal";
import { trackedUrl } from "@/lib/promo";
import { getSiteUrl } from "@/lib/site-url";

export { colors };

/** Which email a click came from, for UTM tagging of every link in the shell. */
export type EmailUtm = { source: string; campaign?: string | null };

const footerLink = { color: colors.muted, textDecoration: "underline" };

export function EmailShell({
  preview,
  utm = { source: "email" },
  children,
}: {
  preview: string;
  utm?: EmailUtm;
  children: ReactNode;
}) {
  const site = getSiteUrl();
  const track = (url: string) => trackedUrl(url, { ...utm, medium: "email" });
  const links = [
    { label: "Website", href: track(site) },
    { label: "Services", href: track(`${site}/en/services`) },
    { label: "Book a call", href: track(getDiscoveryCallUrl()) },
    { label: "LinkedIn", href: brand.linkedinUrl },
  ];

  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light only" />
      </Head>
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: colors.bg,
          color: colors.fg,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          margin: 0,
          padding: "32px 16px",
        }}
      >
        <Container
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            backgroundColor: colors.card,
            borderRadius: "12px",
            border: `1px solid ${colors.border}`,
            padding: "32px 36px 40px",
          }}
        >
          <Section style={{ margin: "0 0 28px" }}>
            <Link href={track(site)} style={{ textDecoration: "none" }}>
              <table cellPadding={0} cellSpacing={0} role="presentation">
                <tbody>
                  <tr>
                    <td style={{ verticalAlign: "middle" }}>
                      <Img
                        src={`${site}/email/logo.png`}
                        width="28"
                        height="28"
                        alt=""
                        style={{ display: "block" }}
                      />
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                        paddingLeft: "10px",
                        color: colors.primary,
                        fontSize: "16px",
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {brand.name}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Link>
          </Section>
          {children}
        </Container>
        <Section style={{ maxWidth: "560px", margin: "24px auto 0", textAlign: "center" }}>
          <Text style={{ color: colors.fg, fontSize: "13px", fontWeight: 600, margin: 0 }}>
            {brand.name}
          </Text>
          <Text style={{ color: colors.muted, fontSize: "12px", margin: "2px 0 8px" }}>
            {brand.tagline}
          </Text>
          <Text style={{ color: colors.muted, fontSize: "12px", margin: 0 }}>
            {links.map((l, i) => (
              <span key={l.label}>
                {i > 0 ? "  ·  " : ""}
                <Link href={l.href} style={footerLink}>
                  {l.label}
                </Link>
              </span>
            ))}
          </Text>
        </Section>
      </Body>
    </Html>
  );
}

export { Body, Button, Container, Heading, Hr, Img, Link, Section, Text };
