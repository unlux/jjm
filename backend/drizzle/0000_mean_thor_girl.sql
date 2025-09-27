CREATE TABLE IF NOT EXISTS "affiliate_coupons" (
	"code" text PRIMARY KEY NOT NULL,
	"times_used" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
