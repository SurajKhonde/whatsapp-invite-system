CREATE TABLE "whatsapp_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_name" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"language" varchar(10) DEFAULT 'en',
	"template_body" text NOT NULL,
	"header_text" text,
	"footer_text" text,
	"has_image" boolean DEFAULT false,
	"image_position" varchar(50),
	"parameters" jsonb,
	"example" jsonb,
	"whatsapp_template_id" varchar(100),
	"whatsapp_category" varchar(50) DEFAULT 'TRANSACTIONAL',
	"whatsapp_status" varchar(50) DEFAULT 'PENDING_DELETION',
	"approved_at" timestamp,
	"rejection_reason" text,
	"template_json" jsonb,
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "whatsapp_templates_template_name_unique" UNIQUE("template_name"),
	CONSTRAINT "whatsapp_templates_whatsapp_template_id_unique" UNIQUE("whatsapp_template_id")
);
--> statement-breakpoint
CREATE TABLE "payment_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"event_id" uuid,
	"razorpay_order_id" varchar(255) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'INR',
	"razorpay_payment_id" varchar(255),
	"razorpay_signature" varchar(512),
	"status" varchar(50) DEFAULT 'created',
	"base_cost" numeric(10, 2),
	"per_guest_cost" numeric(10, 2),
	"total_guests" varchar(10),
	"platform_fee" numeric(10, 2),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "payment_orders_razorpay_order_id_unique" UNIQUE("razorpay_order_id")
);
--> statement-breakpoint
CREATE TABLE "pricing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(500),
	"base_cost" numeric(10, 2) NOT NULL,
	"per_guest_cost" numeric(10, 2) NOT NULL,
	"platform_fee_percentage" numeric(5, 2) DEFAULT '20',
	"min_guests" varchar(10),
	"max_guests" varchar(10),
	"includes_image_generation" boolean DEFAULT false,
	"includes_priority_support" boolean DEFAULT false,
	"includes_analytics" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "payments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pricing_config" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "payments" CASCADE;--> statement-breakpoint
