import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { customers, type CustomerRow } from "@/db/schema";
import { getDb } from "@/lib/db";
import { CURRENCIES } from "@/lib/documents/money";

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v ? v : null))
  .nullable()
  .optional();

export const customerInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  company: optionalText,
  email: z
    .string()
    .trim()
    .transform((v) => (v ? v : null))
    .pipe(z.string().email("Enter a valid email").nullable()),
  phone: optionalText,
  addressLines: z.array(z.string().trim()).transform((ls) => ls.filter(Boolean)),
  country: optionalText,
  taxId: optionalText,
  defaultCurrency: z.enum(CURRENCIES),
  paymentTermsDays: z.coerce.number().int().min(0).max(365),
  notes: optionalText,
});

export type CustomerInput = z.input<typeof customerInputSchema>;

export async function listCustomers(): Promise<CustomerRow[]> {
  return getDb().select().from(customers).orderBy(asc(customers.name));
}

export async function getCustomer(id: string): Promise<CustomerRow | null> {
  const [row] = await getDb()
    .select()
    .from(customers)
    .where(eq(customers.id, id))
    .limit(1);
  return row ?? null;
}

export async function createCustomer(input: z.output<typeof customerInputSchema>) {
  const [row] = await getDb()
    .insert(customers)
    .values({ ...input, email: input.email ?? null })
    .returning({ id: customers.id });
  return row;
}

export async function updateCustomer(
  id: string,
  input: z.output<typeof customerInputSchema>
) {
  await getDb()
    .update(customers)
    .set({ ...input, email: input.email ?? null, updatedAt: new Date() })
    .where(eq(customers.id, id));
}

export function customerDisplayName(c: Pick<CustomerRow, "name" | "company">): string {
  return c.company ? `${c.company} (${c.name})` : c.name;
}
