ALTER TABLE "guests" RENAME COLUMN "host_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "guests" DROP CONSTRAINT "guests_user_id_fk";
--> statement-breakpoint
DROP INDEX "idx_guests_user_id";--> statement-breakpoint
ALTER TABLE "guests" ALTER COLUMN "phone" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "guests" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guests" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guests" ADD COLUMN "phone_last4" text;--> statement-breakpoint
ALTER TABLE "guests" ADD COLUMN "relation" varchar(50) DEFAULT 'friend';--> statement-breakpoint
ALTER TABLE "guests" ADD COLUMN "status" varchar(50) DEFAULT 'ACTIVE';--> statement-breakpoint
ALTER TABLE "guests" ADD COLUMN "invite_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "guests" ADD COLUMN "last_invited_at" timestamp;--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_guests_phone_last4" ON "guests" USING btree ("phone_last4");--> statement-breakpoint
CREATE INDEX "idx_guests_status" ON "guests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_guests_user_id" ON "guests" USING btree ("user_id");