DROP TABLE "pricing_config" CASCADE;--> statement-breakpoint
ALTER TABLE "event_guests" DROP CONSTRAINT "event_guests_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "event_guests" DROP CONSTRAINT "event_guests_guest_id_guests_id_fk";
--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "events_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "guests" DROP CONSTRAINT "guests_host_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "idx_guests_host";--> statement-breakpoint
ALTER TABLE "event_guests" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "event_guests" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "template_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "event_type" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "event_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "status" SET DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "guests" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "guests" ALTER COLUMN "phone" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "guests" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "guests" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "templates" ALTER COLUMN "title" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "templates" ALTER COLUMN "category" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "templates" ALTER COLUMN "template_json" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "templates" ALTER COLUMN "image_url" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "event_guests" ADD COLUMN "whatsapp_status" varchar(50) DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "event_guests" ADD COLUMN "message_id" varchar(255);--> statement-breakpoint
ALTER TABLE "event_guests" ADD COLUMN "whatsapp_message_id" varchar(255);--> statement-breakpoint
ALTER TABLE "event_guests" ADD COLUMN "sent_at" timestamp;--> statement-breakpoint
ALTER TABLE "event_guests" ADD COLUMN "read_at" timestamp;--> statement-breakpoint
ALTER TABLE "event_guests" ADD COLUMN "failed_at" timestamp;--> statement-breakpoint
ALTER TABLE "event_guests" ADD COLUMN "error_code" varchar(100);--> statement-breakpoint
ALTER TABLE "event_guests" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "event_name" varchar(255);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "groom_name" varchar(255);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "bride_name" varchar(255);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "event_date" date;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "event_time" time;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "venue_name" varchar(255);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "venue_address" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "city" varchar(100);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "state" varchar(100);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "postal_code" varchar(20);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "country" varchar(100);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "delivered_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "read_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "pending_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "template_name" varchar(255);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "message_type" varchar(50) DEFAULT 'text_only';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "whatsapp_template_id" varchar(255);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "template_params" jsonb;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "image_url" varchar(500);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "image_generation_job_id" varchar(100);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "image_approved_at" timestamp;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "payment_id" varchar(255);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "razorpay_order_id" varchar(255);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "razorpay_payment_id" varchar(255);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "amount_paid" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "payment_status" varchar(50);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "guests" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "guests" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "guests" ADD COLUMN "country_code" varchar(5) DEFAULT '+91';--> statement-breakpoint
ALTER TABLE "guests" ADD COLUMN "is_whatsapp_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "whatsapp_template_name" varchar(255);--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "whatsapp_category" varchar(100);--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "whatsapp_language_code" varchar(10) DEFAULT 'en';--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "whatsapp_parameters" jsonb;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "whatsapp_approved_at" timestamp;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "whatsapp_rejection_reason" text;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "whatsapp_template_id" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_hash" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_image_url" varchar(500);--> statement-breakpoint
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_whatsapp_templates_category" ON "whatsapp_templates" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_whatsapp_templates_is_active" ON "whatsapp_templates" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_whatsapp_templates_template_name" ON "whatsapp_templates" USING btree ("template_name");--> statement-breakpoint
CREATE INDEX "idx_whatsapp_templates_whatsapp_status" ON "whatsapp_templates" USING btree ("whatsapp_status");--> statement-breakpoint
CREATE INDEX "idx_whatsapp_templates_whatsapp_template_id" ON "whatsapp_templates" USING btree ("whatsapp_template_id");--> statement-breakpoint
CREATE INDEX "idx_whatsapp_templates_created_at" ON "whatsapp_templates" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_payment_orders_user_id" ON "payment_orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_payment_orders_event_id" ON "payment_orders" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "idx_payment_orders_status" ON "payment_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_payment_orders_razorpay_order_id" ON "payment_orders" USING btree ("razorpay_order_id");--> statement-breakpoint
CREATE INDEX "idx_payment_orders_razorpay_payment_id" ON "payment_orders" USING btree ("razorpay_payment_id");--> statement-breakpoint
CREATE INDEX "idx_payment_orders_created_at" ON "payment_orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_pricing_is_active" ON "pricing" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_pricing_created_at" ON "pricing" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "event_guests" ADD CONSTRAINT "event_guests_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_guests" ADD CONSTRAINT "event_guests_guest_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_event_guests_event_id" ON "event_guests" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "idx_event_guests_guest_id" ON "event_guests" USING btree ("guest_id");--> statement-breakpoint
CREATE INDEX "idx_event_guests_status" ON "event_guests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_event_guests_whatsapp_status" ON "event_guests" USING btree ("whatsapp_status");--> statement-breakpoint
CREATE INDEX "idx_event_guests_sent_at" ON "event_guests" USING btree ("sent_at");--> statement-breakpoint
CREATE INDEX "idx_event_guests_created_at" ON "event_guests" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_events_user_id" ON "events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_events_status" ON "events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_events_event_date" ON "events" USING btree ("event_date");--> statement-breakpoint
CREATE INDEX "idx_events_template_id" ON "events" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "idx_events_payment_status" ON "events" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "idx_events_created_at" ON "events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_events_updated_at" ON "events" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "idx_guests_user_id" ON "guests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_guests_email" ON "guests" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_guests_created_at" ON "guests" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_templates_category" ON "templates" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_templates_is_active" ON "templates" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_templates_whatsapp_template_id" ON "templates" USING btree ("whatsapp_template_id");--> statement-breakpoint
CREATE INDEX "idx_templates_created_at" ON "templates" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_users_is_active" ON "users" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_users_created_at" ON "users" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "guests" DROP COLUMN "host_id";--> statement-breakpoint
ALTER TABLE "guests" DROP COLUMN "relation";--> statement-breakpoint
ALTER TABLE "guests" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "guests" DROP COLUMN "invite_count";--> statement-breakpoint
ALTER TABLE "guests" DROP COLUMN "last_invited_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_email_verified";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email_otp";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "otp_expires_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "otp_purpose";--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_whatsapp_template_id_unique" UNIQUE("whatsapp_template_id");