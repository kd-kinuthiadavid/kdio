CREATE TABLE IF NOT EXISTS "assessment_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text,
	"locale" text DEFAULT 'en' NOT NULL,
	"status" text NOT NULL,
	"answers_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"assessment_version" integer DEFAULT 1 NOT NULL,
	"utm_json" jsonb,
	"tier" text,
	"service_id" text,
	"total_score" integer,
	"completed_at" timestamp with time zone,
	"resume_jti" text NOT NULL,
	"last_activity_at" timestamp with time zone DEFAULT now() NOT NULL,
	"dropoff_email_sent_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "assessment_submissions_status_last_activity_idx" ON "assessment_submissions" ("status","last_activity_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "assessment_submissions_email_idx" ON "assessment_submissions" ("email");
