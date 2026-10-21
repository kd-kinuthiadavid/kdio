CREATE TABLE IF NOT EXISTS "document_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"document_id" uuid NOT NULL,
	"amount_minor" bigint NOT NULL,
	"currency" text NOT NULL,
	"paid_on" date NOT NULL,
	"method" text NOT NULL,
	"reference" text,
	"notes" text,
	"created_by" text DEFAULT 'admin' NOT NULL,
	CONSTRAINT "document_payments_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE cascade,
	CONSTRAINT "document_payments_amount_positive" CHECK ("amount_minor" > 0)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "document_payments_document_idx" ON "document_payments" ("document_id","paid_on");
