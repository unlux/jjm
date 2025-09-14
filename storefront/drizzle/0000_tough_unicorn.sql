CREATE TABLE "blogs" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"published_at" timestamp NOT NULL,
	"category" text NOT NULL,
	"image" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"author" text NOT NULL,
	"author_image" text NOT NULL
);
