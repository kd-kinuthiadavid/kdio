import { z } from "zod";

import { brand } from "@/lib/brand";

export const issuerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  addressLines: z.array(z.string()),
  kraPin: z.string().optional(),
  vatNumber: z.string().optional(),
  paymentLines: z.array(z.string()),
});

export type Issuer = z.infer<typeof issuerSchema>;

/** Env values may encode line breaks as a literal "\n" (single-line .env entries). */
function lines(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(/\\n|\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function optional(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

export function getIssuer(): Issuer {
  return issuerSchema.parse({
    name: optional(process.env.ISSUER_NAME) ?? brand.name,
    email: optional(process.env.ISSUER_EMAIL),
    phone: optional(process.env.ISSUER_PHONE),
    website: optional(process.env.ISSUER_WEBSITE),
    addressLines: lines(process.env.ISSUER_ADDRESS),
    kraPin: optional(process.env.ISSUER_KRA_PIN),
    vatNumber: optional(process.env.ISSUER_VAT_NUMBER),
    paymentLines: lines(process.env.ISSUER_PAYMENT_DETAILS),
  });
}
