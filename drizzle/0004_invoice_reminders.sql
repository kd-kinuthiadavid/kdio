ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "reminders_paused_at" timestamp with time zone;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"ran_at" timestamp with time zone DEFAULT now() NOT NULL,
	"result" jsonb
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_runs_name_ran_at_idx" ON "job_runs" ("name","ran_at");
