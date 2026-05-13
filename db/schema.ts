import {
  index,
  integer,
  jsonb,
  pgTable,
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
