CREATE TABLE "hero_slides" (
	"id" text PRIMARY KEY NOT NULL,
	"src" text NOT NULL,
	"alt" text NOT NULL,
	"href" text,
	"is_for_mobile" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"duration" integer,
	"created_at" timestamp NOT NULL
);
