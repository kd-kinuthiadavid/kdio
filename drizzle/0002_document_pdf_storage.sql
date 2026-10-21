ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "pdf_pathname" text;
--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "pdf_sha256" text;
