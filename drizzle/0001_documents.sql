CREATE TABLE IF NOT EXISTS "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"company" text,
	"email" text,
	"phone" text,
	"address_lines" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"country" text,
	"tax_id" text,
	"default_currency" text DEFAULT 'USD' NOT NULL,
	"payment_terms_days" integer DEFAULT 14 NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"number" text,
	"customer_id" uuid NOT NULL,
	"related_document_id" uuid,
	"currency" text NOT NULL,
	"total_minor" bigint DEFAULT 0 NOT NULL,
	"data" jsonb NOT NULL,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"snapshot" jsonb,
	"etims" jsonb,
	"created_by" text DEFAULT 'admin' NOT NULL,
	"issued_at" timestamp with time zone,
	"voided_at" timestamp with time zone,
	CONSTRAINT "documents_number_unique" UNIQUE("number"),
	CONSTRAINT "documents_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "customers"("id"),
	CONSTRAINT "documents_related_document_id_documents_id_fk" FOREIGN KEY ("related_document_id") REFERENCES "documents"("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document_sequences" (
	"type" text NOT NULL,
	"year" integer NOT NULL,
	"next_value" integer NOT NULL,
	CONSTRAINT "document_sequences_type_year_pk" PRIMARY KEY("type","year")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"document_id" uuid NOT NULL,
	"type" text NOT NULL,
	"actor" text DEFAULT 'admin' NOT NULL,
	"payload" jsonb,
	CONSTRAINT "document_events_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_type_status_idx" ON "documents" ("type","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_customer_idx" ON "documents" ("customer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_related_idx" ON "documents" ("related_document_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "document_events_document_idx" ON "document_events" ("document_id","created_at");
