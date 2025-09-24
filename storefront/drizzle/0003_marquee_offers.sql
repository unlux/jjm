CREATE TABLE "offers" (
	"id" text PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"href" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp NOT NULL
);
