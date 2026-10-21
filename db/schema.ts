import {
  type AnyPgColumn,
  bigint,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const assessmentSubmissions = pgTable(
  "assessment_submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    email: text("email"),
    locale: text("locale").notNull().default("en"),
    status: text("status").notNull().$type<"draft" | "completed">(),
    answersJson: jsonb("answers_json")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    assessmentVersion: integer("assessment_version").notNull().default(1),
    utmJson: jsonb("utm_json").$type<Record<string, string> | null>(),
    tier: text("tier"),
    serviceId: text("service_id"),
    totalScore: integer("total_score"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    /** Opaque id embedded in signed resume JWT for replay-safe verification */
    resumeJti: text("resume_jti").notNull(),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    dropoffEmailSentAt: timestamp("dropoff_email_sent_at", {
      withTimezone: true,
    }),
  },
  (t) => [
    index("assessment_submissions_status_last_activity_idx").on(
      t.status,
      t.lastActivityAt
    ),
    index("assessment_submissions_email_idx").on(t.email),
  ]
);

export type AssessmentSubmissionRow =
  typeof assessmentSubmissions.$inferSelect;
export type AssessmentSubmissionInsert =
  typeof assessmentSubmissions.$inferInsert;

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email"),
  phone: text("phone"),
  addressLines: jsonb("address_lines").$type<string[]>().notNull().default([]),
  country: text("country"),
  /** KRA PIN for Kenyan clients, VAT/EIN or similar abroad */
  taxId: text("tax_id"),
  defaultCurrency: text("default_currency").notNull().default("USD"),
  paymentTermsDays: integer("payment_terms_days").notNull().default(14),
  notes: text("notes"),
});

export type CustomerRow = typeof customers.$inferSelect;
export type CustomerInsert = typeof customers.$inferInsert;

export type DocumentType = "invoice" | "credit_note" | "debit_note";
export type DocumentStatus = "draft" | "issued" | "void";

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    type: text("type").notNull().$type<DocumentType>(),
    status: text("status").notNull().default("draft").$type<DocumentStatus>(),
    /** Assigned on issue; null while draft */
    number: text("number").unique(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id),
    relatedDocumentId: uuid("related_document_id").references(
      (): AnyPgColumn => documents.id
    ),
    currency: text("currency").notNull(),
    totalMinor: bigint("total_minor", { mode: "number" }).notNull().default(0),
    /** Type-specific payload, validated by the registry schema for `type` */
    data: jsonb("data").$type<Record<string, unknown>>().notNull(),
    schemaVersion: integer("schema_version").notNull().default(1),
    /** Issuer and customer frozen at issue time */
    snapshot: jsonb("snapshot").$type<Record<string, unknown> | null>(),
    etims: jsonb("etims").$type<Record<string, unknown> | null>(),
    createdBy: text("created_by").notNull().default("admin"),
    issuedAt: timestamp("issued_at", { withTimezone: true }),
    voidedAt: timestamp("voided_at", { withTimezone: true }),
  },
  (t) => [
    index("documents_type_status_idx").on(t.type, t.status),
    index("documents_customer_idx").on(t.customerId),
    index("documents_related_idx").on(t.relatedDocumentId),
  ]
);

export type DocumentRow = typeof documents.$inferSelect;
export type DocumentInsert = typeof documents.$inferInsert;

export const documentSequences = pgTable(
  "document_sequences",
  {
    type: text("type").notNull(),
    year: integer("year").notNull(),
    nextValue: integer("next_value").notNull(),
  },
  (t) => [primaryKey({ columns: [t.type, t.year] })]
);

export const documentEvents = pgTable(
  "document_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    actor: text("actor").notNull().default("admin"),
    payload: jsonb("payload").$type<Record<string, unknown> | null>(),
  },
  (t) => [index("document_events_document_idx").on(t.documentId, t.createdAt)]
);

export type DocumentEventRow = typeof documentEvents.$inferSelect;
