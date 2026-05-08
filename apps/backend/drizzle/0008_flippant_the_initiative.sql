ALTER TABLE "guests" DROP CONSTRAINT "guests_user_id_fk";
--> statement-breakpoint
DROP INDEX "idx_guests_user_id";--> statement-breakpoint
ALTER TABLE "guests" ADD COLUMN "host_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_user_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_guests_user_id" ON "guests" USING btree ("host_id");--> statement-breakpoint
ALTER TABLE "guests" DROP COLUMN "user_id";