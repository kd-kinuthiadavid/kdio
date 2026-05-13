import type { ReactNode } from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

/** Light palette aligned with app/globals.css :root */
export const colors = {
  bg: "#f4f4e8",
  fg: "#1a1a12",
  muted: "#5c5c52",
  primary: "#0d4a45",
  border: "#e2e2d4",
  card: "#ffffff",
};

export function EmailShell({
  preview,
  children,
}: {
  preview: string;
  children: ReactNode;
}) {
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
            padding: "40px 36px",
          }}
        >
          {children}
        </Container>
        <Text
          style={{
            textAlign: "center",
            color: colors.muted,
            fontSize: "12px",
            marginTop: "24px",
          }}
        >
          David Kinuthia · Senior product engineer
        </Text>
      </Body>
    </Html>
  );
}

export { Body, Button, Container, Heading, Hr, Link, Section, Text };
